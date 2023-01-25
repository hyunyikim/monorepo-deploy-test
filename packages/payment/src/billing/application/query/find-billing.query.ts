import {Inject, NotFoundException} from '@nestjs/common';
import {IQuery, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {BillingRepository} from '../../domain/repository';
import {BillingProps} from '../../domain';

export class FindBillingByCustomerKeyQuery implements IQuery {
	constructor(readonly customerKey: string) {}
}

/**
 * CustomerKey로 빌링 조회
 */
@QueryHandler(FindBillingByCustomerKeyQuery)
export class FindBillingByCustomerKeyHandler
	implements IQueryHandler<FindBillingByCustomerKeyQuery, BillingProps>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository
	) {}

	async execute(query: FindBillingByCustomerKeyQuery) {
		const {customerKey} = query;

		const billing = await this.billingRepo.findByCustomerKey(customerKey);
		if (!billing) throw new NotFoundException('NOT_FOUND_BILLING');

		return billing.properties();
	}
}
