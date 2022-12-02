import {AggregateRoot} from '@nestjs/cqrs';
import {PaymentCanceledEvent} from './event/payment-canceled.event';
import {PaymentConfirmedEvent} from './event/payment-confirmed.event';
import {Payment as TossPayment} from '../infrastructure/api-client';

export type PaymentProps = Omit<TossPayment, 'version'>;

export interface Payment {
	properties: () => PaymentProps;
	confirm: (props: PaymentProps) => void;
	cancel: (props: PaymentProps) => void;
	commit: () => void;
}

export class PlanPayment extends AggregateRoot implements Payment {
	constructor(private props: PaymentProps) {
		super();
		Object.assign(this, props);
	}

	properties(): PaymentProps {
		return {...this.props};
	}

	confirm(paymentProps: PaymentProps): void {
		this.apply(Object.assign(new PaymentConfirmedEvent(), this));
	}

	cancel(paymentProps: PaymentProps): void {
		this.apply(Object.assign(new PaymentCanceledEvent(), this));
	}
}
