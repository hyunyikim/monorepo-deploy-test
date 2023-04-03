import {bearerTokenInstance, nonAuthInstance} from '@/api';

import {
	PaymentHistory,
	PatchPlanRequestParam,
	PricePlan,
	RegisterCardRequestParam,
	UserPricePlan,
	PaymentHistoryDetail,
	ListRequestParam,
	ListResponseV2,
	RegisterFreePlanRequestParam,
	PaymentReceiptHistoryRequestParam,
} from '@/@types';

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
	return await bearerTokenInstance.get<UserPricePlan>('/payment/v1/billing');
};

/**
 * 카드 등록
 */
export const registerCard = async (data: RegisterCardRequestParam) => {
	return await bearerTokenInstance.post('/payment/v1/billing/card', data);
};

/**
 * 카드 삭제
 */
export const deleteCard = async (customerKey: string) => {
	return await bearerTokenInstance.delete('/payment/v1/billing/card', {
		data: {
			customerKey,
		},
	});
};

/**
 * 구독플랜 변경
 */
export const patchPricePlan = async (data: PatchPlanRequestParam) => {
	return await bearerTokenInstance.patch('/payment/v1/billing', data);
};

/**
 * 구독 내역 목록 조회
 */
export const getPaymentHistoryList = async (
	params: Pick<ListRequestParam, 'sort' | 'currentPage' | 'pageMaxNum'>
) => {
	return await bearerTokenInstance.get<ListResponseV2<PaymentHistory[]>>(
		'/payment/v1/billing/history',
		{
			params: {
				sort: params.sort,
				page: params.currentPage,
				pageSize: params.pageMaxNum,
			},
		}
	);
};

/**
 * 결제 내역 목록 조회
 */
export const getPaymentReciptList = async (
	params: PaymentReceiptHistoryRequestParam
) => {
	const {sort, currentPage, pageMaxNum, ...rest} = params;
	return await bearerTokenInstance.get<ListResponseV2<PaymentHistory[]>>(
		'/payment/v1/billing/receipt',
		{
			params: {
				sort: sort,
				page: currentPage,
				pageSize: pageMaxNum,
				...rest,
			},
		}
	);
};

/**
 * 구독/결제 이력 상세 조회
 */
export const getPaymentHistoryDetail = async (orderId: string) => {
	return await bearerTokenInstance.get<PaymentHistoryDetail>(
		`/payment/v1/billing/receipt/${orderId}`
	);
};

/**
 * 구독 취소
 */
export const cancelPricePlan = async () => {
	return await bearerTokenInstance.patch('/payment/v1/billing/cancel');
};
