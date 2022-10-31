import {
	Options,
	ListSearchFilters,
	RepairListRequestSearchType,
} from '@/@types';

import {Chip} from '@/components';

export const repairListSearchTypes: Options<RepairListRequestSearchType> = [
	{label: '전체', value: 'all'},
	{label: '상품명', value: 'pro_nm'},
	{label: '모델번호', value: 'model_num'},
];

export const repairStatusOption: Options<string> = [
	{value: '', label: '전체'},
	{value: '4', label: '수선신청'},
	{value: '5', label: '견적완료'},
	{value: '6', label: '견적승인(수선중)'},
	{value: '7', label: '수선완료'},
	{value: '8', label: '출고완료'},
	{value: '9', label: '배송완료'},
	{value: '20', label: '고객취소'},
	{value: '22', label: '신청취소'},
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
	{
		name: 'inspct_state',
		label: '신청 현황',
		component: 'radioGroup',
		options: repairStatusOption,
	},
];

export const getRepairStatusText = (status: string) => {
	let stateText = '';
	switch (status) {
		case '3':
			stateText = '신청대기';
			break;
		case '4':
			stateText = '신청완료';
			break;
		case '5':
			stateText = '견적완료';
			break;
		case '6':
			stateText = '견적승인(수선중)';
			break;
		case '7':
			stateText = '수선완료';
			break;
		case '8':
			stateText = '출고완료';
			break;
		case '9':
			stateText = '배송완료';
			break;
		case '20':
			stateText = '고객 취소';
			break;
		case '22':
			stateText = '수선 취소';
			break;
		case '23':
			stateText = '취소 후 출고';
			break;
		case '24':
			stateText = '취소 후 배송완료';
			break;
		default:
			break;
	}
	return stateText;
};

export const getRepairStatusChip = (status: string) => {
	let color = 'grey-50';
	let variant = 'filled';
	const text = getRepairStatusText(status);
	switch (status) {
		case '3':
			color = 'primary';
			variant = 'outlined';
			break;
		case '4':
			color = 'primary';
			break;
		case '5':
		case '6':
			color = 'black';
			break;
		case '7':
			color = 'primary';
			break;
		case '8':
		case '9':
			color = 'grey-100';
			variant = 'outlined';
			break;
		case '21':
			// 노랑
			color = 'black';
			return (
				<Chip
					label={text}
					sx={{
						backgroundColor: '#ffe57f',
					}}
				/>
			);
		case '13':
		case '14':
		case '15':
		case '16':
		case '17':
		case '20':
		case '22':
		case '30':
			color = 'red';
			break;
	}
	return (
		<Chip
			label={text}
			color={color}
			sx={{
				yellow: '',
			}}
		/>
	);
};
