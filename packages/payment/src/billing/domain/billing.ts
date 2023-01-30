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
import {PricePlan, PricePlanProps} from './pricePlan';

/**
 * 빌링 인터페이스
 */
export interface Billing {
	properties: () => BillingProps;
	register: () => void;
	unregister: () => void;
	isRegistered: boolean;
	approve: (payment: PaymentProps) => void;
	changePlan: (plan: PricePlanProps) => void;
	pause: () => void;
	resume: () => void;
	commit: () => void;
}

/**
 * 정기구독 속성
 */
export type BillingProps = TossBilling & {
	partnerIdx: number;
	orderId?: string;
	pricePlan: PricePlanProps;
	pausedAt?: string;
	unregisteredAt?: string;
	nextPaymentAt?: string;
	lastPaymentAt?: string;
	lastPaymentKey?: string;
	nextPricePlan?: PricePlanProps;
	usedNftCount?: number;
};

/**
 * 정기구독
 */
export class PlanBilling extends AggregateRoot implements Billing {
	private orderId?: string;
	private pausedAt?: string;
	private unregisteredAt?: string;
	private nextPaymentAt?: string;
	private lastPaymentAt?: string;
	private lastPaymentKey?: string;
	private nextPricePlan?: PricePlanProps;
	private usedNftCount?: number;

	constructor(private props: BillingProps) {
		super();

		this.orderId = props?.orderId;
		this.pausedAt = props?.pausedAt;
		this.unregisteredAt = props?.unregisteredAt;
		this.nextPaymentAt = props?.nextPaymentAt;
		this.lastPaymentAt = props?.lastPaymentAt;
		this.lastPaymentKey = props?.lastPaymentKey;
		this.nextPricePlan = props?.nextPricePlan;
		this.usedNftCount = props?.usedNftCount;
	}

	properties(): BillingProps {
		return {
			...this.props,
			orderId: this.orderId,
			pricePlan: new PricePlan(this.props.pricePlan),
			pausedAt: this.pausedAt,
			unregisteredAt: this.unregisteredAt,
			nextPaymentAt: this.nextPaymentAt,
			lastPaymentAt: this.lastPaymentAt,
			lastPaymentKey: this.lastPaymentKey,
			nextPricePlan: this.nextPricePlan,
			usedNftCount: this.usedNftCount,
		};
	}

	/**
	 * 구독 중지
	 */
	pause(): void {
		this.pausedAt = DateTime.now().toISO();
		const event = new BillingPausedEvent(this.properties());
		this.apply(event);
	}

	/**
	 * 구독 재개
	 */
	resume(): void {
		this.pausedAt = undefined;
		const event = new BillingResumedEvent(this.properties());
		this.apply(event);
	}

	/**
	 * 구독 신청
	 */
	register(): void {
		const event = new BillingRegisteredEvent(this.properties());
		this.apply(event);
	}

	/**
	 * 구독 취소
	 */
	unregister(): void {
		const now = DateTime.now();
		this.unregisteredAt = now.toISO();
		const event = new BillingUnregisteredEvent(this.properties());
		this.apply(event);
	}

	/**
	 * 결제 승인
	 * @param payment
	 */
	approve(payment: PaymentProps): void {
		const now = DateTime.now();
		this.orderId = payment.orderId;
		this.lastPaymentKey = payment.paymentKey;
		this.lastPaymentAt = now.toISO();
		this.nextPaymentAt = now
			.plus({
				year: this.props.pricePlan.planType === 'YEAR' ? 1 : 0,
				month: this.props.pricePlan.planType === 'YEAR' ? 0 : 1,
			})
			.toISO();
		const event = new BillingApprovedEvent(this.properties(), payment);
		this.apply(event);
	}

	/**
	 * 플랜 변경
	 * @param pricePlan
	 */
	changePlan(pricePlan: PricePlanProps): void {
		const offset = pricePlan.planLevel - this.props.pricePlan.planLevel;
		this.props.pricePlan = pricePlan;
		const event = new PlanChangedEvent(this.props, offset);
		this.apply(event);
	}

	get isRegistered() {
		return this.unregisteredAt === undefined;
	}
}
