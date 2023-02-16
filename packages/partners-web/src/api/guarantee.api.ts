import {instance} from '@/api';

import {
	ListRequestParam,
	ListResponse,
	GuaranteeListRequestParam,
	GuaranteeListRequestSearchType,
	GuaranteeListResponse,
	GauranteeDetailResponse,
	BulkResponse,
	Platform,
} from '@/@types';

export const getGuaranteeList = async (
	params: ListRequestParam<GuaranteeListRequestSearchType> &
		GuaranteeListRequestParam
) => {
	return await instance.get<ListResponse<GuaranteeListResponse[]>>(
		'/admin/nft',
		{
			params: {
				...params,
				currentPage: params.currentPage - 1,
			},
		}
	);
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

export const getGuaranteeDetail = async (idx: number) => {
	return await instance.get<GauranteeDetailResponse>(`/admin/nft/${idx}`);
};

// 임시저장 및 등록
export const registerGuarantee = async (formData: FormData) => {
	return await instance.post<GuaranteeListResponse>(`/admin/nft`, formData);
};

// 대량 발급
export const bulkRegisterGuarantee = async (nftIdxList: number[]) => {
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

export const deleteGuaranteeImage = async (nft_req_img_idx: number) => {
	await instance.delete('/admin/nft/image', {
		data: {nft_req_img_idx},
	});
};

// 취소(발급완료 상태에서 호출)
export const cancelGuarantee = async (idx: number) => {
	await instance.patch(`/v1/admin/nft/cancel/${idx}`);
};

export const bulkCancelGuarantee = async (nftIdxList: number[]) => {
	return await instance.patch<BulkResponse>(`/v1/admin/nft/cancel/bulk`, {
		nftIdxList,
	});
};

// 판매처 조회
export const getPlatformList = async () => {
	return await instance.get<Platform[]>('/v1/admin/nft/platform');
};
