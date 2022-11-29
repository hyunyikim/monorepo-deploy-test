import {instance} from '@/api';

import {
	ListRequestParam,
	ListResponse,
	ProductListRequestSearchType,
	ProductListRequestParam,
	ProductListResponse,
	ProductDetailResponse,
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

export const getProductDetail = async (idx: number) => {
	return await instance.get<ProductDetailResponse>(
		`/v1/admin/partners-product/${idx}`
	);
};

export const registerProduct = async (formData: FormData) => {
	return await instance.post<ProductDetailResponse>(
		`/v1/admin/partners-product`,
		formData
	);
};

export const editProduct = async (idx: number, formData: FormData) => {
	return await instance.patch(`/v1/admin/partners-product/${idx}`, formData);
};

export const deleteProduct = async (idx: number) => {
	await instance.delete(`/v1/admin/partners-product/${idx}`);
};
