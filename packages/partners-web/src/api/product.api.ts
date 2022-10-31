import {instance} from '@/api';

import {
	ListRequestParam,
	ListResponse,
	ProductListRequestSearchType,
	ProductListRequestParam,
	ProductListResponse,
} from '@/@types';

export const getProductList = async (
	params: ListRequestParam<ProductListRequestSearchType> &
		ProductListRequestParam
) => {
	const {
		currentPage,
		pageMaxNum,
		startDate,
		endDate,
		searchType,
		searchText,
		...otherPararms
	} = params;
	return await instance.get<ListResponse<ProductListResponse[]>>(
		'/v1/admin/partners-product',
		{
			params: {
				...otherPararms,
				page: currentPage,
				pageSize: pageMaxNum,
				from: startDate,
				to: endDate,
				search: searchType,
				keyword: searchText,
			},
		}
	);
};
