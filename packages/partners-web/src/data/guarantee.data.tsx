import {Chip} from '@/components';

import {
	Options,
	ListSearchFilters,
	GuaranteeListRequestSearchType,
	GuaranteeStatus,
	NftCustomerGuaranteeStatus,
} from '@/@types';

export const guaranteeListSearchTypes: Options<GuaranteeListRequestSearchType> =
	[
		{label: '전체', value: 'all'},
		{label: '신청번호', value: 'nft_req_num'},
	];

export const guaranteeRequestStates: Options<string> = [
	{value: '', label: '발급상태: 전체'},
	{value: '1', label: '신청대기'},
	{value: '2,3,4', label: '발급완료'},
	{value: '9', label: '발급취소'},
];

export const groupingGuaranteeRequestStates: Options<NftCustomerGuaranteeStatus> =
	[
		{value: 'ALL', label: '전체'},
		{value: 'READY', label: '신청대기'},
		{value: 'COMPLETE', label: '발급완료'},
		{value: 'CANCELED', label: '발급취소'},
	];

export const guaranteeListSearchFilter: ListSearchFilters = [
	{
		name: ['searchType', 'searchText'],
		label: '검색어',
		component: 'searchField',
		options: guaranteeListSearchTypes,
	},
	{
		name: 'searchDate',
		label: '기간',
		component: 'searchDate',
	},
	{
		name: 'nft_req_state',
		label: '개런티 상태',
		component: 'radioGroup',
		options: guaranteeRequestStates,
	},
];

export const getGuaranteeStatusChip = (status: string, text: string) => {
	let color = 'grey-50';
	switch (status) {
		case '1':
			break;
		case '2':
		case '3':
		case '4':
			color = 'green';
			break;
		case '9':
			color = 'red';
			break;
	}
	return <Chip label={text} color={color} />;
};

/**
 * 'READY' | 'COMPLETE' | 'CANCELED'로 묶여 전달되는 개런티 발급 상태에 대한 칩
 */
export const getGroupingGuaranteeStatusChip = (status: GuaranteeStatus) => {
	let color = 'grey-50';
	let text = '신청대기';

	switch (status) {
		case 'READY':
			break;
		case 'COMPLETE':
			color = 'green';
			text = '발급완료';
			break;
		case 'CANCELED':
			color = 'red';
			text = '발급취소';
			break;
	}
	return <Chip label={text} color={color} />;
};
