import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';
import {PaymentProps} from '../payment';

export class BillingApprovedEvent implements IEvent {
	readonly payment: PaymentProps;
	readonly billing: BillingProps;
}
