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
@Injectable()
export class Cafe24EventService {
	private shippingEvent: IssueTiming[];
	constructor(
		@Inject() private readonly cafe24Api: Cafe24API,
		@Inject() private readonly interworkRepo: InterworkRepository,
		@Inject() private readonly guaranteeReqRepo: GuaranteeRequestRepository,
		@Inject() private readonly vircleCoreApi: VircleCoreAPI
	) {
		this.shippingEvent = ['AFTER_SHIPPING', 'AFTER_DELIVERED'];
	}

	async handleShippingEvent(webHook: WebHookBody<EventOrderShipping>) {
		const mallId = webHook.resource.mall_id;
		const interwork = await this.interworkRepo.getInterwork(mallId);
		if (!interwork || !interwork.confirmedAt) return;
		const issueTiming = interwork.issueSetting.issueTiming;

		if (!interwork.coreApiToken) {
			throw new ForbiddenException('No permission to access core api');
		}

		if (!this.shippingEvent.includes(issueTiming)) {
			return;
		}

		const resource = webHook.resource;
		if (
			issueTiming === 'AFTER_DELIVERED' &&
			resource.shipping_status === 'T'
		) {
			const {nft_req_idx, nft_req_state} =
				await this.vircleCoreApi.requestGuarantee(
					interwork.coreApiToken,
					{
						productName: resource.ordering_product_name,
						price: parseInt(resource.actual_payment_amount),
						ordererName: resource.buyer_name,
						ordererTel: resource.buyer_cellphone.replaceAll(
							'-',
							''
						),
						platformName: interwork.store.shop_name,
						modelNum: resource.ordering_product_code,
						warranty: interwork.partnerInfo?.warrantyDate,
						orderedAt: resource.ordered_date,
						orderId: resource.order_id,
						brandIdx: interwork.partnerInfo?.brand.idx,
						nftState: '2',
					}
				);

			const product = await this.cafe24Api.getProductByCode(
				mallId,
				interwork.accessToken.access_token,
				resource.ordering_product_code
			);

			await this.guaranteeReqRepo.putRequest({
				reqIdx: nft_req_idx,
				productCode: resource.ordering_product_code,
				reqAt: DateTime.now().toISO(),
				reqState: nft_req_state,
				webhook: webHook,
				product,
			});
		}

		if (
			issueTiming === 'AFTER_SHIPPING' &&
			resource.shipping_status === 'M'
		) {
			//do something
		}
		return;
	}
}
