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
	{
		name: 'categoryCode',
		label: '카테고리',
		component: 'select',
		options: productCategoryOptions,
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
	{
		name: 'categoryCode',
		label: '카테고리',
		component: 'select',
		options: productCategoryOptions,
	},
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
		placeholder: '보증기간을 입력해주세요',
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
	{
		type: 'text',
		name: 'modelNum',
		placeholder: '모델번호를 입력해주세요',
		label: '모델번호',
		autoComplete: 'off',
		required: false,
	},
];

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
		...customFieldInputList,
	];
};

export const convertProductRegisterFormData = (
	data: ProductRegisterFormData,
	images: ImageState[] | null,
	customFields?: string[]
) => {
	const formData = new FormData();
	const customFieldObj: Record<string, string> = {};

	Object.keys(data).forEach((key: string) => {
		let value = data[key as keyof ProductRegisterFormData];

		// 입력 확인을 위한 필드
		if (['brandName', 'customField'].includes(key)) {
			return;
		}
		if (customFields?.includes(key)) {
			customFieldObj[key] = String(value) || '';
			return;
		}

		if (!value) return;
		if (key === 'price') {
			value = String(value).split(',').join('') || '';
		}

		formData.append(key, String(value));
	});
	if (customFields) {
		formData.append('customField', JSON.stringify(customFieldObj));
	}
	if (images && images.length > 0) {
		images.forEach((image) => {
			image?.file && formData.append('productImage', image.file);
		});
	}
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
			customFieldObj[key] = String(value);
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
	images?: ImageState[] | null
): {data: ProductRegisterFormData; images: ImageState[]} => {
	const brand = partnershipInfo?.brand;
	const customFields = partnershipInfo?.nftCustomFields;
	let resetValue: ProductRegisterFormData = {
		idx: '',
		name: '',
		price: '',
		code: '',
		categoryCode: '',
		categoryName: '',
		brandIdx: (brand && brand?.idx) || '',
		brandName: partnershipInfo?.brand?.name || '',
		brandNameEn: partnershipInfo?.brand?.englishName || '',
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

	const isCooperator =
		partnershipInfo?.b2bType === 'cooperator' ? true : false;
	resetValue = {
		...resetValue,
		name: name || '',
		warranty: warranty || '',
		price: price ? price.toLocaleString() : '',
		categoryCode: categoryCode || '',
		categoryName: categoryName || '',
		code: code || '',
		modelNum: modelNum || '',
		...(isCooperator && {brandIdx: brandIdx}),
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
