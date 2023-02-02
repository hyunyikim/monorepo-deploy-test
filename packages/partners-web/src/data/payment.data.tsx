import {
	PaymentHistory,
	PlanType,
	PricePlan,
	UserPricePlan,
	SubscribeNoticeStatus,
	UserPricePlanWithDate,
} from '@/@types';

export const userPricePlanExample: UserPricePlan = {
	// 무료
	pricePlan: {
		planId: 'FREE_TRIAL',
		planName: '무료체험',
		planPrice: 0,
		discountRate: 0,
		discountPrice: 0,
		planTotalPrice: 0,
		displayPrice: 0,
		totalPrice: 0,
		planLimit: 100,
		planType: 'MONTH',
		planLevel: 0,
		vat: 0,
	},
	planStartDate: '2023-01-01',
	planExpireDate: '2023-01-26',
	usedNftCount: 71,
	// 유료
	// pricePlan: pricePlanExample.find(
	// 	(plan) => plan.planType === 'MONTH' && plan.planLevel === 1
	// ) as PricePlan,
	// planStartDate: '2022-12-01',
	// planExpireDate: '2023-03-01',
	// nextPricePlan: pricePlanExample.find(
	// 	(plan) => plan.planType === 'MONTH' && plan.planLevel === 1
	// ) as PricePlan,
	// nextPlanStartDate: '2023-31-01',
	// usedNftCount: 170,
};

export const paymentHistoryList: PaymentHistory[] = [
	{
		orderId: 'payment2',
		displayOrderId: 'payment2',
		planName: '엑스스몰 플랜',
		startDate: '2024-01-01',
		expireDate: '2024-12-31',
	},
	{
		orderId: 'payment1',
		displayOrderId: 'payment1',
		planName: '엑스스몰 플랜',
		startDate: '2022-12-01',
		expireDate: '2023-12-31',
	},
];

export const DEFAULT_PLAN_TYPE: PlanType = 'YEAR';

export const TRIAL_PLAN = {
	PLAN_ID: 'FREE_TRIAL',
	PLAN_DESCRIPTION:
		'30일 동안 버클의 핵심기능들을 부담없이 무료로 이용해보세요!',
};

export const CHARGED_GROUP_PLAN = {
	PLAN_NAME: '유료 플랜',
	PLAN_DESCRIPTION:
		'마케팅, 사후관리, 브랜딩을 통해 충성고객을 확보 해보세요!',
};

export const getChargedPlanDescription = (planLimit: number): string =>
	`개런티 발급량 ${planLimit}개`;

export const isPlanTypeMonth = (planType: PlanType) => {
	return planType === 'MONTH' ? true : false;
};

export const isPlanTypeYear = (planType: PlanType) => {
	return planType === 'YEAR' ? true : false;
};

export const isPlanUpgraded = (nowPlanLevel: number, nextPlanLevel: number) => {
	return nowPlanLevel < nextPlanLevel ? true : false;
};

export const isPlanDowngraded = (
	nowPlanLevel: number,
	nextPlanLevel: number
) => {
	return nowPlanLevel > nextPlanLevel ? true : false;
};

export const checkSubscribeNoticeStatus = (
	userPlan: UserPricePlanWithDate
): SubscribeNoticeStatus | null => {
	if (!userPlan) {
		return null;
	}
	const {pricePlan, nextPricePlan} = userPlan;

	// trial
	if (pricePlan.planId === TRIAL_PLAN.PLAN_ID) {
		return 'TRIAL';
	}

	// 유료 플랜
	if (nextPricePlan) {
		// 월결제에서 연결제로 변경 예정
		if (
			isPlanTypeMonth(pricePlan.planType) &&
			isPlanTypeYear(nextPricePlan.planType)
		) {
			return 'CHANGE_PLAN_MONTH_TO_YEAR';
		}
		// 연결제에서 월결제로 변경 예정
		if (
			isPlanTypeYear(pricePlan.planType) &&
			isPlanTypeMonth(nextPricePlan.planType)
		) {
			return 'CHANGE_PLAN_YEAR_TO_MONTH';
		}
		// 플랜 업그레이드 예정
		if (isPlanUpgraded(pricePlan.planLevel, nextPricePlan.planLevel)) {
			return 'CHANGE_PLAN_UPGRADE';
		}
		// 월결제 프랜 다운그레이드 예정
		if (isPlanDowngraded(pricePlan.planLevel, nextPricePlan.planLevel)) {
			return 'CHANGE_PLAN_DOWNGRADE_MONTHLY';
		}
	}
	return 'CHARGED';
};
