import {
	Options,
	ListSearchFilters,
	NftCustomerListRequestSearchType,
	WalletLinkType,
	NftCustomerGuaranteeStatus,
	GuaranteeStatus,
} from '@/@types';

import {Chip} from '@/components';

export const nftCustomerListSearchTypes: Options<NftCustomerListRequestSearchType> =
	[
		{label: '전체', value: 'all'},
		{label: '이름', value: 'name'},
		{label: '전화번호', value: 'phone'},
	];

export const walletLinkOption: Options<WalletLinkType> = [
	{value: 'ALL', label: '전체'},
	{value: 'LINKED', label: '연동완료'},
	{value: 'NONE', label: '미연동'},
];

export const nftCustomerListSearchFilter: ListSearchFilters = [
	{
		name: ['searchType', 'searchText'],
		label: '검색어',
		component: 'searchField',
		options: nftCustomerListSearchTypes,
	},
	{
		name: 'searchDate',
		label: '개런티 발급 기간',
		component: 'searchDate',
	},
	{
		name: 'wallet',
		label: '지갑 연동 상태',
		component: 'radioGroup',
		options: walletLinkOption,
	},
];

export const groupingCustomerGuaranteeRequestStates: Options<NftCustomerGuaranteeStatus> =
	[
		{value: 'ALL', label: '전체'},
		{value: 'READY', label: '신청대기'},
		{value: 'CONFIRMED,COMPLETED', label: '발급완료'},
		{value: 'CANCELED', label: '발급취소'},
	];

export const getWalletLinkChip = (value: boolean) => {
	return (
		<Chip
			label={value ? '연동완료' : '미연동'}
			color={value ? 'primary-50' : 'grey-100'}
		/>
	);
};

/**
 * 'READY' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED'로 묶여 전달되는 개런티 발급 상태에 대한 칩
 */
export const getGroupingGuaranteeStatusChip = (status: GuaranteeStatus) => {
	let color = 'grey-50';
	let text = '신청대기';

	switch (status) {
		case 'READY':
			break;
		case 'CONFIRMED':
		case 'COMPLETED':
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
