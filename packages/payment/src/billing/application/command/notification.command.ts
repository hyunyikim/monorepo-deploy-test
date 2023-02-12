import {ICommand, IEvent} from '@nestjs/cqrs';
import {BillingProps, PaymentProps, PricePlanProps} from '../../domain';

export class NotificationCommand implements ICommand {
	constructor(
		readonly event: IEvent,
		readonly billing: BillingProps,
		readonly payment?: PaymentProps,
		readonly prevPlan?: PricePlanProps,
		readonly date?: string
	) {}
}
