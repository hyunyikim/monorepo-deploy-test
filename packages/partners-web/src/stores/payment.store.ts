import {useQuery} from '@tanstack/react-query';

import {
	getPricePlanList,
	getUserPricePlan,
	getPaymentHistoryDetail,
} from '@/api/payment.api';
import {PlanType, UserPricePlanWithDate} from '@/@types';
import {isPlanOnSubscription, TRIAL_PLAN} from '@/data';

export const useGetPricePlanList = (
	{
		suspense,
	}: {
		suspense: boolean;
	} = {suspense: false}
) => {
	return useQuery({
		queryKey: ['pricePlanList'],
		queryFn: getPricePlanList,
		suspense,
		select: (data) => {
			return data.data;
		},
	});
};

export const useGetPricePlanListByPlanType = (planType: PlanType) => {
	return useQuery({
		queryKey: ['pricePlanList'],
		queryFn: getPricePlanList,
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
 * 유저가 유료플랜 구독 하고 있는지 여부
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
		select: (userPlan) =>
			userPlan.pricePlan.planLevel === TRIAL_PLAN.PLAN_LEVEL &&
			isPlanOnSubscription({
				startDate: new Date(userPlan.planStartedAt),
				...(userPlan?.planExpireDate && {
					endDate: new Date(userPlan?.planExpireDate),
				}),
				isNextPlanExisted: !!userPlan?.nextPricePlan,
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
	});
};
