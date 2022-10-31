import {
	Options,
	ListSearchFilters,
	InspectionListRequestSearchType,
} from '@/@types';

import {Chip} from '@/components';

export const inspectionListSearchTypes: Options<InspectionListRequestSearchType> =
	[
		{label: '전체', value: 'all'},
		{label: '상품명', value: 'pro_nm'},
		{label: '모델번호', value: 'model_num'},
	];

export const inspectionStatusOption: Options<string> = [
	{value: '', label: '전체'},
	{value: '2', label: '접수'},
	{value: '3', label: '감정승인 완료'},
	{value: '4', label: '입고완료'},
	{value: '5', label: '감정사 배정'},
	{value: '6', label: '1차 감정완료'},
	{value: '7', label: '최종 감정완료'},
	{value: '9', label: '배송완료'},
	{value: '19', label: '감정 불가'},
	{value: '20', label: '고객 취소'},
	{value: '22', label: '신청 취소'},
];

export const inspectionListSearchFilter: ListSearchFilters = [
	{
		name: ['searchType', 'searchText'],
		label: '검색어',
		component: 'searchField',
		options: inspectionListSearchTypes,
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
		options: inspectionStatusOption,
	},
];

export const getInspectionStatusText = (status: string) => {
	let stateText = '';
	switch (status) {
		case '2':
			stateText = '신청대기';
			break;
		case '3':
			stateText = '신청완료';
			break;
		case '4':
			stateText = '입고완료';
			break;
		case '5':
			stateText = '감정중';
			break;
		case '6':
			stateText = '1차감정완료';
			break;
		case '7':
			stateText = '최종감정완료';
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
			stateText = '감정 취소';
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

export const getInspectionStatusChip = (status: string) => {
	let color = 'grey-50';
	let variant = 'filled';
	const text = getInspectionStatusText(status);
	switch (status) {
		case '2':
			color = 'primary';
			variant = 'outlined';
			break;
		case '3':
		case '4':
			color = 'green';
			break;
		case '5':
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
