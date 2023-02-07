import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';

export class BillingDelayedEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}
