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
	vat: number; // 부가세
	planLimit: number; // 기간내 발급 가능수량
	planType: PlanType;
	planLevel: number; // 등급(순서)
}

export interface UserPricePlan {
	customerKey?: string;
	pricePlan: PricePlan; // 현재 이용 플랜
	nextPricePlan?: PricePlan; // 다음 예정 플랜
	planStartedAt: string; // 플랜시작일자(ISO8601)
	planExpireDate?: string; // 플랜종료 예정일자(ISO8601)
	nextPlanStartDate?: string; // 다음 플랜시작일자(ISO8601)
	usedNftCount: number; // 현재 사용량
	card?: Card; // 카드
	paymentFailedCount?: number;
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
		'planStartedAt' | 'planExpireDate' | 'nextPlanStartDate'
	> {
	planStartedAt: Date;
	planExpireDate?: Date;
	nextPlanStartDate?: Date;
}
export interface RegisterCardRequestParam {
	cardNumber: string;
	cardExpirationYear: string;
	cardExpirationMonth: string;
	cardPassword: string;
	customerIdentityNumber: string;
	customerEmail: string;
}

export interface PatchPlanRequestParam {
	planId: string;
}
export interface PaymentHistory {
	orderId: string;
	displayOrderId: string;
	planName: string;
	startDate: string;
	expireDate: string;
	payPrice: number;
	payStatus: PaymentStatus;
}

export interface PaymentHistoryDetail extends PaymentHistory {
	pricePlan: PricePlan;
	canceledPricePlan?: PricePlan; // 취소된 플랜
	payApprovedAt: string; // 결제 승인일자
	totalPaidPrice: number; // 최종 결제금액
}

export type PaymentStatus =
	| 'READY'
	| 'IN_PROGRESS'
	| 'WAITING_FOR_DEPOSIT'
	| 'DONE'
	| 'CANCELED'
	| 'PARTIAL_CANCELED'
	| 'ABORTED'
	| 'EXPIRED'
	| 'FAILED';

export interface RegisterFreePlanRequestParam {
	planMonth: number;
	planLimit: number;
}
