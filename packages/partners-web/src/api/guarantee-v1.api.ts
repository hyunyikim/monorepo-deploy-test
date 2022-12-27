import {instance} from '@/api';

import {GuaranteeDetail} from '@/@types';

export const getGuaranteeDetail = async (idx: number) => {
	return await instance.get<GuaranteeDetail>(`/v1/admin/nft/${idx}`);
};
