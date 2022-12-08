import {Logger, Inject} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';

import {
	BillingRegisteredEvent,
	BillingUnregisteredEvent,
} from '../../domain/event';

@EventsHandler(BillingRegisteredEvent)
export class BillingRegisteredHandler
	implements IEventHandler<BillingRegisteredEvent>
{
	constructor(@Inject(Logger) private readonly logger: Logger) {}

	async handle(event: BillingRegisteredEvent): Promise<void> {
		this.logger.log('Billing Registered', event);
		return Promise.resolve(undefined);
	}
}

@EventsHandler(BillingUnregisteredEvent)
export class BillingUnregisteredHandler
	implements IEventHandler<BillingUnregisteredEvent>
{
	constructor(@Inject(Logger) private readonly logger: Logger) {}

	async handle(event: BillingUnregisteredEvent) {
		this.logger.log('Billing Unregistered', event);
		return Promise.resolve(undefined);
	}
}
