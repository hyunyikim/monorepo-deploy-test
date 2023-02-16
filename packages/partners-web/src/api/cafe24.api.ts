import {bearerTokenInstance, nonAuthInstance} from '@/api';
import {Cafe24Category, Cafe24Interwork, IssueSetting} from '@/@types';

export const getCategoryList = async (mallId: string, name = '') => {
	const url = `/cafe24/v1/interwork/${mallId}/categories`;
	const resp = await bearerTokenInstance.get<Cafe24Category[]>(url, {
		params: {
			name: name || undefined,
		},
	});
	return resp;
};

export const getInterworkByToken = async () => {
	return await bearerTokenInstance.get<Cafe24Interwork>(
		`/cafe24/v1/interwork`
	);
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

export const updateLeaveReason = async (mallId: string, reasons: any) => {
	const url = `/cafe24/v1/interwork/${mallId}/leave-reason`;
	const resp = await bearerTokenInstance.patch(url, {reasons});
	return resp;
};

export const updateSetting = async (
	mallId: string | undefined,
	issueSetting: IssueSetting
) => {
	if (!mallId) {
		throw new Error('mallId is not existed');
	}
	const url = `/cafe24/v1/interwork/${mallId}/setting`;
	const resp = await bearerTokenInstance.patch(url, issueSetting);
	return resp;
};
