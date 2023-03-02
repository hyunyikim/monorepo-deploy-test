import {useQuery} from '@tanstack/react-query';

import {
	getPricePlanList,
	getUserPricePlan,
	getPaymentHistoryDetail,
	getPaymentHistoryList,
} from '@/api/payment.api';
import {PlanType, UserPricePlanWithDate} from '@/@types';
import {isPlanOnSubscription, TRIAL_PLAN} from '@/data';
import {delay as delayFunc} from '@/utils';

export const useGetPricePlanList = (
	{
		suspense,
		delay,
	}: {
		suspense: boolean;
		delay?: number | false;
	} = {suspense: false, delay: false}
) => {
	return useQuery({
		queryKey: ['pricePlanList'],
		queryFn: async () => {
			delay && (await delayFunc(delay));
			return await getPricePlanList();
		},
		suspense,
		refetchOnMount: false,
		select: (data) => data.data,
	});
};

export const useGetPricePlanListByPlanType = (planType: PlanType) => {
	return useQuery({
		queryKey: ['pricePlanList'],
		queryFn: getPricePlanList,
		refetchOnMount: false,
		select: (data) => {
			return data?.data
				.filter((plan) => plan.planType === planType)
				.sort((a, b) => a.planLevel - b.planLevel);
		},
	});
};

export const useGetUserPricePlan = (
	{
		suspense,
	}: {
		suspense: boolean;
	} = {suspense: false}
) => {
	return useQuery({
		queryKey: ['userPricePlan'],
		queryFn: getUserPricePlan,
		suspense,
		refetchOnMount: false,
		select: (userPlan) => {
			return {
				...userPlan,
				...(userPlan?.planStartedAt && {
					planStartedAt: new Date(userPlan?.planStartedAt),
				}),
				...(userPlan?.planExpireDate && {
					planExpireDate: new Date(userPlan?.planExpireDate),
				}),
				...(userPlan?.nextPlanStartDate && {
					nextPlanStartDate: new Date(userPlan?.nextPlanStartDate),
				}),
			} as UserPricePlanWithDate;
		},
	});
};

/**
 * 무료플랜 사용 여부
 */
export const useIsUserUsedTrialPlan = (
	{
		suspense,
	}: {
		suspense: boolean;
	} = {suspense: false}
) => {
	return useQuery({
		queryKey: ['userPricePlan'],
		queryFn: getUserPricePlan,
		suspense,
		refetchOnMount: false,
		select: (userPlan) =>
			userPlan.pricePlan.planLevel === TRIAL_PLAN.PLAN_LEVEL,
	});
};

/**
 * 현재 플랜 구독 여부
 */
export const useIsPlanOnSubscription = () => {
	return useQuery({
		queryKey: ['userPricePlan'],
		queryFn: getUserPricePlan,
		refetchOnMount: false,
		select: (userPlan) =>
			userPlan &&
			isPlanOnSubscription({
				startDate: userPlan?.planStartedAt
					? new Date(userPlan.planStartedAt)
					: undefined,
				endDate: userPlan?.planExpireDate
					? new Date(userPlan.planExpireDate)
					: undefined,
				planType: userPlan.pricePlan.planType,
				isNextPlanExisted: !!userPlan?.nextPricePlan,
			}),
	});
};

/**
 * 유저의 가장 최신 구독 내역 1건 조회
 */
export const useGetUserLatestPaymentHistoryList = () => {
	return useQuery({
		queryKey: ['useGetUserPaymentHistoryList'],
		queryFn: () =>
			getPaymentHistoryList({
				sort: 'latest',
				currentPage: 1,
				pageMaxNum: 1,
			}),
	});
};

/**
 * 유저의 구독 내역 상세 조회
 */
export const useGetUserPaymentHistoryDetail = (
	orderId: string,
	{
		suspense,
	}: {
		suspense: boolean;
	} = {suspense: false}
) => {
	return useQuery({
		queryKey: ['useGetUserPaymentHistoryDetail', orderId],
		queryFn: () => getPaymentHistoryDetail(orderId),
		suspense,
		refetchOnMount: false,
	});
};
