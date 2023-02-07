import {ICommand} from '@nestjs/cqrs';
import {BillingProps, PaymentProps} from '../../domain';
import {EMAIL_TEMPLATE} from '../../infrastructure/api-client';

export class NotificationCommand implements ICommand {
	constructor(
		readonly template: EMAIL_TEMPLATE,
		readonly billing: BillingProps,
		readonly payment?: PaymentProps
	) {}
}
