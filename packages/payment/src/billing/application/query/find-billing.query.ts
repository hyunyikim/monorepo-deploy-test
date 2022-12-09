import {Inject, NotFoundException} from '@nestjs/common';
import {IQuery, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {PlanBillingRepository} from 'src/billing/infrastructure/respository/billing.repository';
import {BillingRepository} from 'src/billing/domain/repository';
import {BillingProps} from 'src/billing/domain/billing';

export class FindBillingByCustomerKeyQuery implements IQuery {
	constructor(readonly customerKey: string) {}
}

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
