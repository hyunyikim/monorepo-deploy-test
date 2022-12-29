import {instance} from '@/api';

import {
	ListRequestParam,
	RepairListRequestSearchType,
	RepairListRequestParam,
	ListResponseV2,
	RepairSummary,
	RepairDetail,
} from '@/@types';

export const getRepairList = async (
	params: ListRequestParam<RepairListRequestSearchType> &
		RepairListRequestParam
) => {
	const {
		searchType,
		searchText,
		startDate,
		endDate,
		currentPage,
		pageMaxNum,
		...rest
	} = params;
	return await instance.get<ListResponseV2<RepairSummary[]>>(
		'/v1/admin/repair',
		{
			params: {
				search: searchType === 'all' ? '' : searchType,
				keyword: searchText,
				from: startDate,
				to: endDate,
				page: currentPage,
				pageSize: pageMaxNum,
				...rest,
			},
		}
	);
};

export const getRepairDetail = async (idx: number) => {
	return await instance.get<RepairDetail>(`/v1/admin/repair/${idx}`);
};

export const completeRepair = async (idx: number) => {
	return await instance.patch(`/v1/admin/repair/complete/${idx}`);
};

export const bulkCompleteRepair = async (repairIdxList: number[]) => {
	return await instance.patch(`/v1/admin/repair/complete/bulk`, {
		repairIdxList,
	});
};

export const cancelRepair = async (idx: number) => {
	return await instance.patch(`/v1/admin/repair/cancel/${idx}`);
};

export const bulkCancelRepair = async (repairIdxList: number[]) => {
	return await instance.patch(`/v1/admin/repair/cancel/bulk`, {
		repairIdxList,
	});
};
