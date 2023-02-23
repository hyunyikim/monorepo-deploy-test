import {
	Inject,
	Injectable,
	InternalServerErrorException,
	LoggerService,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import {
	Cafe24Interwork,
	EventBatchOrderShipping,
	GuaranteeRequest,
	WebHookBody,
} from '../cafe24Interwork';
import {Cafe24API, Order, OrderItem, Product} from '../cafe24Api';
import {InterworkRepository, GuaranteeRequestRepository} from '../dynamo';
import {DateTime} from 'luxon';
import {GuaranteeRequestPayload, VircleCoreAPI} from '../vircleCoreApiService';
import {TokenRefresher} from '../tokenRefresher';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import axios from 'axios';
import {Readable} from 'stream';
import {
	concatMap,
	mergeMap,
	of,
	toArray,
	lastValueFrom,
	map,
	groupBy,
} from 'rxjs';
import {
	CAFE24_ORDER_STATUS,
	orderStatus2Action,
	WEBHOOK_ACTION,
} from 'src/common/constant/constant';
import {SqsService} from 'src/sqs/sqs.service';
import {Cron} from '@nestjs/schedule';
import {SlackReporter} from 'src/slackReporter';

@Injectable()
export class Cafe24EventService {
	constructor(
		@Inject(Cafe24API) private cafe24Api: Cafe24API,
		@Inject(InterworkRepository)
		private interworkRepo: InterworkRepository,
		@Inject(GuaranteeRequestRepository)
		private guaranteeReqRepo: GuaranteeRequestRepository,
		@Inject(VircleCoreAPI) private vircleCoreApi: VircleCoreAPI,
		@Inject(TokenRefresher) private tokenRefresher: TokenRefresher,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService,
		@Inject(SqsService) private sqsService: SqsService,
		@Inject(SlackReporter) private readonly slackReporter: SlackReporter
	) {}

	@Cron('*/20 * * * * *', {name: 'RETRY_DELIVERY_HOOK'})
	async retryDeliveryHook() {
		const message = await this.sqsService.consume();
		if (message) {
			let param: {
				traceId: string;
				webHook: WebHookBody<EventBatchOrderShipping>;
				retryCount: number;
			};
			try {
				param = JSON.parse(message.Body as string) as {
					traceId: string;
					webHook: WebHookBody<EventBatchOrderShipping>;
					retryCount: number;
				};
			} catch (e) {
				throw new Error('json parse error');
			}
			if (param.retryCount > 3) {
				this.slackReporter.sendWebhookFailed(
					param.traceId,
					param.webHook
				);
				this.logger.error({
					message: 'Tried webhook request 3 times but finally failed',
					param,
				});
				throw new Error(
					'Tried webhook request 3 times but finally failed'
				);
			} else {
				await this.handleDeliveryHook(
					param.traceId,
					param.webHook,
					param.retryCount
				);
			}
		}
	}

	async handleDeliveryHook(
		traceId: string,
		webHook: WebHookBody<EventBatchOrderShipping>,
		retryCount = 0
	) {
		this.logger.log(
			`Delivery Hook Start
			X-Trace-ID: ${traceId}
			EventType: ${webHook.event_no}
			OrderIDs: ${webHook.resource.order_id}
			MallId: ${webHook.resource.mall_id}
			ShopNo: ${webHook.resource.event_shop_no}
			`
		);
		if (webHook.resource.event_shop_no !== '1') {
			this.logger.log('기본 멀티몰의 주문번호가 아닙니다.');
			return;
		}

		try {
			const hook = await this.addInterworkInfo(webHook);
			this.logger.log(`Passed auth and refreshed token`);
			const orderItems = of(hook).pipe(
				mergeMap((hook) => this.addOrdersInfo(hook)),
				mergeMap((hook) => this.addProductsInfo(hook)),
				concatMap((hook) => this.divideEachOrder(hook)),
				mergeMap((hook) => this.addNftInfo(hook)),
				concatMap((hook) => this.divideEachOrderItem(hook)),
				map((hook) => this.categorizeAction(hook)),
				map((hook) => this.targetCategory(hook)),
				mergeMap((hook) => this.handleAction(hook, traceId))
			);

			const report$ = orderItems.pipe(
				groupBy((h) => h.action),
				mergeMap((h) =>
					h.pipe(
						map(({action, nftReqIdx, item}) => ({
							action,
							nftReqIdx,
							orderItemCode: item.order_item_code,
							status: item.order_status,
						})),
						toArray()
					)
				)
			);

			// TODO: 웹훅이니 응답을 줄 필요가 없다면 지워도 될 것 같다.
			const report = await lastValueFrom(report$);
			this.logger.log(report);
			return report;
		} catch (e) {
			await this.sqsService.send({
				MessageBody: JSON.stringify({
					traceId,
					webHook,
					retryCount: retryCount + 1,
				}),
				MessageAttributes: {
					mallId: {
						DataType: 'String',
						StringValue: webHook.resource.mall_id,
					},
					orderId: {
						DataType: 'String',
						StringValue: webHook.resource.order_id,
					},
				},
			});
			throw e;
		}
	}

	private async addInterworkInfo(
		webHook: WebHookBody<EventBatchOrderShipping>
	) {
		let interwork = await this.interworkRepo.getInterwork(
			webHook.resource.mall_id
		);
		if (!interwork || !interwork.confirmedAt || interwork.leavedAt) {
			throw new NotFoundException('Not Found Interwork Info');
		}
		interwork = await this.tokenRefresher.refreshExpiredAccessToken(
			interwork
		);
		return {
			interwork,
			webHook,
		};
	}

	private async addReqInfo(hook: {
		orderId: string;
		order: Order;
		item: OrderItem;
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const mallId = hook.interwork.mallId;
		const orderItemCode = hook.item.order_item_code;
		const res = await this.guaranteeReqRepo.getRequestListByOrderItemCode(
			orderItemCode,
			mallId
		);
		const nftReqIdx = res.pop()?.reqIdx;
		return {
			...hook,
			nftReqIdx,
		};
	}

	private async addOrdersInfo(hook: {
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const {webHook, interwork} = hook;
		const limit = 1000; // cafe24 api limit
		const mallId = webHook.resource.mall_id;
		const accessToken = interwork.accessToken.access_token;

		const orderIds = webHook.resource.order_id.split(',');
		let orders: Array<Order> = [];
		for (let i = orderIds.length; i > 0; i -= limit) {
			const list = orderIds.splice(0, limit).join(',');
			const getOrders = await this.cafe24Api.getOrderList(
				mallId,
				accessToken,
				list
			);
			orders = [...orders, ...getOrders];
		}

		this.logger.log(`orders: ${JSON.stringify(orders)}`);
		this.logger.log(`orders length: ${orders.length}`);
		return {
			orders,
			interwork,
			webHook,
		};
	}

	private async addProductsInfo(hook: {
		orders: Array<Order>;
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const {webHook, interwork, orders} = hook;
		const limit = 100; // cafe24 products api limit
		const mallId = webHook.resource.mall_id;
		const accessToken = interwork.accessToken.access_token;

		const productNoSet = new Set(); // TODO: 중복처리를 안해도 될지,, cafe24에서는 중복되지 않고 나오고 있음.
		orders.map((order) => {
			order.items.map((item) => productNoSet.add(item.product_no));
		});
		const productNoList = Array.from(productNoSet);

		let products: Array<Product> = [];
		for (let i = productNoList.length; i > 0; i -= limit) {
			const list = productNoList.splice(0, limit).join(',');
			const getProducts = await this.cafe24Api.getProductResourceList(
				mallId,
				accessToken,
				list
			);
			products = [...products, ...getProducts];
		}

		this.logger.log(`products: ${JSON.stringify(products)}`);
		this.logger.log(`products length: ${products.length}`);
		return {
			...hook,
			products,
		};
	}

	private divideEachOrder(hook: {
		orders: Array<Order>;
		products: Array<Product>;
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const {orders, products, interwork, webHook} = hook;
		return orders.map((order) => ({
			order,
			products,
			interwork,
			webHook,
		}));
	}

	private async addNftInfo(hook: {
		order: Order;
		products: Array<Product>;
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const reqList = await this.guaranteeReqRepo.getRequestListByOrderId(
			hook.order.order_id,
			hook.interwork.mallId
		);
		this.logger.log(`reqList: ${JSON.stringify(reqList)}`);

		return {
			...hook,
			nftList: reqList,
		};
	}

	private divideEachOrderItem(hook: {
		order: Order;
		products: Array<Product>;
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
		nftList: Array<GuaranteeRequest>;
	}) {
		const {nftList} = hook;
		return hook.order.items.flatMap((item) => {
			let itemNftList = nftList.filter(
				(nft) =>
					nft.orderItemCode === item.order_item_code &&
					!nft.canceledAt
			);
			if (!itemNftList.length) {
				itemNftList = nftList.filter(
					(nft) =>
						nft.productCode === item.product_code && !nft.canceledAt
				);
			}
			return [...Array(item.quantity).keys()].map((_, idx) => ({
				...hook,
				item,
				productInfo: hook.products.find(
					(product) => product.product_no === item.product_no
				),
				nftReqIdx: itemNftList[idx]?.reqIdx,
			}));
		});
	}

	private categorizeAction(hook: {
		order: Order;
		item: OrderItem;
		productInfo: Product | undefined;
		interwork: Cafe24Interwork;
		nftReqIdx: number | undefined;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const status = hook.item.order_status as CAFE24_ORDER_STATUS;
		const isIssued = !!hook.nftReqIdx;
		const action = orderStatus2Action(status, isIssued);

		return {
			...hook,
			action,
		};
	}

	private targetCategory(hook: {
		order: Order;
		item: OrderItem;
		interwork: Cafe24Interwork;
		productInfo: Product | undefined;
		webHook: WebHookBody<EventBatchOrderShipping>;
		action: WEBHOOK_ACTION;
		nftReqIdx: number | undefined;
	}) {
		const setting = hook.interwork.issueSetting;
		const productCategory = hook.productInfo?.category;

		//모든 카테코리에 대해서 발행함
		if (setting.issueAll) {
			return hook;
		}

		if (
			hook.action === WEBHOOK_ACTION.PASS ||
			hook.action === WEBHOOK_ACTION.CANCEL
		) {
			return hook;
		}

		//설정한 카테고리와 상품의 카테코리의 포함 관계를 확인
		const include = setting.issueCategories.some((category) => {
			return productCategory
				?.map((c) => c.category_no)
				.includes(category.idx);
		});

		if (hook.action === WEBHOOK_ACTION.ISSUE && !include) {
			hook.action = WEBHOOK_ACTION.PASS;
		}
		return hook;
	}

	private async handleAction(
		hook: {
			order: Order;
			item: OrderItem;
			interwork: Cafe24Interwork;
			nftReqIdx: number | undefined;
			webHook: WebHookBody<EventBatchOrderShipping>;
			action: WEBHOOK_ACTION;
			productInfo: Product | undefined;
		},
		traceId: string
	) {
		this.logger.log(`hook.action: ${hook.action}`);
		switch (hook.action) {
			case WEBHOOK_ACTION.ISSUE:
				const issued = await this.issueGuarantee(hook, traceId);
				return issued;
			case WEBHOOK_ACTION.CANCEL:
				const canceled = await this.cancelGuarantee(hook, traceId);
				return canceled;
			case WEBHOOK_ACTION.REISSUE:
				await this.cancelGuarantee(hook, traceId);
				const reissued = await this.issueGuarantee(hook, traceId);
				return reissued;
			case WEBHOOK_ACTION.PASS:
				return hook;
			default:
				return hook;
		}
	}

	private async issueGuarantee(
		hook: {
			order: Order;
			item: OrderItem;
			interwork: Cafe24Interwork;
			productInfo: Product | undefined;
			action: WEBHOOK_ACTION;
			webHook: WebHookBody<EventBatchOrderShipping>;
		},
		traceId: string
	) {
		const item = hook.item;
		const buyer = hook.order.buyer;
		const interwork = hook.interwork;
		const coreApiToken = hook.interwork.coreApiToken;
		if (!coreApiToken) {
			throw new UnauthorizedException('NO_AUTH_FOR_CORE_API');
		}
		if (!hook.productInfo) {
			throw new InternalServerErrorException('NO PRODUCT INFO');
		}
		/**
		 * 이미지가 없을 경우 null로 처리. (SXLP-2954)
		 */
		const {data: stream} = hook.productInfo.detail_image
			? await axios.get<Readable>(hook.productInfo.detail_image, {
					responseType: 'stream',
			  })
			: {data: null};

		/**
		 * 수동 발급=1, 자동발급=2
		 */
		const issueType = interwork.issueSetting.manually ? 1 : 2;

		const nftReq = await this.vircleCoreApi.requestGuarantee(
			coreApiToken,
			this.createDirectReqPayload(
				issueType.toString(),
				hook.order,
				buyer.name,
				buyer.cellphone,
				interwork,
				item,
				stream
			)
		);
		this.logger.log('ISSUE REQ', nftReq);

		await this.guaranteeReqRepo
			.putRequest({
				reqIdx: nftReq.nft_req_idx,
				reqState: nftReq.nft_req_state,
				productCode: hook.item.product_code,
				orderItemCode: hook.item.order_item_code,
				eventShopNo: hook.item.shop_no,
				reqAt: DateTime.now().toISO(),
				mallId: hook.interwork.mallId,
				orderId: hook.order.order_id,
				webhook: hook.webHook,
				productInfo: hook.productInfo,
				orderItem: hook.item,
				canceledAt: null,
				traceId,
			})
			.then((result) => {
				this.logger.log(`aws ddb guarantee put request success`);
			});

		return {
			...hook,
			nftReqIdx: nftReq.nft_req_idx,
		};
	}

	private createDirectReqPayload(
		issueType: string,
		{order_id, order_place_name, order_place_id}: Order,
		buyerName: string,
		buyerPhone: string,
		interwork: Cafe24Interwork,
		orderItem: OrderItem,
		image?: Readable | null
	): GuaranteeRequestPayload {
		return {
			productName: `${orderItem.product_name}`,
			price:
				parseInt(orderItem.product_price) +
				parseInt(orderItem.option_price),
			ordererName: buyerName,
			ordererTel: buyerPhone.replaceAll('-', ''),
			// (SXLP-2806): 판매처 변경
			platformName: ['self', 'mobile', 'mobile_d', 'NCHECKOUT'].includes(
				order_place_id
			)
				? '공식 홈페이지'
				: order_place_name,
			modelNum:
				orderItem.internal_product_name ||
				orderItem.custom_product_code ||
				undefined,
			warranty: interwork.partnerInfo?.warrantyDate,
			orderedAt: orderItem.ordered_date,
			orderId: order_id,
			brandIdx: interwork.partnerInfo?.brand?.idx,
			size: orderItem.volume_size ?? undefined,
			// 중량 표시 않함 (SXLP-2352) :weight: orderItem.product_weight ?? undefined,
			material: orderItem.product_material ?? undefined,
			nftState: issueType,
			image,
		};
	}

	private async updateOnDynamo(
		traceId: string,
		hook: {
			order: Order;
			item: OrderItem;
			interwork: Cafe24Interwork;
			webHook: WebHookBody<EventBatchOrderShipping>;
			nftReqIdx: number | undefined;
		}
	) {
		const idx = hook.nftReqIdx;
		if (!idx) {
			throw new InternalServerErrorException('IDX NOT DEFINED');
		}

		await this.guaranteeReqRepo
			.putRequest({
				reqIdx: idx,
				orderId: hook.order.order_id,
				mallId: hook.interwork.mallId,
				cancelTraceId: traceId,
				orderItemCode: hook.item.order_item_code,
				canceledAt: DateTime.now().toISO(),
				orderItem: hook.item,
			})
			.then((result) => {
				this.logger.log(`aws ddb guarantee put request success`);
			});

		return hook;
	}

	private async cancelGuarantee(
		hook: {
			order: Order;
			item: OrderItem;
			interwork: Cafe24Interwork;
			productInfo: Product | undefined;
			action: WEBHOOK_ACTION;
			webHook: WebHookBody<EventBatchOrderShipping>;
			nftReqIdx: number | undefined;
		},
		traceId: string
	) {
		const token = hook.interwork.coreApiToken;
		if (!token) {
			throw new UnauthorizedException('NOT_ALLOWED_RESOURCE_ACCESS');
		}
		if (!hook.nftReqIdx) {
			throw new InternalServerErrorException('CANCEL_REQUEST_REJECT');
		}
		const nftReqIdx = hook.nftReqIdx;
		await this.vircleCoreApi.cancelGuarantee(token, nftReqIdx);
		await this.updateOnDynamo(traceId, hook);
		return hook;
	}
}
