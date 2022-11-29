import {Chip} from '@/components';

import {
	Options,
	ListSearchFilters,
	GuaranteeListRequestSearchType,
	GuaranteeRequestState,
	InputTypeList,
} from '@/@types';

export const guaranteeListSearchTypes: Options<GuaranteeListRequestSearchType> =
	[
		{label: '전체', value: 'all'},
		{label: '신청번호', value: 'nft_req_num'},
	];

export const guaranteeRequestStates: Options<GuaranteeRequestState> = [
	{value: '1', label: '신청대기'},
	{value: '2', label: '발급신청'},
	{value: '3', label: '승인완료'},
	{value: '4', label: '발급완료'},
	{value: '9', label: '발급취소'},
];

// 목록 조회를 위한 옵션, 발급신청/승인완료/발급완료 상태를 발급완료 상태 하나로 묶어놓음
export const groupingGuaranteeRequestStates: Options<string> = [
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
		options: groupingGuaranteeRequestStates,
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

export const guaranteeRegisterInputList: InputTypeList = [
	{
		type: 'hidden',
		name: 'nft_req_state',
		required: true,
	},
	{
		type: 'text',
		name: 'orderer_nm',
		placeholder: '고객의 실명을 정확히 입력해주세요',
		label: '이름',
		autoComplete: 'off',
		required: true,
	},
	{
		type: 'text',
		name: 'orderer_tel',
		placeholder: '010-0000-0000',
		label: '연락처',
		autoComplete: 'off',
		required: true,
		inputProps: {
			maxLength: 13,
		},
	},
	{
		type: 'text',
		name: 'order_dt',
		placeholder: 'YYYY-MM-DD',
		label: '주문일자',
		required: false,
		inputProps: {
			maxLength: 10,
		},
	},
	{
		type: 'text',
		name: 'platform_nm',
		placeholder: '판매처를 입력해주세요',
		label: '판매처',
		required: false,
	},
	{
		type: 'text',
		name: 'ref_order_id',
		placeholder: '주문번호를 입력해주세요',
		label: '주문번호',
		required: false,
	},
];
