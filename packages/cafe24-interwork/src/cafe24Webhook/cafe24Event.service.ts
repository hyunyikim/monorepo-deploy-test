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
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
	) {}

	async handleDeliveryHook(
		traceId: string,
		webHook: WebHookBody<EventBatchOrderShipping>
	) {
		this.logger.log(
			`Delivery Hook Start
			EventType: ${webHook.event_no}
			OrderIDs: ${webHook.resource.order_id}
			MallId: ${webHook.resource.mall_id}`
		);
		const hook = await this.addInterworkInfo(webHook);
		this.logger.log(`Passed auth and refreshed token`);
		const orderItems = of(hook).pipe(
			concatMap((hook) => this.divideEachOrderId(hook)),
			mergeMap((hook) => this.addOrderInfo(hook)),
			concatMap((hook) => this.divideEachOrderItem(hook)),
			mergeMap((hook) => this.addNftInfo(hook)),
			map((hook) => this.categorizeAction(hook)),
			mergeMap((hook) => this.addProductInfo(hook)),
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

	private divideEachOrderId({
		interwork,
		webHook,
	}: {
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		return webHook.resource.order_id.split(',').map((orderId) => ({
			orderId,
			interwork,
			webHook,
		}));
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

	private async addOrderInfo(hook: {
		orderId: string;
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const {webHook, interwork, orderId} = hook;

		const order = await this.cafe24Api.getOrder(
			webHook.resource.mall_id,
			interwork.accessToken.access_token,
			orderId
		);
		this.logger.log(`order: ${JSON.stringify(order)}`);
		return {
			order,
			...hook,
		};
	}

	private divideEachOrderItem(hook: {
		orderId: string;
		order: Order;
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		return hook.order.items.flatMap((item) => {
			return [...Array(item.quantity).keys()].map(() => ({
				...hook,
				item,
			}));
		});
	}

	private categorizeAction(hook: {
		orderId: string;
		order: Order;
		item: OrderItem;
		interwork: Cafe24Interwork;
		nftReqIdx: number | undefined;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const status = hook.item.order_status as CAFE24_ORDER_STATUS;
		const issued = !!hook.nftReqIdx;
		const action =
			status === CAFE24_ORDER_STATUS.DELIVERED && !issued
				? WEBHOOK_ACTION.ISSUE
				: orderStatus2Action(status);

		return {
			...hook,
			action,
		};
	}

	private async addProductInfo(hook: {
		orderId: string;
		order: Order;
		item: OrderItem;
		interwork: Cafe24Interwork;
		nftReqIdx: number | undefined;
		webHook: WebHookBody<EventBatchOrderShipping>;
		action: WEBHOOK_ACTION;
	}) {
		const productNo = hook.item.product_no;
		const mallId = hook.webHook.resource.mall_id;
		const accessToken = hook.interwork.accessToken.access_token;
		const productInfo =
			hook.action === WEBHOOK_ACTION.ISSUE
				? await this.cafe24Api.getProductResource(
						mallId,
						accessToken,
						productNo
				  )
				: undefined;
		this.logger.log(`productInfo: ${JSON.stringify(productInfo)}`);
		return {
			...hook,
			productInfo,
		};
	}

	private async handleAction(
		hook: {
			orderId: string;
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
			case WEBHOOK_ACTION.PASS:
				return hook;
			default:
				return hook;
		}
	}

	private async issueGuarantee(
		hook: {
			orderId: string;
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
		 * 이미지가 없을 경우 null로 처리. (SXLP-2954 )
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
				orderId: hook.orderId,
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

	private targetCategory(hook: {
		orderId: string;
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
			orderId: string;
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
				orderId: hook.orderId,
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
			orderId: string;
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

	private async addNftInfo(hook: {
		orderId: string;
		order: Order;
		item: OrderItem;
		interwork: Cafe24Interwork;
		webHook: WebHookBody<EventBatchOrderShipping>;
	}) {
		const item = hook.item;
		const reqList = await this.guaranteeReqRepo.getRequestListByOrderId(
			hook.orderId,
			hook.interwork.mallId
		);
		this.logger.log(`reqList: ${JSON.stringify(reqList)}`);

		let req = reqList.find(
			(req) =>
				req.orderItemCode === item.order_item_code && !req.canceledAt
		);

		if (!req) {
			req = reqList.find(
				(req) =>
					req.productCode === item.product_code && !req.canceledAt
			);
		}

		return {
			...hook,
			nftReqIdx: req?.reqIdx,
		};
	}
}
