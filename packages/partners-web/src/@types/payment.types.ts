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

export interface UserPricePlan {
	payPlanName: string; // 플랜명
	payPlanId: string; // 플랜ID
	payPlanExpireDate: string; // 플랜종료일자
	payPlanLimit: number; // 플랜 제한수량
	usedNftCount: number; // 현재 발급량
}

export interface RegisterCardRequestParam {
	planId: string;
	cardNumber: string;
	cardExpirationYear: string;
	cardExpirationMonth: string;
	cardPassword: string;
	customerIdentityNumber: string;
	customerEmail: string;
}

export interface PatchPlanRequestParam {
	customerKey: string;
	planId: string;
}
