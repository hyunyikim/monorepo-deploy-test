import {Inject, Injectable, LoggerService} from '@nestjs/common';
import {
	Cafe24Interwork,
	EventBatchOrderShipping,
	GuaranteeRequest,
	IssueSetting,
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
import {concatMap, mergeMap, of, toArray, lastValueFrom, map} from 'rxjs';
import {
	CAFE24_ORDER_STATUS,
	orderStatus2Action,
	WEBHOOK_ACTION,
} from 'src/common/constant/constant';
import {SqsService} from 'src/sqs/sqs.service';
import {Cron} from '@nestjs/schedule';
import {SlackReporter} from 'src/slackReporter';
import {WebhookResponse} from 'src/cafe24Webhook/cafe24Event.dto';
import {ErrorResponse} from 'src/common/error';
import {ErrorMetadata} from 'src/common/error-metadata';

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

		try {
			if (webHook.resource.event_shop_no !== '1') {
				throw new ErrorResponse(ErrorMetadata.notDefaultShopNo);
			}

			const interwork = await this.addInterworkInfo(webHook);

			const mallId = interwork.mallId;
			const accessToken = interwork.accessToken.access_token;
			const orders = await this.addOrdersInfo(
				mallId,
				accessToken,
				webHook.resource.order_id
			);
			const {isIssueAll, categoryIdxList} = this.filteringProductCategory(
				interwork.issueSetting
			);
			const products = await this.addProductsInfo(
				mallId,
				accessToken,
				orders,
				isIssueAll,
				categoryIdxList
			);

			const hook = {interwork, webHook, orders, products};
			const orderItems = of(hook).pipe(
				concatMap((hook) => this.divideEachOrder(hook)),
				mergeMap((hook) => this.addNftInfo(hook)),
				concatMap((hook) => this.divideEachOrderItem(hook)),
				map((hook) => this.categorizeAction(hook)),
				toArray()
			);
			const actions = await lastValueFrom(orderItems).catch(() => {
				this.logger.log('개런티 발급 대상 주문이 아닙니다.');
				return [];
			});

			const result: WebhookResponse[] = [];
			for (const action of actions) {
				result.push(
					new WebhookResponse(
						await this.handleAction(action, traceId)
					)
				);
			}

			this.logger.log(result);
			return result;
		} catch (error) {
			if (error instanceof ErrorResponse === false) {
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
			}

			throw error;
		}
	}

	private async addInterworkInfo(
		webHook: WebHookBody<EventBatchOrderShipping>
	) {
		const interwork = await this.interworkRepo.getInterwork(
			webHook.resource.mall_id
		);
		if (!interwork) {
			throw new ErrorResponse(ErrorMetadata.notFoundInterworkInfo);
		}
		if (!interwork.confirmedAt) {
			throw new ErrorResponse(ErrorMetadata.notCompleteInterwork);
		}
		if (interwork.leavedAt) {
			throw new ErrorResponse(ErrorMetadata.canceledInterwork);
		}

		return interwork;
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

	private async addOrdersInfo(
		mallId: string,
		accessToken: string,
		orderId: string
	) {
		const CAFE24_LIMIT = 1000; // cafe24 api CAFE24_LIMIT

		const orderIds = orderId.split(',');
		let orders: Array<Order> = [];
		for (let i = orderIds.length; i > 0; i -= CAFE24_LIMIT) {
			const list = orderIds.splice(0, CAFE24_LIMIT).join(',');
			const getOrders = await this.cafe24Api.getOrderList(
				mallId,
				accessToken,
				list
			);
			orders = [...orders, ...getOrders];
		}

		if (!orders.length) {
			throw new ErrorResponse(ErrorMetadata.notFoundOrderInCafe24);
		}
		this.logger.log(`orders: ${JSON.stringify(orders)}`);
		this.logger.log(`orders length: ${orders.length}`);

		return orders;
	}

	private filteringProductCategory(issueSetting: IssueSetting) {
		this.logger.log(
			`issueSetting issueAll => ${
				issueSetting.issueAll ? 'true' : 'false'
			}`
		);

		//설정한 카테고리로 필터링 생성
		let categoryIdxList: Array<number> = [];
		if (!issueSetting.issueAll) {
			categoryIdxList = issueSetting.issueCategories.map(
				(category) => category.idx
			);
			this.logger.log(
				`filtering categories => ${categoryIdxList.join(',')}`
			);
		}

		return {
			categoryIdxList,
			isIssueAll: issueSetting.issueAll,
		};
	}

	private async addProductsInfo(
		mallId: string,
		accessToken: string,
		orders: Array<Order>,
		isIssueAll: boolean,
		categoryIdxList: Array<number>
	) {
		const CAFE24_LIMIT = 100; // cafe24 products api CAFE24_LIMIT

		let products: Array<Product> = [];

		if (isIssueAll) {
			const productNoSet = new Set(); // TODO: 중복처리를 안해도 될지,, cafe24에서는 중복되지 않고 나오고 있음.
			orders.forEach((order) => {
				order.items.forEach((item) =>
					productNoSet.add(item.product_no)
				);
			});
			const productNoList = Array.from(productNoSet);

			// TODO: productNoList CAFE24_LIMIT씩 먼저 잘라서
			for (let i = productNoList.length; i > 0; i -= CAFE24_LIMIT) {
				const list = productNoList.splice(0, CAFE24_LIMIT).join(',');
				const getProducts = await this.cafe24Api.getProductResourceList(
					mallId,
					accessToken,
					list
				);
				products = [...products, ...getProducts];
			}
		} else {
			for (const categoryIdx of categoryIdxList) {
				const getProducts =
					await this.cafe24Api.getProductResourceListByCategory(
						mallId,
						accessToken,
						categoryIdx
					);
				products = [...products, ...getProducts];
			}
			this.logger.log(
				`category matching products => ${products
					.map((product) => product.product_no)
					.join(',')}`
			);
		}

		if (!products.length) {
			throw new ErrorResponse(ErrorMetadata.notFoundProductInCafe24);
		}

		this.logger.log(`products: ${JSON.stringify(products)}`);
		this.logger.log(`products length: ${products.length}`);
		return products;
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
		this.logger.log(`reqList length: ${reqList.length}`);

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
			const productInfo = hook.products.find(
				(product) => product.product_no === item.product_no
			);
			if (!productInfo) {
				return [];
			}
			return [...Array(item.quantity).keys()].map((_, idx) => ({
				...hook,
				item,
				productInfo,
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
		this.logger.log(
			`status => ${status}, isIssued => ${isIssued ? 'true' : 'false'}`
		);
		const action = orderStatus2Action(status, isIssued);
		return {
			...hook,
			action,
		};
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
			throw new ErrorResponse(ErrorMetadata.noAuthForCoreApi);
		}
		if (!hook.productInfo) {
			throw new ErrorResponse(
				ErrorMetadata.internalServerError('NO_PRODUCT_INFO')
			);
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
		this.logger.log(
			`ORDER ITEM ID [${
				item.order_item_code
			}], ISSUE REQ ${JSON.stringify(nftReq)}`
		);

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
			throw new ErrorResponse(
				ErrorMetadata.internalServerError('NO_NFT_IDX')
			);
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
			throw new ErrorResponse(ErrorMetadata.noAuthForCoreApi);
		}
		if (!hook.nftReqIdx) {
			throw new ErrorResponse(ErrorMetadata.noGuaranteeForCancel);
		}
		const nftReqIdx = hook.nftReqIdx;
		await this.vircleCoreApi.cancelGuarantee(token, nftReqIdx);
		await this.updateOnDynamo(traceId, hook);
		return hook;
	}
}
