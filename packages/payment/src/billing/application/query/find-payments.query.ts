import {Inject, NotFoundException} from '@nestjs/common';
import {IQuery, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {PaymentProps} from '../../domain';
import {PaymentRepository} from '../../domain/repository';
import {PlanPaymentRepository} from '../../infrastructure/respository';
import {FindPaymentsQueryDto} from '../../interface/dto/find-payments.query.dto';

export class FindPaymentsQuery implements IQuery {
	constructor(
		readonly partnerIdx: number,
		readonly params: FindPaymentsQueryDto
	) {}
}

export class FindPaymentByOrderIdQuery implements IQuery {
	constructor(readonly orderId: string) {}
}

/**
 * 결제 내역 조회
 */
@QueryHandler(FindPaymentsQuery)
export class FindPaymentsHandler
	implements
		IQueryHandler<
			FindPaymentsQuery,
			{
				total: number;
				data: PaymentProps[];
			}
		>
{
	constructor(
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository
	) {}

	async execute(query: FindPaymentsQuery): Promise<{
		total: number;
		page: number;
		data: PaymentProps[];
	}> {
		const {partnerIdx, params} = query;
		const {sort, page, pageSize, startAt, endAt} = params;

		const results = await this.paymentRepo.search(
			partnerIdx,
			sort ?? 'DESC',
			page ?? 1,
			pageSize ?? 10,
			(startAt || startAt) && {
				startAt: startAt ? new Date(startAt) : new Date('1970-01-01'),
				endAt: endAt ? new Date(endAt) : new Date(),
			}
		);

		return {
			total: results.total,
			page,
			data: results.data.map((payment) => payment.properties()),
		};
	}
}

/**
 * 결제 상세내역 조회
 */
@QueryHandler(FindPaymentByOrderIdQuery)
export class FindPaymentByOrderIdHandler
	implements IQueryHandler<FindPaymentByOrderIdQuery, PaymentProps>
{
	constructor(
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository
	) {}

	async execute(query: FindPaymentByOrderIdQuery): Promise<PaymentProps> {
		const {orderId} = query;
		const payment = await this.paymentRepo.findByOrderId(orderId);
		if (!payment) throw new NotFoundException('NOT_FOUND_PAYMENT');

		return payment.properties();
	}
}
