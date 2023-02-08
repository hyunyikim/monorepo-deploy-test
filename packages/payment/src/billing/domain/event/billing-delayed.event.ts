import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';
import {PaymentProps} from '../payment';

export class BillingDelayedEvent implements IEvent {
	constructor(
		public readonly billing: BillingProps,
		public readonly payment: PaymentProps
	) {}
}
