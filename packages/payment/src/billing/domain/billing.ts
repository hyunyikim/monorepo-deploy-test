import {AggregateRoot} from '@nestjs/cqrs';
import {DateTime} from 'luxon';
import {stringify} from 'querystring';
import {BillingApprovedEvent} from './event/billing-approved.event';
import {BillingRegisteredEvent} from './event/billing-registered.event';
import {PaymentCanceledEvent} from './event/payment-canceled.event';
import {PaymentConfirmedEvent} from './event/payment-confirmed.event';
import {PaymentProps} from './payment';
import {Billing as TossBilling} from '../infrastructure/api-client';

export interface Billing {
	properties: () => BillingProps;
	register: () => void;
	approve: (payment: PaymentProps) => void;
	commit: () => void;
}

export type BillingProps = TossBilling;

export class PlanBilling extends AggregateRoot implements Billing {
	constructor(private props: BillingProps, readonly authKey?: string) {
		super();
	}

	properties(): BillingProps {
		return {
			...this.props,
		};
	}

	register(): void {
		this.apply(Object.assign(new BillingRegisteredEvent(), this));
	}

	approve(payment: PaymentProps): void {
		this.apply(Object.assign(new BillingApprovedEvent(), this));
	}
}
