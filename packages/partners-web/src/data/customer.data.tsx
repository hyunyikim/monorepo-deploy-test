import {
	Options,
	ListSearchFilters,
	NftCustomerListRequestSearchType,
	WalletLinkType,
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

export const getWalletLinkChip = (value: boolean) => {
	return (
		<Chip
			label={value ? '연동완료' : '미연동'}
			color={value ? 'primary-50' : 'grey-100'}
		/>
	);
};
