import {useQuery} from '@tanstack/react-query';
import {parse} from 'date-fns';

import {
	getPaymentHistoryList,
	getPricePlanList,
	getUserPricePlan,
} from '@/api/payment.api';
import {PlanType, UserPricePlanWithDate} from '@/@types';
import {DATE_FORMAT, TRIAL_PLAN} from '@/data';

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
		select: (userPlan) =>
			({
				...userPlan,
				planStartDate: parse(
					userPlan.planStartDate,
					DATE_FORMAT,
					new Date()
				),
				planExpireDate: parse(
					userPlan.planExpireDate,
					DATE_FORMAT,
					new Date()
				),
				...(userPlan.nextPlanStartDate && {
					nextPlanStartDate: parse(
						userPlan.nextPlanStartDate,
						DATE_FORMAT,
						new Date()
					),
				}),
				...(userPlan.nextPlanPaymentDate && {
					nextPlanPaymentDate: parse(
						userPlan.nextPlanPaymentDate,
						DATE_FORMAT,
						new Date()
					),
				}),
			} as UserPricePlanWithDate),
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
		select: (userPlan) => userPlan.pricePlan.planId === TRIAL_PLAN.PLAN_ID,
	});
};

/**
 * 유저의 구독 내역 목록 조회
 */
// export const useGetUserPaymentHistoryList = (
// 	{
// 		suspense,
// 	}: {
// 		suspense: boolean;
// 	} = {suspense: false}
// ) => {
// 	return useQuery({
// 		queryKey: ['userPaymentHistoryList'],
// 		queryFn: getPaymentHistoryList,
// 		suspense,
// 		select: (paymentHistoryList) =>
// 			paymentHistoryList.map((history) => ({
// 				...history,
// 				startDate: parse(history.startDate, DATE_FORMAT, new Date()),
// 				expireDate: parse(history.expireDate, DATE_FORMAT, new Date()),
// 			})),
// 	});
// };
