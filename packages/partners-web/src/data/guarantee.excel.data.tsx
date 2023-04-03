import {Column} from 'exceljs';
import {format} from 'date-fns';

import {
	PartnershipInfoResponse,
	ExcelField,
	ExcelInput,
	RegisterGuaranteeRequestExcelFormData,
} from '@/@types';
import {CATEGORIES, DATE_FORMAT} from './common.data';
import {
	formatDateString,
	formatPhoneNum,
	isValidWebImage,
	validateRegExp,
} from '@/utils';

export const generateGuaranteeExcelUploadColumns = (
	fields: ExcelField<RegisterGuaranteeRequestExcelFormData>[]
) => {
	const requiredColumns: Array<Partial<Column>> = [];
	const optionalColumns: Array<Partial<Column>> = [];
	const headers: string[] = [];

	fields.forEach((field) => {
		const excelColumn = GUARANTEE_EXCEL_DOWNLOAD_FORMAT[
			field.key as keyof RegisterGuaranteeRequestExcelFormData
		] || {
			key: field.key,
		};
		if (field.required) {
			requiredColumns.push(excelColumn);
		} else {
			optionalColumns.push(excelColumn);
		}
		headers.push(
			GUARANTEE_EXCEL_COLUMN[
				field.key as keyof RegisterGuaranteeRequestExcelFormData
			] || field.key
		);
	});

	return {
		headers,
		requiredColumns,
		optionalColumns,
	};
};

/**
 * 엑셀 컬럼 모음
 */
export const GUARANTEE_EXCEL_COLUMN: {
	[K in keyof RegisterGuaranteeRequestExcelFormData]: string;
} = {
	ordererName: '이름',
	ordererTel: '연락처',
	warrantyDate: '보증기간',
	brandIdx: '브랜드',
	productName: '상품명',
	categoryCode: '카테고리',
	price: '상품금액',
	modelNumber: '모델번호',
	material: '소재',
	size: '사이즈',
	weight: '중량',
	productImage: '상품이미지',
	orderedAt: '주문일자',
	storeName: '판매처',
	refOrderId: '주문번호',
};

/**
 * 엑셀 다운로드 양식 모음
 */
export const GUARANTEE_EXCEL_DOWNLOAD_FORMAT: {
	[K in keyof RegisterGuaranteeRequestExcelFormData]: Partial<Column>;
} = {
	ordererName: {key: 'ordererName', width: 10},
	ordererTel: {key: 'ordererTel', width: 20},
	warrantyDate: {key: 'warrantyDate', width: 30},
	brandIdx: {key: 'brandIdx', width: 15},
	productName: {key: 'productName', width: 20},
	categoryCode: {key: 'categoryCode', width: 10},
	price: {key: 'price', width: 15, style: {numFmt: '0'}},
	modelNumber: {key: 'modelNumber', width: 15},
	material: {key: 'material', width: 15},
	size: {key: 'size', width: 15},
	weight: {key: 'weight', width: 15},
	productImage: {key: 'productImage', width: 50},
	orderedAt: {key: 'orderedAt', width: 12, style: {numFmt: 'yyyy-mm-dd'}},
	storeName: {key: 'storeName', width: 12},
	refOrderId: {key: 'refOrderId', width: 30},
};

/**
 * 엑셀 input 모음
 */
export const GUARANTEE_EXCEL_INPUT: {
	[K in keyof RegisterGuaranteeRequestExcelFormData]: ExcelInput;
} = {
	ordererName: {
		type: 'text',
		name: 'ordererName',
		required: true,
	},
	ordererTel: {
		type: 'text',
		name: 'ordererTel',
		required: true,
		width: 140,
		maxLength: 13,
		parser: (val) => formatPhoneNum(val || ''),
		renderer: formatPhoneNum,
		validator: (val) => validateRegExp(val, 'phone'),
	},
	warrantyDate: {
		type: 'text',
		name: 'warrantyDate',
		required: true,
		width: 260,
	},
	// b2bType brand 외
	brandIdx: {
		type: 'select',
		name: 'brandIdx',
		required: true,
	},
	productName: {
		type: 'text',
		name: 'productName',
		required: true,
		width: 260,
	},
	// b2bType brand 외
	categoryCode: {
		type: 'select',
		name: 'categoryCode',
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
	modelNumber: {
		type: 'text',
		name: 'modelNumber',
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
	productImage: {
		type: 'link',
		name: 'productImage',
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
	orderedAt: {
		type: 'text',
		name: 'orderedAt',
		maxLength: 10,
		parser: (val) => formatDateString(val),
		validator: (val) => (val ? validateRegExp(val, 'date') : true),
	},
	storeName: {type: 'autocomplete', name: 'storeName'},
	refOrderId: {type: 'text', name: 'refOrderId', width: 200},
};

/**
 * 개런티 대량발급에 필요한 필드 조회
 */
export const getGuaranteeExcelField = (
	partnershipData: PartnershipInfoResponse
): ExcelField<RegisterGuaranteeRequestExcelFormData>[] => {
	let fields = [
		{
			required: true,
			key: 'ordererName',
		},
		{
			required: true,
			key: 'ordererTel',
		},
		{
			required: true,
			key: 'warrantyDate',
		},
	];

	const isB2bTypeBrand = partnershipData.b2bType === 'brand';
	if (!isB2bTypeBrand) {
		fields.push({
			required: true,
			key: 'brandIdx',
		});
	}
	fields.push({
		required: true,
		key: 'productName',
	});
	if (!isB2bTypeBrand) {
		fields.push({
			required: true,
			key: 'categoryCode',
		});
	}
	fields.push({
		required: false,
		key: 'price',
	});
	if (partnershipData.useFieldModelNum === 'Y') {
		fields.push({
			required: false,
			key: 'modelNumber',
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
			key: 'productImage',
		});
	}
	fields = [
		...fields,
		{
			required: false,
			key: 'orderedAt',
		},
		{
			required: false,
			key: 'storeName',
		},
		{
			required: false,
			key: 'refOrderId',
		},
	];
	return fields;
};

export const getGuaranteeExcelSampleData = (
	partnershipData: PartnershipInfoResponse
) => {
	return [
		{
			brandName: partnershipData?.brand?.name || '',
			productName: '샘플상품1',
			price: 149000,
			categoryCode: CATEGORIES[partnershipData?.category[0] || 1],
			...(partnershipData.useFieldModelNum === 'Y' && {modelNumber: ''}),
			...(partnershipData.useFieldMaterial === 'Y' && {material: ''}),
			...(partnershipData.useFieldSize === 'Y' && {size: ''}),
			...(partnershipData.useFieldWeight === 'Y' && {weight: ''}),
			...partnershipData.nftCustomFields?.map((field) => ({[field]: ''})),
			...(partnershipData.useNftProdImage === 'Y' && {
				productImage: 'https://www.example.com/sample.jpg',
			}),
			warrantyDate: partnershipData?.warrantyDate || '',
			orderedAt: format(new Date(), DATE_FORMAT),
			storeName: '',
			refOrderId: '',
			ordererName: '홍길동',
			ordererTel: '010-1234-5678',
		},
	];
};
