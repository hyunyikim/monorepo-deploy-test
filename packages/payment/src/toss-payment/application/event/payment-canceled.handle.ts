import {Logger} from '@nestjs/common';
import {EventsHandler, IEventHandler} from '@nestjs/cqrs';

import {PaymentCanceledEvent} from '../../domain/event';

@EventsHandler(PaymentCanceledEvent)
export class PaymentCanceledHandler
	implements IEventHandler<PaymentCanceledEvent>
{
	constructor(private readonly logger: Logger) {}

	async handle(event: PaymentCanceledEvent): Promise<void> {
		this.logger.log('Billing Registered', event);
		return Promise.resolve(undefined);
	}
}
