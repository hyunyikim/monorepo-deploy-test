import {Column} from 'exceljs';
import {format} from 'date-fns';

import {Chip} from '@/components';

import {
	Options,
	ListSearchFilters,
	GuaranteeListRequestSearchType,
	GuaranteeRequestState,
	InputTypeList,
	PartnershipInfoResponse,
	GuaranteeExcelUploadFormData,
	ExcelField,
	ExcelInput,
} from '@/@types';
import {CATEGORIES, DATE_FORMAT} from './common.data';
import {
	formatDateString,
	formatPhoneNum,
	isValidWebImage,
	linkFormChecker,
	validateRegExp,
} from '@/utils';

export const guaranteeListSearchTypes: Options<GuaranteeListRequestSearchType> =
	[
		{label: '전체', value: 'all'},
		{label: '신청번호', value: 'nft_req_num'},
		{label: '상품명', value: 'pro_nm'},
		{label: '이름', value: 'ordererName'},
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
	{value: '1,2', label: '신청대기'},
	{value: '3,4', label: '발급완료'},
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
		name: 'platform',
		label: '판매처',
		component: 'select',
		options: [],
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
		type: 'autocomplete',
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

export const generateGuaranteeExcelUploadColumns = (
	fields: ExcelField<GuaranteeExcelUploadFormData>[]
) => {
	const requiredColumns: Array<Partial<Column>> = [];
	const optionalColumns: Array<Partial<Column>> = [];
	const headers: string[] = [];

	fields.forEach((field) => {
		const excelColumn = GUARANTEE_EXCEL_DOWNLOAD_FORMAT[field.key] || {
			key: field.key,
		};
		if (field.required) {
			requiredColumns.push(excelColumn);
		} else {
			optionalColumns.push(excelColumn);
		}
		headers.push(
			GUARANTEE_EXCEL_COLUMN[field.key] || (field.key as string)
		);
	});

	return {
		headers,
		requiredColumns,
		optionalColumns,
	};
};

export const generateGuaranteeInputs = (
	fields: ExcelField<GuaranteeExcelUploadFormData>[]
) => {
	return fields
		.map((field) => GUARANTEE_EXCEL_INPUT[field.key])
		.filter((item) => !!item);
};

/**
 * 엑셀 컬럼 모음
 */
export const GUARANTEE_EXCEL_COLUMN: {
	[K in keyof GuaranteeExcelUploadFormData]: string;
} = {
	orderer_nm: '이름',
	orderer_tel: '연락처',
	warranty_dt: '보증기간',
	brand_idx: '브랜드',
	pro_nm: '상품명',
	cate_cd: '카테고리',
	price: '상품금액',
	model_num: '모델번호',
	material: '소재',
	size: '사이즈',
	weight: '중량',
	pro_img_url: '상품이미지',
	order_dt: '주문일자',
	platform_nm: '판매처',
	ref_order_id: '주문번호',
};

/**
 * 엑셀 다운로드 양식 모음
 */
export const GUARANTEE_EXCEL_DOWNLOAD_FORMAT: {
	[K in keyof GuaranteeExcelUploadFormData]: Partial<Column>;
} = {
	orderer_nm: {key: 'orderer_nm', width: 10},
	orderer_tel: {key: 'orderer_tel', width: 20},
	warranty_dt: {key: 'warranty_dt', width: 30},
	brand_idx: {key: 'brand_idx', width: 15},
	pro_nm: {key: 'pro_nm', width: 20},
	cate_cd: {key: 'cate_cd', width: 10},
	price: {key: 'price', width: 15, style: {numFmt: '0'}},
	model_num: {key: 'model_num', width: 15},
	material: {key: 'material', width: 15},
	size: {key: 'size', width: 15},
	weight: {key: 'weight', width: 15},
	pro_img_url: {key: 'pro_img_url', width: 50},
	order_dt: {key: 'order_dt', width: 12, style: {numFmt: 'yyyy-mm-dd'}},
	platform_nm: {key: 'platform_nm', width: 12},
	ref_order_id: {key: 'ref_order_id', width: 30},
};

/**
 * 엑셀 input 모음
 */
export const GUARANTEE_EXCEL_INPUT: {
	[K in keyof GuaranteeExcelUploadFormData]: ExcelInput;
} = {
	orderer_nm: {
		type: 'text',
		name: 'orderer_nm',
		required: true,
	},
	orderer_tel: {
		type: 'text',
		name: 'orderer_tel',
		required: true,
		width: 140,
		maxLength: 13,
		parser: (val) => formatPhoneNum(val || ''),
		renderer: formatPhoneNum,
		validator: (val) => validateRegExp(val, 'phone'),
	},
	warranty_dt: {
		type: 'text',
		name: 'warranty_dt',
		required: true,
		width: 260,
	},
	// b2bType brand 외
	brand_idx: {
		type: 'select',
		name: 'brand_idx',
		required: true,
	},
	pro_nm: {
		type: 'text',
		name: 'pro_nm',
		required: true,
		width: 260,
	},
	// b2bType brand 외
	cate_cd: {
		type: 'select',
		name: 'cate_cd',
		required: true,
	},
	price: {
		type: 'text',
		name: 'price',
		required: false,
		width: 150,
		parser: (val) => Number((val || '').toString().replace(/[^0-9]/g, '')),
		renderer: (val) => Number(val || 0).toLocaleString(),
		validator: (val) =>
			!isNaN(Number((val || '').toString().replace(/,/g, ''))) &&
			Number((val || '').toString().replace(/,/g, '')) >= 0,
	},
	model_num: {
		type: 'text',
		name: 'model_num',
	},
	material: {
		type: 'text',
		name: 'material',
	},
	size: {
		type: 'text',
		name: 'size',
	},
	weight: {
		type: 'text',
		name: 'weight',
	},
	pro_img_url: {
		type: 'link',
		name: 'pro_img_url',
		validator: async (val) => {
			let isValid = true;
			if (val) {
				isValid = validateRegExp(val, 'url');
				if (isValid) {
					isValid = await isValidWebImage(val);
				}
			}
			return isValid;
		},
	},
	order_dt: {
		type: 'text',
		name: 'order_dt',
		maxLength: 10,
		parser: (val) => formatDateString(val),
		validator: (val) => (val ? validateRegExp(val, 'date') : true),
	},
	platform_nm: {type: 'autocomplete', name: 'platform_nm'},
	ref_order_id: {type: 'text', name: 'ref_order_id', width: 200},
};

/**
 * 개런티 대량발급에 필요한 필드 조회
 */
export const getGuaranteeExcelField = (
	partnershipData: PartnershipInfoResponse
): ExcelField<GuaranteeExcelUploadFormData>[] => {
	let fields = [
		{
			required: true,
			key: 'orderer_nm',
		},
		{
			required: true,
			key: 'orderer_tel',
		},
		{
			required: true,
			key: 'warranty_dt',
		},
	];

	const isB2bTypeBrand = partnershipData.b2bType === 'brand';
	if (!isB2bTypeBrand) {
		fields.push({
			required: true,
			key: 'brand_idx',
		});
	}
	fields.push({
		required: true,
		key: 'pro_nm',
	});
	if (!isB2bTypeBrand) {
		fields.push({
			required: true,
			key: 'cate_cd',
		});
	}
	fields.push({
		required: false,
		key: 'price',
	});
	if (partnershipData.useFieldModelNum === 'Y') {
		fields.push({
			required: false,
			key: 'model_num',
		});
	}
	if (partnershipData.useFieldMaterial === 'Y') {
		fields.push({
			required: false,
			key: 'material',
		});
	}
	if (partnershipData.useFieldSize === 'Y') {
		fields.push({
			required: false,
			key: 'size',
		});
	}
	if (partnershipData.useFieldWeight === 'Y') {
		fields.push({
			required: false,
			key: 'weight',
		});
	}
	if (partnershipData?.nftCustomFields?.length > 0) {
		const customFields = partnershipData?.nftCustomFields.map((item) => ({
			required: false,
			key: item,
		}));
		fields.push(...customFields);
	}
	if (partnershipData.useNftProdImage === 'Y') {
		fields.push({
			required: false,
			key: 'pro_img_url',
		});
	}
	fields = [
		...fields,
		{
			required: false,
			key: 'order_dt',
		},
		{
			required: false,
			key: 'platform_nm',
		},
		{
			required: false,
			key: 'ref_order_id',
		},
	];
	return fields;
};

export const getGuaranteeExcelSampleData = (
	partnershipData: PartnershipInfoResponse
) => {
	return [
		{
			brand_idx: partnershipData?.brand?.name || '',
			pro_nm: '샘플상품1',
			price: 149000,
			cate_cd: CATEGORIES[partnershipData?.category[0] || 1],
			...(partnershipData.useFieldModelNum === 'Y' && {model_num: ''}),
			...(partnershipData.useFieldMaterial === 'Y' && {material: ''}),
			...(partnershipData.useFieldSize === 'Y' && {size: ''}),
			...(partnershipData.useFieldWeight === 'Y' && {weight: ''}),
			...partnershipData.nftCustomFields?.map((field) => ({[field]: ''})),
			...(partnershipData.useNftProdImage === 'Y' && {
				pro_img_url: 'https://www.example.com/sample.jpg',
			}),
			warranty_dt: partnershipData?.warrantyDate || '',
			order_dt: format(new Date(), DATE_FORMAT),
			platform_nm: '',
			ref_order_id: '',
			orderer_nm: '홍길동',
			orderer_tel: '010-1234-5678',
		},
	];
};
