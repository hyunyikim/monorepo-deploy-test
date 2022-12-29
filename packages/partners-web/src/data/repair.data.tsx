import {
	Options,
	ListSearchFilters,
	RepairListRequestSearchType,
	RepairStatus,
	ColorType,
} from '@/@types';

import {Chip} from '@/components';

export const repairListSearchTypes: Options<RepairListRequestSearchType> = [
	{label: '전체', value: 'all'},
	{label: '신청번호', value: 'repairNum'},
	{label: '이름', value: 'userName'},
	{label: '연락처', value: 'userPhone'},
	{label: '상품명', value: 'productName'},
];

export const repairStatusOption: Options<RepairStatus | ''> = [
	{value: '', label: '전체'},
	{value: 'ready', label: '대기'},
	{value: 'request', label: '접수'},
	{value: 'complete', label: '수선완료'},
	{value: 'cancel', label: '신청취소'},
];

export const repairListSearchFilter: ListSearchFilters = [
	{
		name: ['searchType', 'searchText'],
		label: '검색어',
		component: 'searchField',
		options: repairListSearchTypes,
	},
	{
		name: 'searchDate',
		label: '기간',
		component: 'searchDate',
	},
];

export const getRepairStatusLabel = (code: RepairStatus) => {
	return repairStatusOption.find((item) => item.value === code)?.label || '';
};

export const getRepairStatusChip = (status: RepairStatus) => {
	let color: ColorType = 'grey-50';
	switch (status) {
		case 'ready':
			color = 'grey-50';
			break;
		case 'request':
			color = 'grey-50';
			break;
		case 'complete':
			color = 'green';
			break;
		case 'cancel':
			color = 'red';
			break;
	}
	const label = getRepairStatusLabel(status);
	return <Chip label={label} color={color} />;
};
