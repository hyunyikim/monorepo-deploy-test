import {Inject} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository} from 'src/billing/domain/repository';
import {PlanBillingRepository} from 'src/billing/infrastructure/respository/billing.repository';
import {TossPaymentsAPI} from 'src/billing/infrastructure/api-client';
import {
	RegisterBillingCommand,
	UnregisterBillingCommand,
} from './register-billing.command';
import {PlanBilling} from '../../domain/billing';

@CommandHandler(RegisterBillingCommand)
export class RegisterBillingHandler
	implements ICommandHandler<RegisterBillingCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI) private readonly paymentsApi: TossPaymentsAPI,
		@Inject(PlanBillingRepository)
		private readonly billingRepository: BillingRepository
	) {}

	async execute(command: RegisterBillingCommand): Promise<void> {
		const {authKey, customerKey} = command;

		const tossBilling =
			await this.paymentsApi.billing.authorizations.authKey(
				authKey,
				customerKey
			);

		await this.billingRepository.saveBilling(new PlanBilling(tossBilling));

		return Promise.resolve(undefined);
	}
}

@CommandHandler(UnregisterBillingCommand)
export class UnregisterBillingHandler
	implements ICommandHandler<UnregisterBillingCommand, void>
{
	async execute(command: UnregisterBillingCommand): Promise<void> {
		return Promise.resolve(undefined);
	}
}
