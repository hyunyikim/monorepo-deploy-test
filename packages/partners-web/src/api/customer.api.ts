import {instance} from '@/api';

import {
	ListRequestParam,
	NftCustomerListRequestSearchType,
	NftCustomerListRequestParam,
	NftCustomerListResponse,
	NftCustomerGuaranteeRequestParam,
	NftCustomerGuaranteeListResponse,
	NftCustomerDetail,
} from '@/@types';
import {defaultStartDate} from '@/data';

export const getNftCustomerList = async (
	params: ListRequestParam<NftCustomerListRequestSearchType> &
		NftCustomerListRequestParam
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
	return await instance.get<NftCustomerListResponse>('/v1/admin/customers', {
		params: {
			page: currentPage,
			size: pageMaxNum,
			startAt: startDate || defaultStartDate,
			endAt: endDate,
			searchTarget: searchType,
			searchKeyword: searchText,
			...otherPararms,
		},
	});
};

export const getNftCustomerDetail = async (idx: number) => {
	return await instance.get<NftCustomerDetail>(`/v1/admin/customers/${idx}`);
};

export const getNftCustomerGuaranteeList = async (
	params: ListRequestParam & NftCustomerGuaranteeRequestParam,
	idx: number
) => {
	const {currentPage, pageMaxNum, ...otherPararms} = params;
	return await instance.get<NftCustomerGuaranteeListResponse>(
		`/v1/admin/customers/${idx}/guarantees`,
		{
			params: {
				page: currentPage,
				size: pageMaxNum,
				...otherPararms,
			},
		}
	);
};
