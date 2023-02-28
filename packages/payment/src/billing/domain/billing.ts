import {AggregateRoot} from '@nestjs/cqrs';
import {
	BillingApprovedEvent,
	BillingRegisteredEvent,
	BillingUnregisteredEvent,
	BillingDeletedEvent,
	PlanChangedEvent,
	BillingPausedEvent,
	BillingResumedEvent,
	CardRegisteredEvent,
	CardDeletedEvent,
	BillingDelayedEvent,
} from './event';
import {PaymentProps} from './payment';
import {
	Billing as TossBilling,
	BillingCard as TossBillingCard,
	PLAN_TYPE,
} from '../infrastructure/api-client';
import {DateTime} from 'luxon';
import {PricePlan, PricePlanProps} from './pricePlan';

/**
 * 빌링 인터페이스
 */
export interface Billing {
	properties: () => BillingProps;
	register: () => void;
	unregister: () => void;
	registerCard: () => void;
	deleteCard: () => void;
	delete: (isBillingChanged?: boolean) => void;
	isDeleted: boolean;
	currentTerm: {
		usedMonths: number;
		startDate: string;
		endDate: string;
	};
	approve: (payment: PaymentProps) => void;
	delay: (payment: PaymentProps) => void;
	changePlan: (
		newPricePlan: PricePlanProps,
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
	deletedAt?: string;
	lastPaymentAt?: string;
	lastPaymentKey?: string;
	lastPaymentFailedAt?: string;
	paymentFailedCount?: number;
	planExpireDate?: string;
	nextPaymentDate?: string;
	nextPricePlan?: PricePlanProps;
	canceledPricePlan?: PricePlanProps;
	usedNftCount?: number;
	paymentEmail?: string;
	currentTerm?: {
		usedMonths: number;
		startDate: string;
		endDate: string;
	};
};

/**
 * 정기구독
 * TODO: 추후 구독 정보와 PG사의 빌링 등록 내역을 분리하면 좋을 듯
 */
export class PlanBilling extends AggregateRoot implements Billing {
	private card?: TossBillingCard;
	private paymentEmail?: string;
	private orderId?: string;
	private pausedAt?: string;
	private deletedAt?: string;
	private lastPaymentAt?: string;
	private lastPaymentKey?: string;
	private lastPaymentFailedAt?: string;
	private paymentFailedCount?: number;
	private planExpireDate?: string;
	private nextPaymentDate?: string;
	private nextPricePlan?: PricePlanProps;
	private canceledPricePlan?: PricePlanProps;
	private readonly usedNftCount?: number;

	constructor(private props: BillingProps) {
		super();

		this.card = props?.card;
		this.orderId = props?.orderId;
		this.pausedAt = props?.pausedAt;
		this.deletedAt = props?.deletedAt;
		this.lastPaymentAt = props?.lastPaymentAt;
		this.lastPaymentKey = props?.lastPaymentKey;
		this.lastPaymentFailedAt = props?.lastPaymentFailedAt;
		this.paymentFailedCount = props?.paymentFailedCount;
		this.planExpireDate = props?.planExpireDate;
		this.nextPaymentDate = props?.nextPaymentDate;
		this.nextPricePlan = props?.nextPricePlan;
		this.canceledPricePlan = props?.canceledPricePlan;
		this.usedNftCount = props?.usedNftCount;
		this.paymentEmail = props?.paymentEmail;
	}

	properties(): BillingProps {
		return {
			...this.props,
			card: this.card,
			orderId: this.orderId,
			pricePlan: new PricePlan(this.props.pricePlan),
			pausedAt: this.pausedAt,
			deletedAt: this.deletedAt,
			lastPaymentAt: this.lastPaymentAt,
			lastPaymentKey: this.lastPaymentKey,
			lastPaymentFailedAt: this.lastPaymentFailedAt,
			paymentFailedCount: this.paymentFailedCount,
			planExpireDate: this.planExpireDate,
			nextPaymentDate: this.nextPaymentDate,
			nextPricePlan: this.nextPricePlan
				? new PricePlan(this.nextPricePlan)
				: undefined,
			canceledPricePlan: this.canceledPricePlan,
			usedNftCount: this.usedNftCount,
			paymentEmail: this.paymentEmail,
			currentTerm: this.currentTerm,
		};
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
		this.planExpireDate = DateTime.fromISO(
			this.props.lastPaymentAt || this.props.authenticatedAt
		)
			.plus({
				year: this.props.pricePlan.planType === PLAN_TYPE.YEAR ? 1 : 0,
				month: this.props.pricePlan.planType === PLAN_TYPE.YEAR ? 0 : 1,
			})
			.toISO();

		const event = new BillingUnregisteredEvent(this.properties());
		this.apply(event);
	}

	/**
	 * 카드 등록
	 */
	registerCard(): void {
		const event = new CardRegisteredEvent(this.properties());
		this.apply(event);
	}

	/**
	 * 카드 삭제
	 */
	deleteCard(): void {
		const event = new CardDeletedEvent(this.properties());
		this.apply(event);
	}

	/**
	 * 구독 삭제
	 */
	delete(isBillingChanged = false): void {
		this.deletedAt = DateTime.now().toISO();
		this.nextPricePlan = undefined;
		this.nextPaymentDate = undefined;

		const event = new BillingDeletedEvent(
			this.properties(),
			isBillingChanged
		);
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
				year: this.props.pricePlan.planType === PLAN_TYPE.YEAR ? 1 : 0,
				month: this.props.pricePlan.planType === PLAN_TYPE.YEAR ? 0 : 1,
			})
			.toISO();

		const event = new BillingApprovedEvent(this.properties(), payment);
		this.apply(event);
	}

	/**
	 * 결제 연장
	 * @param payment
	 */
	delay(payment: PaymentProps): void {
		const now = DateTime.now();
		this.orderId = payment.orderId;
		this.lastPaymentFailedAt = now.toISO();
		this.paymentFailedCount = (this.paymentFailedCount || 0) + 1;

		// 5일간 결제 재시도 후 사용 제한
		if (this.paymentFailedCount < 6) {
			this.nextPaymentDate = now.plus({days: 1}).toISO();
		} else {
			this.nextPricePlan = undefined;
			this.nextPaymentDate = undefined;
			this.planExpireDate = now.toISO();
		}

		const event = new BillingDelayedEvent(this.properties(), payment);
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
		const prevPlan = this.props.pricePlan;
		// 예약이 아닐경우 현재 플랜까지 즉시 신규플랜으로 변경
		if (!scheduledDate) {
			this.props.pricePlan = {
				...newPricePlan,
				planLimit: newPricePlan.planLimit + remainLimit,
			};
			this.nextPaymentDate = DateTime.now()
				.plus({
					year:
						this.props.pricePlan.planType === PLAN_TYPE.YEAR
							? 1
							: 0,
					month:
						this.props.pricePlan.planType === PLAN_TYPE.YEAR
							? 0
							: 1,
				})
				.toISO();
		}
		this.nextPricePlan = newPricePlan;
		this.canceledPricePlan = canceledPricePlan;
		this.planExpireDate = undefined;
		this.paymentFailedCount = undefined;

		const event = new PlanChangedEvent(
			this.properties(),
			prevPlan,
			scheduledDate
		);
		this.apply(event);
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

	get isDeleted() {
		return !!this.deletedAt;
	}

	get currentTerm() {
		const startedAt = DateTime.fromISO(
			this.props.lastPaymentAt || this.props.authenticatedAt
		);

		const usedMonths: number =
			Math.ceil(-startedAt.diffNow('months').months) || 1;

		// 오늘일자가 포함된 1개월치 사용량만 조회되도록 검색 시작일자를 계산
		const startDate =
			usedMonths > 1
				? startedAt
						.plus({
							months: usedMonths - 1,
						})
						.toISO()
				: startedAt.toISO();

		const endDate = DateTime.fromISO(startDate)
			.plus({
				months: 1,
			})
			.toISO();

		return {
			usedMonths,
			startDate,
			endDate,
		};
	}
}
