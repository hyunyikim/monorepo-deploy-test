import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';

import {PlanChangedEvent} from '../../domain/event';

@EventsHandler(PlanChangedEvent)
export class BillingPlanChangedHandler
	implements IEventHandler<PlanChangedEvent>
{
	constructor(private readonly logger: Logger) {}

	async handle(event: PlanChangedEvent): Promise<void> {
		this.logger.log(event, this.constructor.name);
		return Promise.resolve(undefined);
	}
}
