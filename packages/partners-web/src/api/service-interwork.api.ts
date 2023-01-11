import {instance} from '@/api';
import {
	ServiceInterworkType,
	kakaoDataProps,
	PartnershipInfoResponse,
} from '@/@types';

export const installServiceInterwork = async (
	serviceType: ServiceInterworkType
) => {
	return await instance.patch<PartnershipInfoResponse>(
		`/v1/admin/partnerships/install/${serviceType}`
	);
};

export const uninstallServiceInterwork = async (
	serviceType: ServiceInterworkType
) => {
	return await instance.patch<PartnershipInfoResponse>(
		`/v1/admin/partnerships/uninstall/${serviceType}`
	);
};

// 카카오 알림 인증하기
export const installKakoNotificationService = async (data: kakaoDataProps) => {
	return await instance.post<PartnershipInfoResponse>(
		`v1/admin/partnerships/install/alimtalk`,
		data
	);
};
// 카카오 알림 연동완료하기
export const verifyKakoNotificationService = async (data: kakaoDataProps) => {
	return await instance.post<PartnershipInfoResponse>(
		`v1/admin/partnerships/verify/alimtalk`,
		data
	);
};
