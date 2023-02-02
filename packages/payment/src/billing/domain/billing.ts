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
	changePlan: (
		plan: PricePlanProps,
		remainLimit: number,
		scheduledDate?: string,
		canceledPricePlan?: PricePlanProps
	) => void;
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
	lastPaymentAt?: string;
	lastPaymentKey?: string;
	planExpireDate?: string;
	nextPaymentDate?: string;
	nextPricePlan?: PricePlanProps;
	canceledPricePlan?: PricePlanProps;
	usedNftCount?: number;
};

/**
 * 정기구독
 * TODO: 추후 구독 정보와 PG사의 빌링 등록 내역을 분리하면 좋을 듯
 */
export class PlanBilling extends AggregateRoot implements Billing {
	private orderId?: string;
	private pausedAt?: string;
	private unregisteredAt?: string;
	private lastPaymentAt?: string;
	private lastPaymentKey?: string;
	private planExpireDate?: string;
	private nextPaymentDate?: string;
	private nextPricePlan?: PricePlanProps;
	private canceledPricePlan?: PricePlanProps;
	private usedNftCount?: number;

	constructor(private props: BillingProps) {
		super();

		this.orderId = props?.orderId;
		this.pausedAt = props?.pausedAt;
		this.unregisteredAt = props?.unregisteredAt;
		this.lastPaymentAt = props?.lastPaymentAt;
		this.lastPaymentKey = props?.lastPaymentKey;
		this.planExpireDate = props?.planExpireDate;
		this.nextPaymentDate = props?.nextPaymentDate;
		this.nextPricePlan = props?.nextPricePlan;
		this.canceledPricePlan = props?.canceledPricePlan;
		this.usedNftCount = props?.usedNftCount;
	}

	properties(): BillingProps {
		return {
			...this.props,
			orderId: this.orderId,
			pricePlan: new PricePlan(this.props.pricePlan),
			pausedAt: this.pausedAt,
			unregisteredAt: this.unregisteredAt,
			lastPaymentAt: this.lastPaymentAt,
			lastPaymentKey: this.lastPaymentKey,
			planExpireDate: this.planExpireDate,
			nextPaymentDate: this.nextPaymentDate,
			nextPricePlan: this.nextPricePlan
				? new PricePlan(this.nextPricePlan)
				: undefined,
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
		this.nextPricePlan = undefined;
		this.nextPaymentDate = undefined;
		this.planExpireDate = DateTime.fromISO(this.lastPaymentAt!)
			.plus({
				year: this.props.pricePlan.planType === 'YEAR' ? 1 : 0,
				month: this.props.pricePlan.planType === 'YEAR' ? 0 : 1,
			})
			.toISO();
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

		// 다음 결제 예정 플랜이 있을 경우 플랜 변경
		if (this.props.nextPricePlan) {
			this.props.pricePlan = this.props.nextPricePlan;
		}

		this.nextPricePlan = this.props.pricePlan;
		this.nextPaymentDate = now
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
	 * @param newPricePlan
	 * @param remainLimit
	 * @param scheduledDate
	 * @param canceledPricePlan
	 */
	changePlan(
		newPricePlan: PricePlanProps,
		remainLimit: number,
		scheduledDate?: string,
		canceledPricePlan?: PricePlanProps
	): void {
		// 예약이 아니면 현재 플랜까지 변경
		if (!scheduledDate) {
			this.props.pricePlan = {
				...newPricePlan,
				planLimit: newPricePlan.planLimit + remainLimit,
			};
		}
		console.log('@@ 취소된 플랜 @@');
		console.log(canceledPricePlan);
		this.nextPricePlan = newPricePlan;
		this.canceledPricePlan = canceledPricePlan;
		const event = new PlanChangedEvent(this.props, !!scheduledDate);
		this.apply(event);
	}

	get isRegistered() {
		return !this.unregisteredAt;
	}
}
