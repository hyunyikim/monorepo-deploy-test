export type PlanType = 'MONTH' | 'YEAR';

export interface PricePlan {
	planId: string; // ID
	planName: string; // 플랜명
	planPrice: number; // 금액(원)
	discountRage: number; // 할인율(%)
	displayPrice: number; // 표시금액(금액-할인)
	vat: number; // 부가세(원)
	totalPrice: number; // 결제금액((금액-할인)*개월+부가세)
	planLimit: number; // 발급량
	planType: PlanType;
	planLevel: number; // 등급(순서)
}
