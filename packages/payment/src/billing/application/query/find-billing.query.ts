import {Inject, NotFoundException} from '@nestjs/common';
import {IQuery, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {BillingRepository} from '../../domain/repository';
import {BillingProps} from '../../domain';
import {TokenInfo} from '../../interface/getToken.decorator';
import {VircleCoreApi} from '../../infrastructure/api-client/vircle-core.api';
import {DateTime} from 'luxon';

export class FindBillingByPartnerTokenQuery implements IQuery {
	constructor(readonly token: TokenInfo) {}
}

/**
 * 파트너 토큰으로 빌링 조회
 */
@QueryHandler(FindBillingByPartnerTokenQuery)
export class FindBillingByPartnerTokenHandler
	implements IQueryHandler<FindBillingByPartnerTokenQuery, BillingProps>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(VircleCoreApi)
		private readonly vircleCoreApi: VircleCoreApi
	) {}

	async execute(query: FindBillingByPartnerTokenQuery) {
		const {token} = query;

		const billing = await this.billingRepo.findByPartnerIdx(
			token.partnerIdx
		);
		if (!billing) throw new NotFoundException('NOT_FOUND_BILLING');

		const billingProps: BillingProps = billing.properties();

		// 사용량 조회
		// TODO: 연결제일 경우 오늘일자가 포함된 1개월치만 검색되도록
		const payload = {
			from: DateTime.fromISO(
				billingProps.lastPaymentAt || billingProps.authenticatedAt
			).toISODate(),
			to: billingProps.planExpireDate
				? DateTime.fromISO(billingProps.planExpireDate).toISODate()
				: undefined,
		};
		const {total} = await this.vircleCoreApi.getUsedGuaranteeCount(
			token.token,
			payload
		);

		billingProps.usedNftCount = total;

		return billingProps;
	}
}
