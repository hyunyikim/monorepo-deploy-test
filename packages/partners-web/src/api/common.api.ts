import {instance} from '@/api';

import {ListResponse, Options} from '@/@types';

// TODO: react-query
export const getSearchBrandList = async () => {
	return await instance.get<ListResponse<Options<number>>>(
		'/admin/nft/brand',
		{
			params: {
				main_yn: true,
			},
		}
	);
};
