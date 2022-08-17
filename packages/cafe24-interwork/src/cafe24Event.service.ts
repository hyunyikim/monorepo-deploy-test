import {
	BadRequestException,
	ForbiddenException,
	Inject,
	Injectable,
	LoggerService,
	NotFoundException,
} from '@nestjs/common';
import {Cafe24Interwork, IssueTiming} from './interwork.entity';
import {Cafe24API} from './Cafe24ApiService/cafe24Api';
import {InterworkRepository} from './DynamoRepo/interwork.repository';
import {DateTime} from 'luxon';
import {VircleCoreAPI} from './vircleCoreApiService';
import {EventOrderShipping, WebHookBody} from './cafe24Interwork.dto';
import {GuaranteeRequestRepository} from './DynamoRepo';
import {TokenRefresher} from './tokenRefresher/tokenRefresher';
import {OrderItem} from './Cafe24ApiService';
import {GuaranteeRequest} from './guaranteeReq.entity';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';

@Injectable()
export class Cafe24EventService {
	private shippingEvent: IssueTiming[];
	constructor(
		@Inject(Cafe24API) private cafe24Api: Cafe24API,
		@Inject(InterworkRepository)
		private interworkRepo: InterworkRepository,
		@Inject(GuaranteeRequestRepository)
		private guaranteeReqRepo: GuaranteeRequestRepository,
		@Inject(VircleCoreAPI) private vircleCoreApi: VircleCoreAPI,
		@Inject(TokenRefresher) private tokenRefresher: TokenRefresher,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
	) {
		this.shippingEvent = ['AFTER_SHIPPING', 'AFTER_DELIVERED'];
	}

	async handleShippingWebhook(
		traceId: string,
		webHook: WebHookBody<EventOrderShipping>
	) {
		const issued: {code: string; status: string}[] = [];
		const canceled: {code: string; status: string}[] = [];
		const passed: {code: string; status: string}[] = [];

		const interwork = await this.getFreshInterwork(
			webHook.resource.mall_id
		);

		const orderItems = await this.cafe24Api.getOrderItems(
			webHook.resource.mall_id,
			interwork.accessToken.access_token,
			webHook.resource.order_id
		);

		if (orderItems.length === 0) {
			throw new BadRequestException('NO_TARGET_ORDER_ITEMS');
		}

		const reqList = await this.getGuaranteeRequests(webHook);

		for (const item of orderItems) {
			const status = item.order_status;
			const targetReqList = reqList.filter(
				(req) => req.orderItemCode === item.order_item_code
			);

			if (status === 'N40') {
				if (targetReqList.length) {
					//이미 발급 되어 있음
					passed.push({
						code: item.order_item_code,
						status: item.order_status,
					});

					continue;
				}
				this.sendRequestForGuarantee(interwork, item, webHook, traceId);
				issued.push({
					code: item.order_item_code,
					status: item.order_status,
				});
			} else if (['R40', 'E40'].includes(status)) {
				const cancelRequests: GuaranteeRequest[] = targetReqList;
				if (cancelRequests.length === 0) {
					const req = reqList.find(
						(req) => req.productCode === item.product_code
					);
					req && cancelRequests.push(req);
				}

				// 취소하고자 하는 대상을 찾을 수 없음, 또는 이미 취소됨
				if (cancelRequests.length === 0) {
					passed.push({
						code: item.order_item_code,
						status: item.order_status,
					});
					continue;
				}

				for (const req of cancelRequests) {
					if (req.canceledAt) {
						passed.push({
							code: item.order_item_code,
							status: item.order_status,
						});
						continue;
					}
					this.sendRequestCancel(interwork, item, req, traceId);
					canceled.push({
						code: item.order_item_code,
						status: item.order_status,
					});
				}
			} else {
				passed.push({
					code: item.order_item_code,
					status: item.order_status,
				});
			}
		}

		this.logger.log({issued, canceled, passed});
	}

	private async sendRequestCancel(
		interwork: Cafe24Interwork,
		orderItem: OrderItem,
		req: GuaranteeRequest,
		traceId: string
	) {
		if (!interwork.coreApiToken) {
			throw new ForbiddenException('No permission for vircle core-api');
		}

		await this.vircleCoreApi.cancelGuarantee(
			interwork.coreApiToken,
			req.reqIdx
		);
		req.cancelTraceId = traceId;
		req.orderItemCode = orderItem.order_item_code;
		req.orderItem = orderItem;
		req.canceledAt = DateTime.now().toISO();
		await this.guaranteeReqRepo.putRequest(req);
	}

	/**
	 * Vircle Core API를 이용하여 보증서를 발급한다.
	 * @param interwork 발급을 하려는 파트너 사의 연동정보
	 * @param orderItem 보증서를 발급하려는 대상 물품
	 * @param webHook cafe24 webhook이 전달한 객체
	 * @returns 보증서 발급 idx와 보증서 발급 상태
	 */
	private async sendRequestForGuarantee(
		interwork: Cafe24Interwork,
		orderItem: OrderItem,
		webHook: WebHookBody<EventOrderShipping>,
		traceId: string
	) {
		if (!interwork.coreApiToken) {
			throw new ForbiddenException('No auth for vircle core-api');
		}
		const DIRECT_ISSUE = '2';

		let q = orderItem.quantity;

		// 수량 만큽 발급
		while (q > 0) {
			q -= 1;

			const {nft_req_idx, nft_req_state} =
				await this.vircleCoreApi.requestGuarantee(
					interwork.coreApiToken,
					{
						productName: orderItem.product_name,
						price: parseInt(orderItem.product_price),
						ordererName: webHook.resource.buyer_name,
						ordererTel: webHook.resource.buyer_cellphone.replaceAll(
							'-',
							''
						),
						platformName: interwork.store.shop_name,
						modelNum: orderItem.product_code,
						warranty: interwork.partnerInfo?.warrantyDate,
						orderedAt: orderItem.ordered_date,
						orderId: webHook.resource.order_id,
						brandIdx: interwork.partnerInfo?.brand.idx,
						size: orderItem.volume_size ?? undefined,
						weight: orderItem.product_weight ?? undefined,
						material: orderItem.product_material ?? undefined,
						nftState: DIRECT_ISSUE,
					}
				);

			await this.guaranteeReqRepo.putRequest({
				reqIdx: nft_req_idx,
				productCode: orderItem.product_code,
				reqAt: DateTime.now().toISO(),
				reqState: nft_req_state,
				mallId: webHook.resource.mall_id,
				orderItemCode: orderItem.order_item_code,
				orderId: webHook.resource.order_id,
				eventShopNo: orderItem.shop_no,
				webhook: webHook,
				traceId,
				orderItem,
			});
		}
	}

	/**
	 *
	 * @param webHook cafe24 Webhook 에서 전달한 객체
	 * @returns webhook과 관련된 주문의 보증서 요청 리스트
	 */
	private async getGuaranteeRequests(
		webHook: WebHookBody<EventOrderShipping>
	) {
		const reqList = await this.guaranteeReqRepo.getRequestListByOrderId(
			webHook.resource.order_id,
			webHook.resource.mall_id
		);
		return reqList;
	}

	/**
	 * 연동 정보를 가져오고 연동 정보하위에 있는 AccessToken이 만료되었을시 Refresh 한다.
	 * @param mallId 연동 정보를 얻고자 하는 mallId
	 * @returns AccessToken이 Refresh된 연동 정보
	 */
	private async getFreshInterwork(mallId: string) {
		let interwork = await this.interworkRepo.getInterwork(mallId);
		if (!interwork || !interwork.confirmedAt || interwork.leavedAt) {
			throw new NotFoundException('Not Found Interwork Info');
		}
		interwork = await this.tokenRefresher.refreshExpiredAccessToken(
			interwork
		);
		return interwork;
	}
}
