import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';

import {BillingRegisteredEvent} from '../../domain/event';

@EventsHandler(BillingRegisteredEvent)
export class BillingRegisteredHandler
	implements IEventHandler<BillingRegisteredEvent>
{
	constructor(private readonly logger: Logger) {}

	async handle(event: BillingRegisteredEvent): Promise<void> {
		this.logger.log('Billing Registered', event);
		return Promise.resolve(undefined);
	}
}
