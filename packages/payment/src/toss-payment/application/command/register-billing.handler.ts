import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PaymentRepository} from 'src/toss-payment/domain/repository';
import {PlanPaymentRepository} from 'src/toss-payment/infrastructure/respository/payment.repository';

import {
	RegisterBillingCommand,
	UnregisterBillingCommand,
} from './register-billing.command';

@CommandHandler(RegisterBillingCommand)
export class RegisterBillingHandler
	implements ICommandHandler<RegisterBillingCommand, void>
{
	async execute(command: RegisterBillingCommand): Promise<void> {
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
