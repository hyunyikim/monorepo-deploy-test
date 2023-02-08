import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';

export class BillingRegisteredEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}

export class BillingUnregisteredEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}

export class BillingDeletedEvent implements IEvent {
	constructor(
		public readonly billing: BillingProps,
		public readonly isBillingChanged: boolean
	) {}
}

export class CardRegisteredEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}

export class CardDeletedEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}
