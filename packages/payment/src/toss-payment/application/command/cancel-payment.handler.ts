import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PaymentRepository} from 'src/toss-payment/domain/repository';
import {PlanPaymentRepository} from 'src/toss-payment/infrastructure/respository/payment.repository';

import {CancelPaymentCommand} from './cancel-payment.command';

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentHandler
	implements ICommandHandler<CancelPaymentCommand, void>
{
	constructor(
		@Inject(PlanPaymentRepository)
		private readonly paymentRepository: PaymentRepository
	) {}

	async execute(command: CancelPaymentCommand): Promise<void> {
		const payment = await this.paymentRepository.findByKey(command.key);
		if (!payment) {
			throw new NotFoundException('NOT_FOUNT_PAYMENT');
		}
		payment.cancel();

		await this.paymentRepository.savePayment(payment);

		payment.commit();
	}
}
