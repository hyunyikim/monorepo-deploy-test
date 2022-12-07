import {AggregateRoot} from '@nestjs/cqrs';
import {
	BillingApprovedEvent,
	BillingRegisteredEvent,
	BillingUnregisteredEvent,
} from './event';
import {PaymentProps} from './payment';
import {Billing as TossBilling} from '../infrastructure/api-client';
import {DateTime} from 'luxon';

export interface Billing {
	properties: () => BillingProps;
	register: () => void;
	unregister: () => void;
	isRegistered: boolean;
	approve: (payment: PaymentProps) => void;
	commit: () => void;
}

export interface PricePlan {
	planId: string;
	planName: string;
	planPrice: number;
	planLimit: number;
	planType: 'MONTH' | 'YEAR';
	activated: boolean;
}

export type BillingProps = TossBilling & {
	authKey: string;
	pricePlan: PricePlan;
	unregisteredAt?: string;
	nextPaymentAt?: string;
	lastPaymentAt?: string;
};

export class PlanBilling extends AggregateRoot implements Billing {
	private unregisteredAt?: string;
	private nextPaymentAt?: string;
	private lastPaymentAt?: string;

	constructor(private props: BillingProps) {
		super();
	}

	properties(): BillingProps {
		return {
			...this.props,
			unregisteredAt: this.unregisteredAt,
			nextPaymentAt: this.nextPaymentAt,
			lastPaymentAt: this.lastPaymentAt,
		};
	}

	register(): void {
		const event = new BillingRegisteredEvent(this.properties());
		this.apply(event);
	}

	unregister(): void {
		const now = DateTime.now().set({
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
		});
		this.unregisteredAt = now.toISO();
		const event = new BillingUnregisteredEvent(this.properties());
		this.apply(event);
	}

	approve(payment: PaymentProps): void {
		const now = DateTime.now().set({
			hour: 0,
			minute: 0,
			second: 0,
			millisecond: 0,
		});

		this.lastPaymentAt = now.toISO();
		this.nextPaymentAt = now.plus({month: 1}).toISO();
		const event = new BillingApprovedEvent(this.properties(), payment);
		this.apply(event);
	}

	get isRegistered() {
		return this.unregisteredAt === undefined;
	}
}
