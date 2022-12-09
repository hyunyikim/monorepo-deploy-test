import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';

import {PlanChangedEvent} from '../../domain/event';

@EventsHandler(PlanChangedEvent)
export class BillingPlanChangedHandleHandler
	implements IEventHandler<PlanChangedEvent>
{
	constructor(private readonly logger: Logger) {}

	async handle(event: PlanChangedEvent): Promise<void> {
		this.logger.log('Billing Plan Changed', event);
		return Promise.resolve(undefined);
	}
}
