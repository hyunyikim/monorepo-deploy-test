import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {
	PlanPayment,
	PlanPaymentFactory,
	PlanBillingFactory,
} from '../../domain';

import {
	PaymentRepository,
	BillingRepository,
} from 'src/billing/domain/repository';
import {ApproveBillingPaymentCommand} from './approve-billing-payment.command';
import {TossPaymentsAPI} from 'src/billing/infrastructure/api-client';
import {
	PlanPaymentRepository,
	PlanBillingRepository,
} from 'src/billing/infrastructure/respository';

@CommandHandler(ApproveBillingPaymentCommand)
export class ApproveBillingPaymentHandler
	implements ICommandHandler<ApproveBillingPaymentCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI) private readonly paymentsApi: TossPaymentsAPI,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanPaymentFactory)
		private readonly factory: PlanPaymentFactory
	) {}

	async execute(command: ApproveBillingPaymentCommand): Promise<void> {
		const {billingKey, payload} = command;

		const billing = await this.billingRepo.findByKey(billingKey);
		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		const tossPayment = await this.paymentsApi.billing.requestApprove(
			billingKey,
			payload
		);

		const payment = this.factory.create(tossPayment);

		billing.approve(payment.properties());
		await this.paymentRepo.savePayment(payment);
		await this.billingRepo.saveBilling(billing);
		payment.commit();
	}
}
