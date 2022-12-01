import {instance} from '@/api';

import {
	ListRequestParam,
	ListResponse,
	GuaranteeListRequestParam,
	GuaranteeListRequestSearchType,
	GuaranteeListResponse,
	GauranteeDetailResponse,
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

export const deleteGuarantee = async (idx: number) => {
	await instance.delete(`/admin/nft/${idx}`);
};

export const deleteGuaranteeImage = async (nft_req_img_idx: number) => {
	await instance.delete('/admin/nft/image', {
		data: {nft_req_img_idx},
	});
};
