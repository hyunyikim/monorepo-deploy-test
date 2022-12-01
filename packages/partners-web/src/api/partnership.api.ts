import {instance} from '@/api';

import {PartnershipInfoResponse, Options} from '@/@types';

export const getPartnershipInfo = async () => {
	return await instance.get<PartnershipInfoResponse>(
		'/v1/admin/partnerships'
	);
};

export const getSearchBrandList = async (params = {main_yn: true}) => {
	const res = await instance.get<{
		data: Options<number>;
	}>('/admin/nft/brand', {
		params,
	});
	return res.data;
};
