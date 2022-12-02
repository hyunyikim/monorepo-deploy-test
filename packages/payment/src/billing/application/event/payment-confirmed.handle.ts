import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';

import {PaymentConfirmedEvent} from '../../domain/event';

@EventsHandler(PaymentConfirmedEvent)
export class PaymentConfirmedHandler
	implements IEventHandler<PaymentConfirmedEvent>
{
	constructor(private readonly logger: Logger) {}

	async handle(event: PaymentConfirmedEvent): Promise<void> {
		this.logger.log('Billing Registered', event);
		return Promise.resolve(undefined);
	}
}
