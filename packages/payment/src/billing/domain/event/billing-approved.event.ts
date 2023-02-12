import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';
import {PaymentProps} from '../payment';

export class BillingApprovedEvent implements IEvent {
	constructor(
		public readonly billing: BillingProps,
		public readonly payment: PaymentProps
	) {}
}

export class BillingApproveFailedEvent implements IEvent {
	constructor(
		public readonly billing: BillingProps,
		public readonly payment: PaymentProps
	) {}
}
