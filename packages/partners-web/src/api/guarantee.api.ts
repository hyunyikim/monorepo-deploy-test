import {instance} from '@/api';

import {
	ListRequestParam,
	ListResponse,
	GuaranteeListRequestParam,
	GuaranteeListRequestSearchType,
	GuaranteeListResponse,
	GauranteeDetailResponse,
	GuaranteeExcelUploadFormData,
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

export const getGuaranteeDetail = async (idx: number) => {
	return await instance.get<GauranteeDetailResponse>(`/admin/nft/${idx}`);
};

// 임시저장 및 등록
export const registerGuarantee = async (formData: FormData) => {
	return await instance.post<GuaranteeListResponse>(`/admin/nft`, formData);
};

export const deleteGuaranteeImage = async (nft_req_img_idx: number) => {
	await instance.delete('/admin/nft/image', {
		data: {nft_req_img_idx},
	});
};

// 대량발급(old)
export const registerBulkGuarantee = async (
	data: GuaranteeExcelUploadFormData[]
) => {
	await instance.post(`/admin/nft/bulk`, data);
};
