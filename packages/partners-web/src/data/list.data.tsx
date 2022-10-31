import {subWeeks, subMonths, addDays, format} from 'date-fns';

import {
	Options,
	Option,
	PeriodType,
	ListRequestParam,
	SortType,
} from '@/@types';
import {DATE_FORMAT} from './common.data';

export const listSearchFilter = [
	{
		sort: 'sort',
	},
	{
		page: 'page',
	},
	{
		pageMaxNum: 'pageMaxNum',
	},
];

export const periods: (Option<number> & {
	type: PeriodType;
})[] = [
	{
		label: '오늘',
		type: 'today',
		value: 0,
	},
	{
		label: '7일',
		type: 'week',
		value: 1,
	},
	{
		label: '14일',
		type: 'week',
		value: 2,
	},
	{
		label: '1개월',
		type: 'month',
		value: 1,
	},
	{
		label: '3개월',
		type: 'month',
		value: 3,
	},
	{
		label: '6개월',
		type: 'month',
		value: 6,
	},
	{
		label: '전체',
		type: 'all',
		value: 100,
	},
];

export const calculatePeriod = (
	type: PeriodType,
	value: number
): [string, string] => {
	const today = new Date();
	let res = [today, today];
	switch (type) {
		case 'week':
			res = [addDays(subWeeks(today, value), 1), today];
			break;
		case 'month':
			res = [addDays(subMonths(today, value), 1), today];
			break;
		case 'all':
			return ['', format(today, DATE_FORMAT)];
	}
	return [format(res[0], DATE_FORMAT), format(res[1], DATE_FORMAT)];
};

export const defaultPeriodIdx = 2;
export const defaultPeriod = calculatePeriod(
	periods[defaultPeriodIdx].type,
	periods[defaultPeriodIdx].value
);

export const defaultStartDate = '1900-01-01';

export const pageSizeSearchFilter: Options<number> = [
	{value: 10, label: '10개씩 보기'},
	{value: 25, label: '25개씩 보기'},
	{value: 50, label: '50개씩 보기'},
	{value: 100, label: '100개씩 보기'},
];

const defaultPageSizeSearchFilterIdx = 1;
export const defaultPageSize =
	pageSizeSearchFilter[defaultPageSizeSearchFilterIdx].value;

export const initialSearchFilter: ListRequestParam<any> = {
	searchType: 'all',
	searchText: '',
	startDate: defaultPeriod[0],
	endDate: defaultPeriod[1],
	sort: 'latest',
	currentPage: 1, // 화면에 표기되는 page 기준
	pageMaxNum: defaultPageSize,
};

export const sortSearchFilter: Options<SortType> = [
	{value: 'latest', label: '최신순'},
	{value: 'oldest', label: '오래된순'},
];
