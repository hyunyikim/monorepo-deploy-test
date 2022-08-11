import {
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import {Cafe24Interwork, IssueSetting, IssueTiming} from './interwork.entity';
import {Cafe24API} from './Cafe24ApiService/cafe24Api';
import {InterworkRepository} from './DynamoRepo/interwork.repository';
import {DateTime} from 'luxon';
import {VircleCoreAPI} from './vircleCoreApiService';
import {EventOrderShipping, WebHookBody} from './cafe24Interwork.dto';
import {GuaranteeRequestRepository} from './DynamoRepo';
import {TokenRefresher} from './tokenRefresher/tokenRefresher';
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
		@Inject(TokenRefresher) private tokenRefresher: TokenRefresher
	) {
		this.shippingEvent = ['AFTER_SHIPPING', 'AFTER_DELIVERED'];
	}

	async handleShippingEvent(
		traceId: string,
		webHook: WebHookBody<EventOrderShipping>
	) {
		const mallId = webHook.resource.mall_id;
		let interwork = await this.interworkRepo.getInterwork(mallId);
		if (!interwork || !interwork.confirmedAt || interwork.leavedAt) {
			throw new NotFoundException('Not Found Interwork Info');
		}

		interwork = await this.tokenRefresher.refreshExpiredAccessToken(
			interwork
		);

		if (!this.checkIssueTiming(interwork.issueSetting, webHook.resource)) {
			return;
		}
		const {reqIdx, reqState} = await this.sendRequestForGuarantee(
			interwork,
			webHook
		);

		const product = await this.cafe24Api.getProductByCode(
			mallId,
			interwork.accessToken.access_token,
			webHook.resource.ordering_product_code
		);

		await this.guaranteeReqRepo.putRequest({
			reqIdx,
			productCode: webHook.resource.ordering_product_code,
			reqAt: DateTime.now().toISO(),
			reqState,
			webhook: webHook,
			traceId,
			product,
		});

		return;
	}

	private async sendRequestForGuarantee(
		interwork: Cafe24Interwork,
		webHook: WebHookBody<EventOrderShipping>
	) {
		const resource = webHook.resource;
		if (!interwork.coreApiToken) {
			throw new ForbiddenException('No auth for vircle core-api');
		}
		const DIRECT_ISSUE = '2';
		const {nft_req_idx, nft_req_state} =
			await this.vircleCoreApi.requestGuarantee(interwork.coreApiToken, {
				productName: resource.ordering_product_name,
				price: parseInt(resource.actual_payment_amount),
				ordererName: resource.buyer_name,
				ordererTel: resource.buyer_cellphone.replaceAll('-', ''),
				platformName: interwork.store.shop_name,
				modelNum: resource.ordering_product_code,
				warranty: interwork.partnerInfo?.warrantyDate,
				orderedAt: resource.ordered_date,
				orderId: resource.order_id,
				brandIdx: interwork.partnerInfo?.brand.idx,
				nftState: DIRECT_ISSUE,
			});
		return {
			reqIdx: nft_req_idx,
			reqState: nft_req_state,
		};
	}

	private checkIssueTiming(
		issueSetting: IssueSetting,
		resource: EventOrderShipping
	) {
		const isValidEvent = this.shippingEvent.includes(
			issueSetting.issueTiming
		);
		const isValidTiming = issueSetting.issueTiming === 'AFTER_DELIVERED';
		const isValidShippingStatus = resource.shipping_status === 'T';

		return isValidEvent && isValidTiming && isValidShippingStatus;
	}
}
