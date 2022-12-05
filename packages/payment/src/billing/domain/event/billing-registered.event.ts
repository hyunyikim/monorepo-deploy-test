import {IEvent} from '@nestjs/cqrs';
import {BillingProps} from '../billing';

export class BillingRegisteredEvent implements IEvent {
	readonly billing: BillingProps;
}
