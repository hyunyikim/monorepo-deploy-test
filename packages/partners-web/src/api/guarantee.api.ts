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
