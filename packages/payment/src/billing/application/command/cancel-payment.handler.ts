import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PaymentRepository} from 'src/billing/domain/repository';
import {PlanPaymentRepository} from 'src/billing/infrastructure/respository/payment.repository';

import {CancelPaymentCommand} from './cancel-payment.command';
import {TossPaymentsAPI} from '../../infrastructure/api-client';

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentHandler
	implements ICommandHandler<CancelPaymentCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI) private readonly paymentApi: TossPaymentsAPI,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepository: PaymentRepository
	) {}

	async execute(command: CancelPaymentCommand): Promise<void> {
		const payment = await this.paymentRepository.findByKey(command.key);
		if (!payment) {
			throw new NotFoundException('NOT_FOUND_PAYMENT');
		}
		const canceled = await this.paymentApi.payments.cancel(command.key, {
			cancelReason: 'REASON',
		});
		payment.cancel(canceled);

		await this.paymentRepository.savePayment(payment);

		payment.commit();
	}
}
