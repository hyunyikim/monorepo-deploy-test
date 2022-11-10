import {instance, nonAuthInstance} from '@/api';

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

export const sendSlack = async (data: Record<string, any>) => {
	return await nonAuthInstance.post('/v1/common/slack/send', data);
};
