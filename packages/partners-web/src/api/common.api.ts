import {instance, nonAuthInstance} from '@/api';

import {Options} from '@/@types';

export const getSearchBrandList = async (params = {main_yn: true}) => {
	return await instance.get<Options<number>>('/admin/nft/brand', {
		params,
	});
};

export const sendSlack = async (data: Record<string, any>) => {
	return await nonAuthInstance.post('/v1/common/slack/send', data);
};
