import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';

export class BillingPausedEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}
