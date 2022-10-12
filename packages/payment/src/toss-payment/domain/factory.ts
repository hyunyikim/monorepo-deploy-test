import {Inject} from '@nestjs/common';
import {EventPublisher} from '@nestjs/cqrs';

import {Payment, PlanPayment, PaymentProps} from './payment';

export class PaymentFactory {
	constructor(
		@Inject(EventPublisher) private readonly eventPublisher: EventPublisher
	) {}

	create(properties: PaymentProps): Payment {
		return this.eventPublisher.mergeObjectContext(
			new PlanPayment(properties)
		);
	}
}
