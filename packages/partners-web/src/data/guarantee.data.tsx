import {Chip} from '@/components';

import {
	Options,
	ListSearchFilters,
	GuaranteeListRequestSearchType,
} from '@/@types';

export const guaranteeListSearchTypes: Options<GuaranteeListRequestSearchType> =
	[
		{label: '전체', value: 'all'},
		{label: '신청번호', value: 'nft_req_num'},
	];

export const guaranteeRequestStates: Options<string> = [
	{value: '', label: '전체'},
	{value: '1', label: '신청대기'},
	{value: '2,3,4', label: '발급완료'},
	{value: '9', label: '발급취소'},
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
