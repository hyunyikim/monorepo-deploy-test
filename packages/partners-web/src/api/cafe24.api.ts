import {bearerTokenInstance, nonAuthInstance} from '@/api';
import {
	Cafe24Category,
	Cafe24ConfirmType,
	Cafe24Interwork,
	IssueSetting,
	ResponseV2,
} from '@/@types';

export const getCategoryList = async (mallId: string, name = '') => {
	const url = `/cafe24/v1/interwork/${mallId}/categories`;
	const resp = await bearerTokenInstance.get<ResponseV2<Cafe24Category[]>>(
		url,
		{
			params: {
				name: name || undefined,
			},
		}
	);
	return resp.data;
};

export const getInterworkByToken = async () => {
	const res = await bearerTokenInstance.get<ResponseV2<Cafe24Interwork>>(
		`/cafe24/v1/interwork`
	);
	return res.data;
};

// cafe24 연동 초기화
export const requestInterwork = async (mallId: string, authCode: string) => {
	const url = `/cafe24/v1/interwork/${mallId}`;
	const body = {
		authCode: authCode,
	};
	const resp = await nonAuthInstance.post<ResponseV2<Cafe24Interwork>>(
		url,
		body
	);
	return resp.data.data;
};

// cafe24 연동 승인
export const confirmInterwork = async (mallId: string) => {
	const url = `/cafe24/v1/interwork/${mallId}/confirm`;
	return await bearerTokenInstance.post<Cafe24Interwork>(url);
};

export const isConfirmedInterwork = async (
	mallId: string,
	isLogin: boolean
): Promise<Cafe24ConfirmType> => {
	const url = `/cafe24/v1/interwork/${mallId}/confirm`;

	if (isLogin) {
		const resp = await bearerTokenInstance.get<
			ResponseV2<Cafe24ConfirmType>
		>(url);
		return resp?.data;
	}
	const resp = await nonAuthInstance.get<ResponseV2<Cafe24ConfirmType>>(url);
	return resp.data?.data;
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
