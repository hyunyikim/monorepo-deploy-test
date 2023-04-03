import {instance} from '@/api';

import {
	GuaranteeDetail,
	BulkResponse,
	ListRequestParam,
	GuaranteeListRequestParam,
	GuaranteeListRequestSearchType,
	ListResponseV2,
	GuaranteeSummary,
} from '@/@types';

export const getGuaranteeList = async (
	params: ListRequestParam<GuaranteeListRequestSearchType> &
		GuaranteeListRequestParam
) => {
	const {
		searchType,
		searchText,
		startDate,
		endDate,
		pageMaxNum,
		currentPage,
		storeIdx,
		...restParams
	} = params;
	return await instance.get<ListResponseV2<GuaranteeSummary[]>>(
		`/v1/admin/nft`,
		{
			params: {
				search: searchType === 'all' ? '' : searchType,
				keyword: searchText,
				from: startDate,
				to: endDate,
				page: currentPage,
				pageSize: pageMaxNum,
				...(storeIdx && {
					storeIdx,
				}),
				...restParams,
			},
		}
	);
};

export const getGuaranteeDetail = async (idx: number) => {
	return await instance.get<GuaranteeDetail>(`/v1/admin/nft/${idx}`);
};

// 개런티 설정
export const setGuaranteeInformation = async (params: FormData) => {
	return await instance.patch('/v1/admin/partnerships', params);
};

// 커스텀 브랜드 카드 수정
export const setCustomizedBrandCard = async (params: FormData) => {
	return await instance.patch(
		'/v1/admin/partnerships/nft-background',
		params
	);
};

// 개런티 발급
export const registerGuarantee = async (formData: FormData) => {
	await instance.post('/v1/admin/nft', formData);
};

// 대량 발급(임시저장 상태의 개런티를 발급)
export const bulkIssueGuarantee = async (nftIdxList: number[]) => {
	return await instance.patch<BulkResponse>(`/v1/admin/nft/complete/bulk`, {
		nftIdxList,
	});
};

// 삭제(임시저장 상태에서 호출)
export const deleteGuarantee = async (idx: number) => {
	await instance.delete(`/v1/admin/nft/${idx}`);
};

export const bulkDeleteGuarantee = async (nftIdxList: number[]) => {
	return await instance.delete<BulkResponse>(`/v1/admin/nft/bulk`, {
		data: {
			nftIdxList,
		},
	});
};

export const bulkCancelGuarantee = async (nftIdxList: number[]) => {
	return await instance.patch<BulkResponse>(`/v1/admin/nft/cancel/bulk`, {
		nftIdxList,
	});
};

// 취소(발급완료 상태에서 호출)
export const cancelGuarantee = async (idx: number) => {
	await instance.patch(`/v1/admin/nft/cancel/${idx}`);
};
