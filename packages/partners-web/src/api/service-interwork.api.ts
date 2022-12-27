import {instance} from '@/api';
import {ServiceInterworkType, PartnershipInfoResponse} from '@/@types';

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
