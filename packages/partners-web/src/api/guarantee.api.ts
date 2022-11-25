import {instance} from '@/api';

import {
	ListRequestParam,
	ListResponse,
	GuaranteeListRequestParam,
	GuaranteeListRequestSearchType,
	GuaranteeListResponse,
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
