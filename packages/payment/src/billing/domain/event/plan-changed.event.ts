import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';

export class PlanChangedEvent implements IEvent {
	constructor(
		public readonly billing: BillingProps,
		readonly scheduled: boolean
	) {}
}
