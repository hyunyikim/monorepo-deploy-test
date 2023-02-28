import {instance} from '@/api';

import {
	ListRequestParam,
	ListResponse,
	ProductListRequestSearchType,
	ProductListResponse,
	ProductDetailResponse,
	ProductGuarantee,
	ListResponseV2,
	ProductGuaranteeRequestParam,
	ProductExcelUploadRequestData,
} from '@/@types';

export const getProductList = async (
	params: ListRequestParam<ProductListRequestSearchType>
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

export const bulkRegisterProduct = async (
	data: ProductExcelUploadRequestData[]
) => {
	await instance.post(`/v1/admin/partners-product/bulk`, {
		productList: data,
	});
};

export const editProduct = async (idx: number, formData: FormData) => {
	return await instance.patch(`/v1/admin/partners-product/${idx}`, formData);
};

export const deleteProduct = async (idx: number) => {
	await instance.delete(`/v1/admin/partners-product/${idx}`);
};

export const bulkDeleteProduct = async (productIdxList: number[]) => {
	await instance.delete(`/v1/admin/partners-product/bulk`, {
		data: {
			productIdxList,
		},
	});
};

export const deleteProductImage = async (productIdx: number) => {
	await instance.delete(`/v1/admin/partners-product/${productIdx}/image`);
};

export const getProductGuaranteeList = async (
	params: ProductGuaranteeRequestParam,
	productIdx: number
) => {
	const {nftStatus, sort, pageMaxNum, currentPage} = params;
	return await instance.get<ListResponseV2<ProductGuarantee[]>>(
		`/v1/admin/partners-product/${productIdx}/nft`,
		{
			params: {
				...(nftStatus && {
					nftStatus,
				}),
				sort,
				pageSize: pageMaxNum,
				page: currentPage,
			},
		}
	);
};
