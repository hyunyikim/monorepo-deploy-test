import {Inject} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PlanPayment, PlanPaymentFactory} from '../../domain';

import {PaymentRepository} from 'src/billing/domain/repository';
import {ApproveBillingPaymentCommand} from './approve-billing-payment.command';
import {TossPaymentsAPI} from 'src/billing/infrastructure/api-client';
import {PlanPaymentRepository} from 'src/billing/infrastructure/respository/payment.repository';

@CommandHandler(ApproveBillingPaymentCommand)
export class ApproveBillingPaymentHandler
	implements ICommandHandler<ApproveBillingPaymentCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI) private readonly paymentApi: TossPaymentsAPI,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository,
		@Inject(PlanPaymentFactory) private readonly factory: PlanPaymentFactory
	) {}

	async execute(command: ApproveBillingPaymentCommand): Promise<void> {
		const {billingKey, payload} = command;
		const tossPayment = await this.paymentApi.billing.requestApprove(
			billingKey,
			payload
		);

		const payment = this.factory.create(tossPayment);
		await this.paymentRepo.savePayment(payment);

		payment.commit();
	}
}
