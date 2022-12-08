import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';

export class BillingRegisteredEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}

export class BillingUnregisteredEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}
