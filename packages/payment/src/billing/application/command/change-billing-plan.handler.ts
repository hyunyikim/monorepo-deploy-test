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
	PricePlanRepository,
	PlanBillingRepository,
} from 'src/billing/infrastructure/respository';
import {ChangeBillingPlanCommand} from './change-billing-plan.command';
@CommandHandler(ChangeBillingPlanCommand)
export class ChangeBillingPlanHandler
	implements ICommandHandler<ChangeBillingPlanCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PricePlanRepository)
		private readonly planRepo: PricePlanRepository
	) {}

	async execute(command: ChangeBillingPlanCommand): Promise<void> {
		const {planId, customerKey} = command;
		const billing = await this.billingRepo.findByCustomerKey(customerKey);

		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		const pricePlan = await this.planRepo.findByPlanId(planId);
		if (!pricePlan) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		billing.changePlan(pricePlan);
		await this.billingRepo.saveBilling(billing);
		billing.commit();
	}
}
