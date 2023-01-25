import {instance, nonAuthInstance} from '@/api';

import {pricePlanExample, userPricePlanExample} from '@/data';
import {
	PatchPlanRequestParam,
	PricePlan,
	RegisterCardRequestParam,
	UserPricePlan,
} from '@/@types';

/**
 * 구독 플랜 목록 조회
 */
export const getPricePlanList = () => {
	return new Promise<PricePlan[]>((resolve) => {
		setTimeout(() => {
			resolve(pricePlanExample);
		}, 100);
	});
};

/**
 * 사용자가 구독 중인 플랜 조회
 */
export const getUserPricePlan = () => {
	return new Promise<UserPricePlan>((resolve) => {
		setTimeout(() => {
			resolve(userPricePlanExample);
		}, 100);
	});
};

/**
 * 카드등록 및 구독신청
 */
export const registerCard = (data: RegisterCardRequestParam) => {
	// return instance.post('/v1/billing');
	return new Promise<PricePlan[]>((resolve) => {
		setTimeout(() => {
			resolve(pricePlanExample);
		}, 100);
	});
};

/**
 * 구독플랜 변경
 */
export const patchPricePlan = (data: PatchPlanRequestParam) => {
	// return instance.patch('/v1/billing');
	return new Promise<PricePlan[]>((resolve) => {
		setTimeout(() => {
			resolve(pricePlanExample);
		}, 100);
	});
};

/**
 * 구독 취소
 */
export const deletePricePlan = () => {
	// return instance.delete('/v1/billing/history');
	return new Promise<PricePlan[]>((resolve) => {
		setTimeout(() => {
			resolve(pricePlanExample);
		}, 100);
	});
};

/**
 * 구독 이력 목록 조회
 */
export const getSubscribeHistoryList = () => {
	// return instance.get('/v1/billing/history');
	return new Promise<PricePlan[]>((resolve) => {
		setTimeout(() => {
			resolve(pricePlanExample);
		}, 100);
	});
};

/**
 * 구독 이력 상세 조회
 */
export const getSubscribeHistoryDetail = () => {
	// return instance.get('/v1/billing/history');
	return new Promise<PricePlan[]>((resolve) => {
		setTimeout(() => {
			resolve(pricePlanExample);
		}, 100);
	});
};
