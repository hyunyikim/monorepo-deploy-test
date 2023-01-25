import {useQuery} from '@tanstack/react-query';

import {getPricePlanList, getUserPricePlan} from '@/api/payment.api';
import {PlanType} from '@/@types';
import {TRIAL_PLAN} from '@/data';

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
		suspense: suspense,
	});
};

export const useGetPricePlanListByPlanType = (planType: PlanType) => {
	return useQuery({
		queryKey: ['pricePlanList'],
		queryFn: getPricePlanList,
		select: (planList) => {
			return planList
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
	});
};

/**
 * 유저가 유료플랜 구독 하고 있는지 여부
 * @param param0
 * @returns
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
		select: (userPlan) => userPlan.payPlanId === TRIAL_PLAN.PLAN_ID,
	});
};
