import {AggregateRoot} from '@nestjs/cqrs';

/**
 * 요금제 플랜 인터페이스
 */
export interface PricePlanProps {
	planId: string;
	planName: string;
	planPrice: number;
	displayPrice: number;
	discountRate: number;
	discountPrice: number;
	planLimit: number;
	planType: 'MONTH' | 'YEAR';
	planLevel: number;
	activated: boolean;
	originTotalPrice: number;
	totalPrice: number;
	vat: number;
}

/**
 * 정기구독
 */
export class PricePlan extends AggregateRoot implements PricePlanProps {
	planId: string;
	planName: string;
	planPrice: number;
	displayPrice: number;
	discountRate: number;
	discountPrice: number;
	planLimit: number;
	planType: 'MONTH' | 'YEAR';
	planLevel: number;
	activated: boolean;
	originTotalPrice: number;
	totalPrice: number;
	vat: number;

	constructor(props: PricePlanProps) {
		super();
		Object.assign(this, props);

		this.calculateTotalAmount();
	}

	/**
	 * 최종 결제 금액 계산
	 */
	calculateTotalAmount() {
		const count: number = this.planType === 'YEAR' ? 12 : 1; // 수량(개월수)
		this.discountPrice = this.discountRate
			? Math.round(this.planPrice * (this.discountRate / 100))
			: 0; // 할인금액

		this.displayPrice = Math.round(this.planPrice - this.discountPrice); // 표시금액(금액-할인)
		this.originTotalPrice = this.planPrice * count; // 최종 정상가 (금액 * 개월)
		this.totalPrice = this.displayPrice * count; // 최종 금액 = (정상가 - 할인금액) * 개월;
		this.vat = this.totalPrice * 0.1; // 부가세 = 최종 금액 * 0.1
	}
}
