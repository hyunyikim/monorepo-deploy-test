import {instance} from '@/api';

import {
	ListRequestParam,
	InspectionListResponse,
	InspectionListRequestSearchType,
	InspectionListRequestParam,
} from '@/@types';

export const getInspectionList = async (
	params: ListRequestParam<InspectionListRequestSearchType> &
		InspectionListRequestParam
) => {
	const res = await instance.get<{
		data: {
			data: InspectionListResponse[];
			total: number;
		};
	}>('/admin/genuine', {
		params: {
			...params,
			currentPage: params.currentPage - 1,
		},
	});
	return res.data;
};
