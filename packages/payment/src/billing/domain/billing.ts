import {AggregateRoot} from '@nestjs/cqrs';
import {
	BillingApprovedEvent,
	BillingRegisteredEvent,
	BillingUnregisteredEvent,
	PlanChangedEvent,
	BillingPausedEvent,
	BillingResumedEvent,
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
	changePlan: (plan: PricePlan) => void;
	pause: () => void;
	resume: () => void;
	commit: () => void;
}

export interface PricePlan {
	planId: string;
	planName: string;
	planPrice: number;
	planLimit: number;
	planType: 'MONTH' | 'YEAR';
	activated: boolean;
	planLevel: number;
}

export type BillingProps = TossBilling & {
	authKey: string;
	pricePlan: PricePlan;
	pausedAt?: string;
	unregisteredAt?: string;
	nextPaymentAt?: string;
	lastPaymentAt?: string;
};

export class PlanBilling extends AggregateRoot implements Billing {
	private unregisteredAt?: string;
	private nextPaymentAt?: string;
	private lastPaymentAt?: string;
	private pausedAt?: string;

	constructor(private props: BillingProps) {
		super();
	}

	properties(): BillingProps {
		return {
			...this.props,
			unregisteredAt: this.unregisteredAt,
			nextPaymentAt: this.nextPaymentAt,
			lastPaymentAt: this.lastPaymentAt,
			pausedAt: this.pausedAt,
		};
	}

	pause(): void {
		this.pausedAt = DateTime.now().toISO();
		const event = new BillingPausedEvent(this.properties());
		this.apply(event);
	}

	resume(): void {
		this.pausedAt = undefined;
		const event = new BillingResumedEvent(this.properties());
		this.apply(event);
	}

	register(): void {
		const event = new BillingRegisteredEvent(this.properties());
		this.apply(event);
	}

	unregister(): void {
		const now = DateTime.now();
		this.unregisteredAt = now.toISO();
		const event = new BillingUnregisteredEvent(this.properties());
		this.apply(event);
	}

	approve(payment: PaymentProps): void {
		const now = DateTime.now();
		this.lastPaymentAt = now.toISO();
		this.nextPaymentAt = now
			.plus({
				year: this.isMonthly ? 0 : 1,
				month: this.isMonthly ? 1 : 0,
			})
			.set({
				hour: 0,
				minute: 0,
				second: 0,
				millisecond: 0,
			})
			.toISO();
		const event = new BillingApprovedEvent(this.properties(), payment);
		this.apply(event);
	}

	changePlan(pricePlan: PricePlan): void {
		const offset = pricePlan.planLevel - this.props.pricePlan.planLevel;
		this.props.pricePlan = pricePlan;

		const event = new PlanChangedEvent(this.properties(), offset);
		this.apply(event);
	}

	private get isMonthly() {
		return this.props.pricePlan.planType === 'MONTH';
	}

	get isRegistered() {
		return this.unregisteredAt === undefined;
	}
}
