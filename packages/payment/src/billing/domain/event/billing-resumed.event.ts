import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';

export class BillingResumedEvent implements IEvent {
	constructor(public readonly billing: BillingProps) {}
}
