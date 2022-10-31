import {Options} from '@/@types';

export type SortType = 'latest' | 'oldest';

export type PeriodType = 'today' | 'week' | 'week' | 'month' | 'all';

export type OrderDirectionType = 'ASC' | 'DESC';
export interface ListRequestParam<T = any> {
	searchType: T;
	searchText: string;
	startDate: string;
	endDate: string;
	sort?: SortType;
	currentPage: number;
	pageMaxNum: number;
}

export type SearchFilterComponent =
	| 'searchField'
	| 'searchDate'
	| 'radioGroup'
	| 'checkbox'
	| 'select';

export interface ListSearchFilter {
	name: string | string[];
	label: string;
	component: SearchFilterComponent;
	options?: Options;
}

export type ListSearchFilters = ListSearchFilter[];

export interface ListResponse<T> {
	result: 'SUCCESS';
	message: 'SUCCESS';
	data: T;
	total: number;
}
