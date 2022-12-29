import {bearerTokenInstance, nonAuthInstance} from '@/api';
import {Cafe24Interwork} from '@/@types';

export const getCategories = async (mallId: string, name = '') => {
	const url = `/cafe24/v1/interwork/${mallId}/categories`;
	const resp = await nonAuthInstance.get(url, {
		params: {
			name: name || undefined,
		},
	});
	return resp.data;
};

export const getInterwork = async (mallId: string) => {
	const url = `/cafe24/v1/interwork/${mallId}`;
	const resp = await nonAuthInstance.get(url);
	return resp.data;
};

export const getInterworkByToken = async () => {
	const url = `/cafe24/v1/interwork`;
	return await bearerTokenInstance.get(url);
};

export const getInterworkMaster = async (idx: number) => {
	const url = `/master/interwork`;
	const resp = await bearerTokenInstance.get(url, {
		params: {
			partnershipIdx: idx,
		},
	});
	return resp;
};

export const getGuaranteeReqInfo = async (reqIdx: number) => {
	const url = `/cafe24/v1/guarantees/${reqIdx}`;
	const resp = await bearerTokenInstance.get(url);
	return resp;
};

// cafe24 연동 초기화
export const requestInterwork = async (mallId: string, authCode: string) => {
	const url = `/cafe24/v1/interwork/${mallId}`;
	const body = {
		authCode: authCode,
	};
	const resp = await nonAuthInstance.post<Cafe24Interwork>(url, body);
	return resp.data;
};

// cafe24 연동 승인
export const confirmInterwork = async (mallId: string) => {
	const url = `/cafe24/v1/interwork/${mallId}/confirm`;
	return await bearerTokenInstance.post<Cafe24Interwork>(url);
};

export const isConfirmedInterwork = async (mallId: string) => {
	const url = `/cafe24/v1/interwork/${mallId}/confirm`;
	const resp = await nonAuthInstance.get<boolean>(url);
	return resp.data;
};

export const changeInterworkSetting = async (mallId: string, setting: any) => {
	const url = `/cafe24/v1/interwork/${mallId}/setting`;
	const resp = await bearerTokenInstance.patch(url, setting);
	return resp;
};

export const updateLeaveReason = async (mallId: string, reasons: any) => {
	const url = `/cafe24/v1/interwork/${mallId}/leave-reason`;
	const resp = await bearerTokenInstance.patch(url, {reasons});
	return resp;
};

/**
 *
 * @param {string} mallId
 * @param {IssueSetting} issueSetting
 * @returns
 */
export const updateSetting = async (mallId: string, issueSetting: any) => {
	const url = `/cafe24/v1/interwork/${mallId}/setting`;
	const resp = await bearerTokenInstance.patch(url, issueSetting);
	return resp;
};
