import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';

import {
	BillingApprovedEvent,
	BillingApproveFailedEvent,
} from '../../domain/event';

@EventsHandler(BillingApprovedEvent)
export class BillingApprovedHandler
	implements IEventHandler<BillingApprovedEvent>
{
	constructor(private readonly logger: Logger) {}

	async handle(event: BillingApprovedEvent): Promise<void> {
		this.logger.log(event, this.constructor.name);
		return Promise.resolve(undefined);
	}
}

@EventsHandler(BillingApproveFailedEvent)
export class BillingApproveFailedHandler
	implements IEventHandler<BillingApproveFailedEvent>
{
	constructor(private readonly logger: Logger) {}

	async handle(event: BillingApproveFailedEvent): Promise<void> {
		this.logger.log(event, this.constructor.name);
		return Promise.resolve(undefined);
	}
}
