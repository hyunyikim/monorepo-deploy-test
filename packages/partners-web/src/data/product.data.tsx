import {
	Options,
	ListSearchFilters,
	ProductListRequestSearchType,
} from '@/@types';

export const productListSearchTypes: Options<ProductListRequestSearchType> = [
	{value: 'all', label: '전체'},
	{value: 'name', label: '상품명'},
	{value: 'code', label: '상품코드'},
	{value: 'num', label: 'No.'},
];

export const productCategoryOptions: Options<number | ''> = [
	{value: '', label: '전체'},
	{value: 1, label: '가방'},
	{value: 2, label: '지갑'},
	{value: 3, label: '시계'},
	{value: 4, label: '의류'},
	{value: 5, label: '신발'},
	{value: 6, label: '액세서리'},
	// {value: 7, label: '잡화'},
];

export const productListSearchFilter: ListSearchFilters = [
	{
		name: ['searchType', 'searchText'],
		label: '검색어',
		component: 'searchField',
		options: productListSearchTypes,
	},
	{
		name: 'searchDate',
		label: '기간',
		component: 'searchDate',
	},
	{
		name: 'categoryCode',
		label: '카테고리',
		component: 'select',
		options: productCategoryOptions,
	},
];
