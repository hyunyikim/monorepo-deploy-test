import {Inject, NotFoundException, BadRequestException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository, PlanRepository} from 'src/billing/domain/repository';
import {PlanBillingRepository} from 'src/billing/infrastructure/respository/billing.repository';
import {TossPaymentsAPI} from 'src/billing/infrastructure/api-client';
import {
	RegisterBillingCommand,
	UnregisterBillingCommand,
} from './register-billing.command';
import {PlanBillingFactory} from '../../domain';
import {PricePlanRepository} from '../../infrastructure/respository/plan.repository';

@CommandHandler(RegisterBillingCommand)
export class RegisterBillingHandler
	implements ICommandHandler<RegisterBillingCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI) private readonly paymentsApi: TossPaymentsAPI,
		@Inject(PlanBillingRepository)
		private readonly billingRepository: BillingRepository,
		@Inject(PlanBillingFactory)
		private readonly factory: PlanBillingFactory,
		@Inject(PricePlanRepository)
		private readonly planRepository: PlanRepository
	) {}

	async execute(command: RegisterBillingCommand): Promise<void> {
		const {authKey, customerKey, planId} = command;

		const saved = await this.billingRepository.findByCustomerKey(
			customerKey
		);

		if (saved && saved.isRegistered) {
			throw new BadRequestException('ALREADY_REGISTERED_BILLING');
		}

		const pricePlan = await this.planRepository.findByPlanId(planId);

		if (!pricePlan || !pricePlan.activated) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		const tossBilling =
			await this.paymentsApi.billing.authorizations.authKey(
				authKey,
				customerKey
			);

		const registered = this.factory.create({
			...tossBilling,
			authKey,
			pricePlan,
		});
		registered.register();
		await this.billingRepository.saveBilling(registered);

		registered.commit();
	}
}

@CommandHandler(UnregisterBillingCommand)
export class UnregisterBillingHandler
	implements ICommandHandler<UnregisterBillingCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepository: BillingRepository
	) {}

	async execute(command: UnregisterBillingCommand): Promise<void> {
		const {customerKey} = command;

		const billing = await this.billingRepository.findByCustomerKey(
			customerKey
		);

		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		billing.unregister();

		await this.billingRepository.saveBilling(billing);

		billing.commit();
	}
}
