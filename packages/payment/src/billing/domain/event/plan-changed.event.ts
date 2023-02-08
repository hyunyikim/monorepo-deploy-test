import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';
import {PricePlanProps} from '../pricePlan';

export class PlanChangedEvent implements IEvent {
	constructor(
		public readonly billing: BillingProps,
		readonly prevPlan: PricePlanProps,
		readonly scheduledDate?: string
	) {}
}
