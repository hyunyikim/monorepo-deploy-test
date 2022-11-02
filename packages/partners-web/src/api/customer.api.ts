import {format, parse, addDays} from 'date-fns';

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
import {DATE_FORMAT, defaultStartDate} from '@/data';

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

	const addEndDate = format(
		addDays(parse(endDate, DATE_FORMAT, new Date()), 1),
		DATE_FORMAT
	);
	return await instance.get<NftCustomerListResponse>('/v1/admin/customers', {
		params: {
			page: currentPage,
			size: pageMaxNum,
			startAt: startDate || defaultStartDate,
			endAt: addEndDate,
			searchTarget: searchType,
			searchKeyword: searchText,
			...otherPararms,
		},
	});
};

export const getNftCustomerDetail = async (name: string, phone: string) => {
	return await instance.get<NftCustomerDetail>(
		`/v1/admin/customers/${name}/${phone}`
	);
};

export const getNftCustomerGuaranteeList = async (
	params: ListRequestParam & NftCustomerGuaranteeRequestParam,
	name: string,
	phone: string
) => {
	const {currentPage, pageMaxNum, ...otherPararms} = params;
	return await instance.get<NftCustomerGuaranteeListResponse>(
		`/v1/admin/customers/${name}/${phone}/guarantees`,
		{
			params: {
				page: currentPage,
				size: pageMaxNum,
				...otherPararms,
			},
		}
	);
};
