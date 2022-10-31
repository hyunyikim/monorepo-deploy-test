import {instance} from '@/api';

import {
	ListRequestParam,
	RepairListResponse,
	RepairListRequestSearchType,
	RepairListRequestParam,
} from '@/@types';

export const getRepairList = async (
	params: ListRequestParam<RepairListRequestSearchType> &
		RepairListRequestParam
) => {
	const res = await instance.get<{
		data: {
			data: RepairListResponse[];
			total: number;
		};
	}>('/admin/repair', {
		params: {
			...params,
			currentPage: params.currentPage - 1,
		},
	});
	return res.data;
};

export const cancelRepair = async (value: number) => {
	return await instance.delete<{message: string}>('/admin/repair/estimate', {
		data: {
			inspct_idx: value,
		},
	});
};

export const acceptRepair = async (value: number) => {
	return await instance.put<{message: string}>('/admin/repair/estimate', {
		inspct_idx: value,
	});
};
