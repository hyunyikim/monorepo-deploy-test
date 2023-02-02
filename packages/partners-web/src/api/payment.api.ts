import {instance, nonAuthInstance} from '@/api';

import {paymentHistoryList, userPricePlanExample} from '@/data';
import {
	PaymentHistory,
	PatchPlanRequestParam,
	PricePlan,
	RegisterCardRequestParam,
	UserPricePlan,
	PaymentHistoryDetail,
} from '@/@types';
import {delay} from '@/utils';

/**
 * 구독 플랜 목록 조회
 */
export const getPricePlanList = async () => {
	return await nonAuthInstance.get<PricePlan[]>('/payment/v1/billing/plans');
};

/**
 * 사용자가 구독 중인 플랜 조회
 */
export const getUserPricePlan = async () => {
	// return await instance.get('/payment/v1/billing');
	return new Promise<UserPricePlan>((resolve) => {
		setTimeout(() => {
			resolve(userPricePlanExample);
		}, 100);
	});
};

/**
 * 카드등록 및 구독신청
 */
export const registerCard = async (data: RegisterCardRequestParam) => {
	return await instance.post('/payment/v1/billing', data);
};

/**
 * 구독플랜 변경
 */
export const patchPricePlan = async (data?: PatchPlanRequestParam) => {
	// return await instance.patch('/payment/v1/billing');
	// return new Promise<PricePlan[]>((resolve) => {
	// 	setTimeout(() => {
	// 		resolve(pricePlanExample);
	// 	}, 100);
	// });
};

/**
 * 구독 취소
 */
export const deletePricePlan = async () => {
	// return await instance.delete('/v1/billing/history');
	// return new Promise<PricePlan[]>((resolve) => {
	// 	setTimeout(() => {
	// 		resolve(pricePlanExample);
	// 	}, 100);
	// });
};

/**
 * 구독 이력 목록 조회
 */
export const getPaymentHistoryList = async () => {
	// /payment/v1/billing/receipt?sort=latest&page=1&pageSize=5
	return await instance.get('/payment/v1/billing/receipt');
};

/**
 * 구독 이력 상세 조회
 */
export const getPaymentHistoryDetail = async (orderId: number) => {
	// return await instance.get(`/payment/v1/billing/receipt/${orderId}`);
};
