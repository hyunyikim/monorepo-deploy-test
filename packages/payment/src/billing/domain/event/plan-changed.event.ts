import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';

export class PlanChangedEvent implements IEvent {
	constructor(
		public readonly billing: BillingProps,

		/**
		 * offset > 0 = UPGRADE
		 * offset < 0 = DOWNGRADE
		 */
		public readonly offset: number
	) {}
}
