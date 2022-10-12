import {AggregateRoot} from '@nestjs/cqrs';
import {DateTime} from 'luxon';
import {PaymentCanceledEvent} from './event/payment-canceled.event';
import {PaymentConfirmedEvent} from './event/payment-confirmed.event';

export enum PaymentType {
	NORMAL = 'NORMAL',
	BILLING = 'BILLING',
}

export enum Currency {
	KRW = 'KRW',
}

export type PaymentEssentialProps = Required<{
	paymentKey: string;
	totalAmount: number;
	currency: Currency;
	orderId: string;
	orderName: string;
	type: PaymentType;
	requestedAt: DateTime;
	useEscrow: boolean;
	vat: number;
}>;

export type PaymentOptionalProps = Partial<{
	canceledAt: DateTime | null;
	approvedAt: DateTime | null;
}>;

export type PaymentProps = PaymentEssentialProps &
	Required<PaymentOptionalProps>;

export interface Payment {
	properties: () => PaymentProps;
	confirm: () => void;
	cancel: () => void;
	commit: () => void;
}

export class PlanPayment extends AggregateRoot implements Payment {
	private readonly paymentKey: string;
	private readonly totalAmount: number;
	private readonly currency: Currency;
	private readonly type: PaymentType;
	private readonly orderId: string;
	private readonly orderName: string;
	private readonly requestedAt: DateTime;
	private readonly useEscrow: boolean;
	private readonly vat: number;
	private canceledAt: DateTime | null = null;
	private approvedAt: DateTime | null = null;

	constructor(props: PaymentEssentialProps & PaymentOptionalProps) {
		super();
		Object.assign(this, props);
	}

	properties(): PaymentProps {
		return {
			paymentKey: this.paymentKey,
			type: this.type,
			orderId: this.orderId,
			orderName: this.orderName,
			totalAmount: this.totalAmount,
			currency: this.currency,
			requestedAt: this.requestedAt,
			useEscrow: this.useEscrow,
			vat: this.vat,
			canceledAt: this.canceledAt,
			approvedAt: this.approvedAt,
		};
	}

	confirm(): void {
		this.approvedAt = DateTime.now();
		this.apply(Object.assign(new PaymentConfirmedEvent(), this));
	}

	cancel(): void {
		this.canceledAt = DateTime.now();
		this.apply(Object.assign(new PaymentCanceledEvent(), this));
	}
}
