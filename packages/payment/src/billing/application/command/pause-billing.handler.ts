import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {
	PauseBillingCommand,
	ResumeBillingCommand,
} from './pause-billing.command';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {BillingRepository} from '../../domain/repository';

@CommandHandler(PauseBillingCommand)
export class PauseBillingHandler
	implements ICommandHandler<PauseBillingCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository
	) {}

	async execute(command: PauseBillingCommand): Promise<void> {
		const {customerKey} = command;
		const billing = await this.billingRepo.findByCustomerKey(customerKey);
		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		billing.pause();
		await this.billingRepo.saveBilling(billing);
		billing.commit();
	}
}

@CommandHandler(ResumeBillingCommand)
export class ResumeBillingHandler
	implements ICommandHandler<ResumeBillingCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository
	) {}

	async execute(command: ResumeBillingCommand): Promise<void> {
		const {customerKey} = command;
		const billing = await this.billingRepo.findByCustomerKey(customerKey);

		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		billing.resume();
		await this.billingRepo.saveBilling(billing);
		billing.commit();
	}
}
