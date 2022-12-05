import {Inject} from '@nestjs/common';
import {EventPublisher} from '@nestjs/cqrs';

import {BillingProps, PlanBilling, Billing} from './billing';
import {Payment, PlanPayment, PaymentProps} from './payment';

export class PlanPaymentFactory {
	constructor(
		@Inject(EventPublisher) private readonly eventPublisher: EventPublisher
	) {}

	create(properties: PaymentProps): Payment {
		return this.eventPublisher.mergeObjectContext(
			new PlanPayment(properties)
		);
	}
}

export class PlanBillingFactory {
	constructor(
		@Inject(EventPublisher) private readonly eventPublisher: EventPublisher
	) {}

	create(props: BillingProps): Billing {
		return this.eventPublisher.mergeObjectContext(new PlanBilling(props));
	}
}
