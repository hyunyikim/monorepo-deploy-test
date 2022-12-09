import {Inject, NotFoundException} from '@nestjs/common';
import {IQuery, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {PlanPaymentRepository} from 'src/billing/infrastructure/respository';
import {PaymentRepository} from 'src/billing/domain/repository';
import {PaymentProps} from 'src/billing/domain';

export class FindPaymentsQuery implements IQuery {
	constructor(
		readonly customerKey: string,
		readonly range: {
			startAt: string;
			endAt: string;
		}
	) {}
}

@QueryHandler(FindPaymentsQuery)
export class FindPaymentsHandler
	implements IQueryHandler<FindPaymentsQuery, PaymentProps[]>
{
	constructor(
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository
	) {}

	async execute(query: FindPaymentsQuery): Promise<PaymentProps[]> {
		const {customerKey, range} = query;
		const payments = await this.paymentRepo.search(customerKey, {
			startAt: new Date(range.startAt),
			endAt: new Date(range.endAt),
		});

		return payments.map((payment) => payment.properties());
	}
}
