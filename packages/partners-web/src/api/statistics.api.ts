import {StatisticsRequest, StatisticsResponse} from '@/@types';
import {instance} from '@/api';

export const getNftStatistics = async (params: StatisticsRequest) => {
	return await instance.get<StatisticsResponse>('/v1/admin/statistic/nft', {
		params,
	});
};
