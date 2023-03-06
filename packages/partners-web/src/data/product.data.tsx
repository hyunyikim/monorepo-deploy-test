import {Column} from 'exceljs';

import {
	Options,
	ListSearchFilters,
	ProductListRequestSearchType,
	PartnershipInfoResponse,
	InputTypeList,
	ImageState,
	ProductDetailResponse,
	ProductRegisterFormData,
	CustomField,
	InputType,
	ProductGuaranteeStatus,
	ProductExcelUploadInput,
	ExcelInput,
	ExcelField,
} from '@/@types';
import {isValidWebImage, linkFormChecker, validateRegExp} from '@/utils';
import {CATEGORIES} from './common.data';

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
	{value: 7, label: '잡화'},
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
];

// 개런티 발급 페이지의 상품 목록 조회
export const guaranteeRegisterProductListSearchFilter: ListSearchFilters = [
	{
		name: ['searchType', 'searchText'],
		label: '검색어',
		component: 'searchField',
		options: productListSearchTypes,
	},
];

export const productGuaranteeStatus: Options<ProductGuaranteeStatus | ''> = [
	{label: '발급상태:전체', value: ''},
	{label: '신청대기', value: 'ready'},
	{label: '발급완료', value: 'complete'},
	{label: '발급취소', value: 'cancel'},
];

const productRegisterProductCodeInput: InputType = {
	type: 'text',
	name: 'code',
	placeholder: '상품코드를 입력해주세요',
	label: '상품코드',
	autoComplete: 'off',
	required: false,
};

export const productRegisterInputList: InputTypeList = [
	{
		type: 'text',
		name: 'name',
		placeholder: '상품명을 입력해주세요',
		label: '상품명',
		autoComplete: 'off',
		required: true,
	},
	{
		type: 'text',
		name: 'warranty',
		placeholder: '',
		label: '보증기간',
		autoComplete: 'off',
		required: true,
		multiline: true,
	},
	{
		type: 'text',
		name: 'price',
		placeholder: '상품금액을 입력해주세요',
		label: '상품금액',
		autoComplete: 'off',
		required: false,
	},
];

export const productRegisterInputListForCooperator: InputTypeList = [
	{
		type: 'select',
		name: 'categoryCode',
		placeholder: '카테고리를 선택해주세요',
		label: '카테고리',
		required: false,
	},
	{
		type: 'hidden',
		name: 'categoryName',
	},
	productRegisterProductCodeInput,
];

export const getUseYNFields = (
	partnershipInfo?: PartnershipInfoResponse | null
) => {
	const fields: InputTypeList = [];
	if (partnershipInfo?.useFieldModelNum === 'Y') {
		fields.push({
			type: 'text',
			name: 'modelNum',
			placeholder: '모델번호를 입력해주세요',
			label: '모델번호',
			autoComplete: 'off',
			required: false,
		});
	}
	if (partnershipInfo?.useFieldMaterial === 'Y') {
		fields.push({
			type: 'text',
			name: 'material',
			placeholder: '소재를 입력해주세요',
			label: '소재',
			autoComplete: 'off',
			required: false,
		});
	}
	if (partnershipInfo?.useFieldSize === 'Y') {
		fields.push({
			type: 'text',
			name: 'size',
			placeholder: '사이즈를 입력해주세요',
			label: '사이즈',
			autoComplete: 'off',
			required: false,
		});
	}
	if (partnershipInfo?.useFieldWeight === 'Y') {
		fields.push({
			type: 'text',
			name: 'weight',
			placeholder: '중량(무게)을 입력해주세요',
			label: '중량(무게)',
			autoComplete: 'off',
			required: false,
		});
	}
	return fields;
};

export const getProductRegisterInputList = (
	partnershipInfo?: PartnershipInfoResponse | null,
	brandList?: Options<number> | null
): InputTypeList => {
	const b2bType = partnershipInfo?.b2bType;
	const customFields = partnershipInfo?.nftCustomFields;

	const normalInputList = [...productRegisterInputList];
	let brandInputs = [
		{
			type: 'hidden',
			name: 'brandIdx',
		},
		{
			type: 'text',
			name: 'brandName',
			placeholder: '브랜드를 입력해주세요',
			label: '브랜드',
			autoComplete: 'off',
			required: true,
			disabled: true,
		},
	] as InputTypeList;

	// 커스텀 필드
	let customFieldInputList: InputTypeList = [];
	if (customFields && customFields?.length > 0) {
		customFieldInputList = customFields.map(
			(field) =>
				({
					type: 'text',
					name: field,
					label: field,
					autoComplete: 'off',
				} as InputType)
		);
	}

	// 일반 브랜드 타입
	if (b2bType === 'brand') {
		return [
			...brandInputs,
			...normalInputList,
			productRegisterProductCodeInput,
			...getUseYNFields(partnershipInfo),
			...customFieldInputList,
		];
	}

	let cooperatorInputList = [...productRegisterInputListForCooperator];
	// 병행업체
	if (brandList && brandList?.length > 0) {
		brandInputs = [
			{
				type: 'select',
				name: 'brandIdx',
				placeholder: '브랜드를 입력해주세요',
				label: '브랜드',
				autoComplete: 'off',
				required: true,
				options: brandList,
			},
		];
	}

	// 사용자가 선택한 카테고리
	const partnerCategories = partnershipInfo?.category;
	let selectedCategories: Options<number | ''> = [];
	if (partnerCategories && partnerCategories?.length > 0) {
		// 전체 제외
		const filteredProductCategoryOptions = productCategoryOptions.slice(
			1
		) as Options<number>;
		selectedCategories = filteredProductCategoryOptions.filter((item) =>
			partnerCategories.includes(item.value)
		);
	}
	cooperatorInputList = cooperatorInputList.map((item) => {
		if (item.name !== 'categoryCode') {
			return item;
		}
		return {
			...item,
			options: selectedCategories,
		};
	});
	return [
		...brandInputs,
		...normalInputList,
		...cooperatorInputList,
		...getUseYNFields(partnershipInfo),
		...customFieldInputList,
	];
};

export const convertProductRegisterFormData = (
	data: ProductRegisterFormData,
	images: ImageState[],
	customFields?: string[]
) => {
	const formData = new FormData();
	const customFieldObj: Record<string, string> = {};

	Object.keys(data).forEach((key: string) => {
		let value = data[key as keyof ProductRegisterFormData];

		// 입력 확인을 위한 필드
		if (['idx', 'brandName', 'brandNameEn', 'customField'].includes(key)) {
			return;
		}
		if (customFields?.includes(key)) {
			if (linkFormChecker(String(value))) {
				/* 개런티 커스텀 필드에서 url형식이 들어올때 (https가 안붙으면 붙여주기) */
				customFieldObj[key] = String(`https://${String(value)}`);
			} else {
				customFieldObj[key] = String(value) || '';
			}
			return;
		}
		if (key === 'price') {
			value = value ? String(value).split(',').join('') : '0';
		}

		formData.append(key, String(value) || '');
	});
	if (customFields) {
		formData.append('customField', JSON.stringify(customFieldObj));
	}

	// image가 없을 경우
	if (images?.length < 1) {
		formData.append('productImage', '');
		return formData;
	}

	// 이미지가 하나 이상 있을 경우
	images.forEach((image) => {
		formData.append('productImage', image?.file || '');
	});
	return formData;
};

export const getProductCustomFieldValue = (
	data: ProductRegisterFormData | Partial<ProductRegisterFormData>,
	customFields?: string[]
): Record<string, string> => {
	const customFieldObj: Record<string, string> = {};
	Object.keys(data).forEach((key: string) => {
		if (customFields?.includes(key)) {
			const value = data[key as keyof ProductRegisterFormData] || '';

			if (linkFormChecker(String(value))) {
				/* 개런티 커스텀 필드에서 url형식이 들어올때 (https가 안붙으면 붙여주기) */
				customFieldObj[key] = String(`https://${String(value)}`);
			} else {
				customFieldObj[key] = String(value);
			}
		}
	});
	return customFieldObj;
};

export const getProductRegisterFormDataForReset = (
	partnershipInfo: PartnershipInfoResponse,
	initialData:
		| ProductDetailResponse
		| Partial<ProductRegisterFormData>
		| null,
	images?: ImageState[]
): {data: ProductRegisterFormData; images: ImageState[]} => {
	const isB2bTypeBrand = partnershipInfo.b2bType === 'brand' ? true : false;
	const brand = partnershipInfo?.brand;
	const customFields = partnershipInfo?.nftCustomFields;
	let resetValue: ProductRegisterFormData = {
		idx: '',
		name: '',
		price: '',
		code: '',
		categoryCode: '',
		categoryName: '',
		...(isB2bTypeBrand
			? {
					brandIdx: (brand && brand?.idx) || '',
					brandName: brand?.name || '',
					brandNameEn: brand?.englishName || '',
			  }
			: {
					// b2b 타입이 아닌 경우, 브랜드를 직접 선택함
					brandIdx: '',
					brandName: '',
					brandNameEn: '',
			  }),
		modelNum: '',
		warranty: partnershipInfo?.warrantyDate || '',
		customField: (customFields || []).reduce((acc: CustomField, cur) => {
			acc[cur] = '';
			return acc;
		}, {}),
	};

	// 상품 등록
	if (!initialData) {
		return {
			data: resetValue,
			images: [],
		};
	}

	// 상품 수정
	const {
		name,
		code,
		categoryCode,
		categoryName,
		brandIdx,
		modelNum,
		price,
		warranty,
		customField,
		productImage,
	} = initialData;

	resetValue = {
		...resetValue,
		name: name || '',
		warranty: warranty || '',
		price: price ? price.toLocaleString() : '',
		categoryCode: categoryCode || '',
		categoryName: categoryName || '',
		code: code || '',
		modelNum: modelNum || '',
		...(!isB2bTypeBrand && {brandIdx: brandIdx}),
		...customField,
	};

	// 기존 등록된 상품의 이미지가 있거나(상품 수정), 상품의 이미지가 파일 형태로 존재 하거나(개런티 발급에서 상품 입력 후 수정)
	let resetImages: ImageState[] = [];
	if (productImage || (images && images?.length > 0)) {
		resetImages = productImage
			? ([
					{
						file: null,
						preview: productImage,
					},
			  ] as ImageState[])
			: (images as ImageState[]);
	}
	return {
		data: resetValue,
		images: resetImages,
	};
};

export const generateProductExcelUploadColumns = (
	fields: ExcelField<ProductExcelUploadInput>[]
) => {
	const requiredColumns: Array<Partial<Column>> = [];
	const optionalColumns: Array<Partial<Column>> = [];
	const headers: string[] = [];

	fields.forEach((field) => {
		const excelColumn = PRODUCT_EXCEL_DOWNLOAD_FORMAT[
			field.key as keyof ProductExcelUploadInput
		] || {
			key: field.key,
		};
		if (field.required) {
			requiredColumns.push(excelColumn);
		} else {
			optionalColumns.push(excelColumn);
		}
		headers.push(
			PRODUCT_EXCEL_COLUMN[field.key as keyof ProductExcelUploadInput] ||
				field.key
		);
	});

	return {
		headers,
		requiredColumns,
		optionalColumns,
	};
};

export const generateProductInputs = (
	fields: ExcelField<ProductExcelUploadInput>[]
) => {
	return fields
		.map((field) => PRODUCT_EXCEL_INPUT[field.key])
		.filter((item) => !!item);
};

export const getProductExcelSampleData = (
	partnershipData: PartnershipInfoResponse
): ProductExcelUploadInput[] => {
	return [
		{
			name: '샘플상품1',
			price: 149000,
			categoryCode: CATEGORIES[partnershipData?.category[0] || 1],
			...(partnershipData.useFieldModelNum === 'Y' && {modelNum: ''}),
			...(partnershipData.useFieldMaterial === 'Y' && {material: ''}),
			...(partnershipData.useFieldSize === 'Y' && {size: ''}),
			...(partnershipData.useFieldWeight === 'Y' && {weight: ''}),
			...partnershipData.nftCustomFields?.map((field) => ({[field]: ''})),
			...(partnershipData.useNftProdImage === 'Y' && {
				productImageUrl: 'https://www.example.com/sample.jpg',
			}),
			warranty: partnershipData?.warrantyDate || '',
		},
	];
};

/**
 * 엑셀 컬럼 모음
 */
export const PRODUCT_EXCEL_COLUMN: {
	[K in keyof ProductExcelUploadInput]: string;
} = {
	brandIdx: '브랜드',
	name: '상품명',
	warranty: '보증기간',
	categoryCode: '카테고리',
	price: '상품금액',
	code: '상품코드',
	productImageUrl: '상품이미지',
	modelNum: '모델번호',
	material: '가죽',
	size: '사이즈',
	weight: '중량',
};

/**
 * 엑셀 다운로드 양식 모음
 */
export const PRODUCT_EXCEL_DOWNLOAD_FORMAT: {
	[K in keyof ProductExcelUploadInput]: Partial<Column>;
} = {
	brandIdx: {key: 'brandIdx', width: 15},
	name: {key: 'name', width: 20},
	warranty: {key: 'warranty', width: 30},
	categoryCode: {key: 'categoryCode', width: 10},
	price: {key: 'price', width: 15, style: {numFmt: '0'}},
	code: {key: 'code', width: 10},
	productImageUrl: {key: 'productImageUrl', width: 50},
	modelNum: {key: 'modelNum', width: 20},
	material: {key: 'material', width: 10},
	size: {key: 'size', width: 10},
	weight: {key: 'weight', width: 10},
};

/**
 * 엑셀 input 모음
 */
export const PRODUCT_EXCEL_INPUT: {
	[K in keyof ProductExcelUploadInput | string]: ExcelInput;
} = {
	// b2bType brand 외
	brandIdx: {
		type: 'select',
		name: 'brandIdx',
		required: true,
	},
	warranty: {
		type: 'text',
		name: 'warranty',
		required: true,
		width: 260,
	},
	name: {
		type: 'text',
		name: 'name',
		required: true,
		width: 260,
	},
	// b2bType brand 외
	categoryCode: {
		type: 'select',
		name: 'categoryCode',
		required: true,
	},
	code: {
		type: 'text',
		name: 'code',
		required: false,
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
	modelNum: {
		type: 'text',
		name: 'modelNum',
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
	productImageUrl: {
		type: 'link',
		name: 'productImageUrl',
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
};

/**
 * 상품 대량등록에 필요한 필드 조회
 */
export const getProductExcelField = (
	partnershipData: PartnershipInfoResponse
): ExcelField<ProductExcelUploadInput>[] => {
	let fields: ExcelField<ProductExcelUploadInput>[] = [];
	const isB2bTypeBrand = partnershipData.b2bType === 'brand';
	if (!isB2bTypeBrand) {
		fields.push({
			required: true,
			key: 'brandIdx',
		});
	}
	fields = [
		...fields,
		{required: true, key: 'name'},
		{required: true, key: 'warranty'},
	];
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
	fields.push({
		required: false,
		key: 'code',
	});
	if (partnershipData.useFieldModelNum === 'Y') {
		fields.push({
			required: false,
			key: 'modelNum',
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
			key: 'productImageUrl',
		});
	}
	return fields;
};

export const customFieldsToJSONString = <T,>(
	data: T,
	customFields?: string[]
) => {
	if (!data || !customFields || customFields?.length < 1) {
		return JSON.stringify({});
	}
	const customFieldObj: Record<string, string> = {};
	customFields.forEach((customField) => {
		let value = String(data[customField as keyof T] || '');
		if (linkFormChecker(value)) {
			value = `https://${value}`;
		}
		customFieldObj[customField] = value;
	});
	return JSON.stringify(customFieldObj);
};

/**
 * number 타입이 아닌 경우, 모두 문자열로 변환
 */
export const convertProductInputNubmerToString = (data: Record<any, any>) => {
	const numberFormatKeyList = ['idx', 'brandIdx', 'price', 'categoryCode'];
	const formattedData: Record<any, any> = {};
	Object.entries(data).forEach((item) => {
		const [key, value] = item;
		if (typeof value === 'number' && !numberFormatKeyList.includes(key)) {
			formattedData[key] = String(value);
		} else {
			formattedData[key] = value;
		}
	});
	return formattedData;
};
