import {
	PlanType,
	PricePlan,
	SubscribeNoticeStatus,
	UserPricePlanWithDate,
	TotalSubscribeInfoPreviewData,
	SubscribeInfoPreviewData,
	PaymentStatus,
} from '@/@types';
import {
	addMonths,
	isBefore,
	isAfter,
	format,
	addYears,
	endOfDay,
	differenceInDays,
	differenceInMonths,
} from 'date-fns';
import {DATE_FORMAT_SEPERATOR_DOT} from './common.data';

export const DEFAULT_PLAN_TYPE: PlanType = 'YEAR';

export const TRIAL_PLAN = {
	PLAN_LEVEL: 0,
	PLAN_DESCRIPTION:
		'30일 동안 버클의 핵심기능들을 부담없이 무료로 이용해보세요!',
};

export const CHARGED_GROUP_PLAN = {
	PLAN_NAME: '유료 플랜',
	PLAN_DESCRIPTION:
		'마케팅, 사후관리, 브랜딩을 통해 충성고객을 확보 해보세요!',
};

export const ENTERPRISE_PLAN = {
	PLAN_NAME: '엔터프라이즈 플랜',
	PLAN_DESCRIPTION: '개런티 발급량 1,000개 초과',
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

export const isPlanSameLevel = (
	nowPlanLevel: number,
	nextPlanLevel: number
) => {
	return nowPlanLevel === nextPlanLevel ? true : false;
};

export const checkSubscribeNoticeStatus = (
	userPlan?: UserPricePlanWithDate
): SubscribeNoticeStatus | null => {
	// userPlan 반드시 존재
	if (!userPlan) {
		return null;
	}
	const {pricePlan, nextPricePlan} = userPlan;

	// trial
	if (pricePlan.planLevel === TRIAL_PLAN.PLAN_LEVEL) {
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
		// 월결제 플랜 다운그레이드 예정
		if (isPlanDowngraded(pricePlan.planLevel, nextPricePlan.planLevel)) {
			return 'CHANGE_PLAN_DOWNGRADE_MONTHLY';
		}
	}

	const isOnSubscription = isPlanOnSubscription({
		startDate: userPlan?.planStartedAt,
		endDate: userPlan?.planExpireDate,
		isNextPlanExisted: !!userPlan?.nextPricePlan,
	});

	// 유료플랜 구독 종료
	if (!isOnSubscription) {
		return 'CHARGED_PLAN_FINISHED';
	}
	// 구독 취소 예정
	if (!userPlan?.nextPricePlan) {
		return 'CHARGED_PLAN_WILL_END';
	}
	return 'CHARGED';
};

// 현재 구독 중에 있는지 확인
export const isPlanOnSubscription = ({
	startDate,
	endDate,
	isNextPlanExisted,
}: {
	startDate?: Date;
	endDate?: Date;
	isNextPlanExisted: boolean;
}) => {
	if (isNextPlanExisted) {
		return true;
	}

	// 무료플랜이거나
	// 구독 취소 되었는데 아직 구독 중인 경우
	const today = new Date();
	if (startDate && endDate) {
		const endDateEndOfDay = endOfDay(endDate);
		if (isAfter(today, startDate) && isBefore(today, endDateEndOfDay)) {
			return true;
		}
		return false;
	}
	return false;
};

// 플랜 남은 일수 계산
export const getPlanLeftDays = (endDate: Date) => {
	if (!endDate) {
		return;
	}
	return differenceInDays(endOfDay(endDate), endOfDay(new Date())) + 1;
};

export const getSubscribePreviwData = ({
	selectedPlan,
	userPlan,
	isUserUsedTrialPlan,
}: {
	selectedPlan: PricePlan;
	userPlan?: UserPricePlanWithDate;
	isUserUsedTrialPlan: boolean;
}): TotalSubscribeInfoPreviewData => {
	const isOnSubscription = isPlanOnSubscription({
		startDate: userPlan?.planStartedAt,
		endDate: userPlan?.planExpireDate,
		isNextPlanExisted: !!userPlan?.nextPricePlan,
	});
	const data: SubscribeInfoPreviewData = {
		planName: selectedPlan.planName,
		subscribeDuration: '',
		displayTotalPrice: selectedPlan.displayTotalPrice,
		planTotalPrice: selectedPlan.planTotalPrice,
		discountTotalPrice: selectedPlan.discountTotalPrice,
		totalPrice: selectedPlan.totalPrice,
	};
	const today = new Date();
	const todayStr = format(today, DATE_FORMAT_SEPERATOR_DOT);
	let newPlanStartDate = new Date();
	let newPlanEndDate =
		selectedPlan.planType === 'MONTH'
			? addMonths(today, 1)
			: addYears(today, 1);
	let payApprovedAt = new Date();

	// 무료플랜이거나
	// 구독 종료된 경우
	if (isUserUsedTrialPlan || !isOnSubscription || !userPlan) {
		return {
			data: {
				...data,
				subscribeDuration: `${todayStr} - ${format(
					newPlanEndDate,
					DATE_FORMAT_SEPERATOR_DOT
				)}`,
				payApprovedAt: format(payApprovedAt, DATE_FORMAT_SEPERATOR_DOT),
			},
		};
	}

	// 유료플랜 구독 중
	const pricePlan = userPlan.pricePlan;
	const planStartedAt = userPlan.planStartedAt;
	const nextPlanStartDate =
		userPlan?.nextPlanStartDate || userPlan?.planExpireDate || new Date();

	// 업그레이드
	if (isPlanUpgraded(userPlan?.pricePlan.planLevel, selectedPlan.planLevel)) {
		// 연결제 플랜 업그레이드
		// 구독 취소 영수증 함께 존재
		if (
			isPlanTypeYear(userPlan?.pricePlan.planType) &&
			isPlanTypeYear(selectedPlan.planType)
		) {
			const usedMonths =
				differenceInMonths(new Date(), userPlan.planStartedAt) + 1;
			const canceledPlanTotalPriceByMonth =
				userPlan.pricePlan.displayTotalPrice / 12;
			const canceledPrice =
				canceledPlanTotalPriceByMonth * (12 - usedMonths);
			return {
				canceledData: {
					planName: pricePlan.planName,
					displayTotalPrice: canceledPrice,
					planTotalPrice: canceledPrice,
					totalPrice: canceledPrice,
					subscribeDuration: `${format(
						planStartedAt,
						DATE_FORMAT_SEPERATOR_DOT
					)} - ${todayStr}`,
				},
				data: {
					...data,
					subscribeDuration: `${todayStr} - ${format(
						addYears(today, 1),
						DATE_FORMAT_SEPERATOR_DOT
					)}`,
					payApprovedAt: todayStr,
				},
				totalPaidPrice: data.displayTotalPrice - canceledPrice,
			};
		}

		// 월결제 업그레이드
		if (
			isPlanTypeMonth(userPlan?.pricePlan.planType) &&
			isPlanTypeMonth(selectedPlan.planType)
		) {
			return {
				data: {
					...data,
					subscribeDuration: `${todayStr} - ${format(
						addMonths(today, 1),
						DATE_FORMAT_SEPERATOR_DOT
					)}`,
					payApprovedAt: todayStr,
				},
			};
		}
	}
	newPlanStartDate = nextPlanStartDate;
	payApprovedAt = nextPlanStartDate;

	// 월결제 다운그레이드
	// 연결제에서 월결제로
	const isMonthlyDowngrade =
		isPlanTypeMonth(userPlan?.pricePlan.planType) &&
		isPlanTypeMonth(selectedPlan.planType) &&
		(isPlanDowngraded(
			userPlan?.pricePlan.planLevel,
			selectedPlan.planLevel
		) ||
			isPlanSameLevel(
				userPlan?.pricePlan.planLevel,
				selectedPlan.planLevel
			));
	const isYearToMonth =
		isPlanTypeYear(userPlan?.pricePlan.planType) &&
		isPlanTypeMonth(selectedPlan.planType);
	if (isMonthlyDowngrade || isYearToMonth) {
		newPlanEndDate = addMonths(newPlanStartDate, 1);
	}

	// 연결제 다운그레이드(시도)
	// 월결제에서 연결제로
	const isYearlyDowngrade =
		isPlanTypeYear(userPlan?.pricePlan.planType) &&
		isPlanTypeYear(selectedPlan.planType) &&
		(isPlanDowngraded(
			userPlan.pricePlan.planLevel,
			selectedPlan.planLevel
		) ||
			isPlanSameLevel(
				userPlan.pricePlan.planLevel,
				selectedPlan.planLevel
			));
	const isMonthToYear =
		isPlanTypeMonth(userPlan?.pricePlan.planType) &&
		isPlanTypeYear(selectedPlan.planType);
	if (isYearlyDowngrade || isMonthToYear) {
		newPlanEndDate = addYears(newPlanStartDate, 1);
	}
	return {
		data: {
			...data,
			subscribeDuration: `${format(
				newPlanStartDate,
				DATE_FORMAT_SEPERATOR_DOT
			)} - ${format(newPlanEndDate, DATE_FORMAT_SEPERATOR_DOT)}`,
			payApprovedAt: format(payApprovedAt, DATE_FORMAT_SEPERATOR_DOT),
		},
	};
};

export const getPaymentStatusNameByPaymentStatus = (status: PaymentStatus) => {
	if (status === 'READY') {
		return '준비됨';
	}
	if (status === 'IN_PROGRESS') {
		return '진행중';
	}
	if (status === 'WAITING_FOR_DEPOSIT') {
		return '가상계좌 입금 대기 중';
	}
	if (status === 'DONE') {
		return '결제완료';
	}
	if (status === 'CANCELED') {
		return '결제취소';
	}
	if (status === 'PARTIAL_CANCELED') {
		return '결제 부분취소';
	}
	if (status === 'ABORTED') {
		return '결제 승인실패';
	}
	if (status === 'EXPIRED') {
		return '거래취소';
	}
	if (status === 'FAILED') {
		return '결제실패';
	}
	return '';
};
