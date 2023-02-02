export type PlanType = 'MONTH' | 'YEAR';

export interface PricePlan {
	planId: string; // ID
	planName: string; // 플랜명
	planPrice: number; // 정상가(원)
	planTotalPrice: number; // 정상가 * 개월수
	displayPrice: number; // 표시금액 = 정상가 - 할인금액
	displayTotalPrice: number; // 표시금액 * 개월수
	discountRate: number; // 할인율(%)
	discountPrice: number; // 할인금액
	discountTotalPrice: number; // 할인금액 * 개월수
	totalPrice: number; // 최종 금액
	vat: number; // 부가세
	planLimit: number; // 기간내 발급 가능수량
	planType: PlanType;
	planLevel: number; // 등급(순서)
}

export interface UserPricePlan {
	pricePlan: PricePlan; // 현재 이용 플랜
	planStartDate: string; // 플랜시작일자
	planExpireDate: string; // 플랜종료일자
	nextPricePlan?: PricePlan; // 변경 예정 플랜
	nextPlanStartDate?: string; // 다음 플랜시작일자
	nextPlanPaymentDate?: string; // 다음 플랜 결제 시작일자		// TODO: 필드명 임시 설정
	usedNftCount: number; // 현재 발급량
	card?: Card; // 카드
}
export interface Card {
	cardType: string; // 신용, 체크, 기프트
	ownerType: string; // 개인, 법인
	number: string; // "379183******053"
	company: string; // "삼성"
	companyCode: string; // 카드사코드 참고
}

export interface UserPricePlanWithDate
	extends Omit<
		UserPricePlan,
		| 'planStartDate'
		| 'planExpireDate'
		| 'nextPlanStartDate'
		| 'nextPlanPaymentDate'
	> {
	planStartDate: Date;
	planExpireDate: Date;
	nextPlanStartDate?: Date;
	nextPlanPaymentDate?: Date;
}
export interface RegisterCardRequestParam {
	planId?: string;
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
export interface PaymentHistory {
	orderId: string;
	displayOrderId: string;
	planName: string;
	startDate: string;
	expireDate: string;
}

export interface PaymentHistoryDetail extends PaymentHistory {
	pricePlan: PricePlan;
	canceledPlan?: PricePlan; // 취소된 플랜
	payApprovedAt: string; // 결제 승인일자
	totalPaidPrice: number; // 최종 결제금액
}
