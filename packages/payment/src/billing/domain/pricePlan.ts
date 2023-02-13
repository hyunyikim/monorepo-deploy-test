import {AggregateRoot} from '@nestjs/cqrs';
import {PLAN_TYPE} from '../infrastructure/api-client';

/**
 * 요금제 플랜 인터페이스
 */
export interface PricePlanProps {
	planId: string;
	planName: string;
	planPrice: number;
	planTotalPrice: number;
	displayPrice: number;
	displayTotalPrice: number;
	discountRate: number;
	discountPrice: number;
	discountTotalPrice: number;
	vat: number;
	payPrice: number;
	planLimit: number;
	planType: PLAN_TYPE;
	planLevel: number;
	activated: boolean;
	usedMonths?: number;
	canceledPrice?: number;
	startedAt?: string;
	finishedAt?: string;
}

/**
 * 정기구독
 */
export class PricePlan extends AggregateRoot implements PricePlanProps {
	planId: string;
	planName: string;
	planPrice: number;
	planTotalPrice: number;
	displayPrice: number;
	displayTotalPrice: number;
	discountRate: number;
	discountPrice: number;
	discountTotalPrice: number;
	vat: number;
	payPrice: number;
	planLimit: number;
	planType: PLAN_TYPE;
	planLevel: number;
	activated: boolean;
	usedMonths?: number;

	constructor(props?: PricePlanProps) {
		super();
		Object.assign(this, props);

		if (!props) {
			this.planPrice = 0;
			this.discountRate = 0;
			this.planLimit = 0;
			this.planLevel = 0;
		}

		this.calculateTotalAmount();
	}

	/**
	 * 최종 결제 금액 계산
	 */
	calculateTotalAmount() {
		const months =
			this.usedMonths || this.planType === PLAN_TYPE.YEAR ? 12 : 1; // 수량(개월수)
		this.discountPrice = this.discountRate
			? Math.round(this.planPrice * (this.discountRate / 100)) // 할인금액
			: 0;
		this.discountTotalPrice = this.discountPrice * months; // 할인금액 * 개월
		this.displayPrice = Math.round(this.planPrice - this.discountPrice); // 표시금액 = 정상가 - 할인금액
		this.displayTotalPrice = this.displayPrice * months; // 최종 금액 = (정상가 - 할인금액) * 개월;
		this.planTotalPrice = this.planPrice * months; // 정상가 * 개월
		this.vat = this.displayTotalPrice * 0.1; // 부가세 = 최종 금액 * 0.1
		this.payPrice = this.displayTotalPrice + this.vat;
	}
}
