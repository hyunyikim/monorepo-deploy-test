import {PartnershipInfoResponse} from '@/@types';
import {instance} from '@/api';

export const getPartnershipInfo = async () => {
	return await instance.get<PartnershipInfoResponse>(
		'/v1/admin/partnerships'
	);
};
