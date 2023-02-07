import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';

import {BillingDelayedEvent} from '../../domain/event';

@EventsHandler(BillingDelayedEvent)
export class BillingDelayedHandler
	implements IEventHandler<BillingDelayedEvent>
{
	constructor(private readonly logger: Logger) {}

	async handle(event: BillingDelayedEvent): Promise<void> {
		this.logger.log(event, this.constructor.name);
		return Promise.resolve(undefined);
	}
}
