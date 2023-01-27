import {Inject, NotFoundException} from '@nestjs/common';
import {IQuery, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {BillingRepository} from '../../domain/repository';
import {BillingProps} from '../../domain';

export class FindBillingByPartnerIdxQuery implements IQuery {
	constructor(readonly partnerIdx: number) {}
}

/**
 * CustomerKey로 빌링 조회
 */
@QueryHandler(FindBillingByPartnerIdxQuery)
export class FindBillingByCustomerKeyHandler
	implements IQueryHandler<FindBillingByPartnerIdxQuery, BillingProps>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository
	) {}

	async execute(query: FindBillingByPartnerIdxQuery) {
		const {partnerIdx} = query;

		const billing = await this.billingRepo.findByPartnerIdx(partnerIdx);
		if (!billing) throw new NotFoundException('NOT_FOUND_BILLING');

		return billing.properties();
	}
}
