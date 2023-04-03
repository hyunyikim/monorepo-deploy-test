import {Chip} from '@/components';

import {
	Options,
	ListSearchFilters,
	GuaranteeListRequestSearchType,
	InputTypeList,
	GroupingGuaranteeListStatus,
	RegisterGuaranteeRequest,
	ProductRegisterFormData,
	ImageState,
	RegisterGuaranteeRequestExcelFormData,
	RegisterGuaranteeStatusType,
	RegisterGuaranteeRequestRouteType,
} from '@/@types';
import {getProductCustomFieldValue} from '@/data/product.data';

export const NOT_OPEN_GUARANTEE_REGISTER_ALIM_TALK_NOTICE_KEY =
	'vircle-guarantee-register-alim-talk-notice';

export const guaranteeListSearchTypes: Options<GuaranteeListRequestSearchType> =
	[
		{label: '전체', value: 'all'},
		{label: '신청번호', value: 'nftNumber'},
		{label: '상품명', value: 'name'},
		{label: '이름', value: 'ordererName'},
	];

// 목록 조회를 위한 옵션, 발급신청/승인완료/발급완료 상태를 발급완료 상태 하나로 묶어놓음
export const groupingGuaranteeRequestStates: Options<GroupingGuaranteeListStatus> =
	[
		{value: '', label: '전체'},
		{value: 'ready', label: '신청대기'},
		{value: 'pending,complete', label: '발급완료'},
		{value: 'cancel', label: '발급취소'},
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
		name: 'storeIdx',
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
		name: 'nftStatus',
		required: true,
	},
	{
		type: 'text',
		name: 'ordererName',
		placeholder: '고객의 실명을 정확히 입력해주세요',
		label: '이름',
		autoComplete: 'off',
		required: true,
	},
	{
		type: 'text',
		name: 'ordererTel',
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
		name: 'orderedAt',
		placeholder: 'YYYY-MM-DD',
		label: '주문일자',
		required: false,
		inputProps: {
			maxLength: 10,
		},
	},
	{
		type: 'autocomplete',
		name: 'storeName',
		placeholder: '판매처를 입력해주세요',
		label: '판매처',
		required: false,
	},
	{
		type: 'text',
		name: 'refOrderId',
		placeholder: '주문번호를 입력해주세요',
		label: '주문번호',
		required: false,
	},
];

export const checkNotOpenAlimtalkModal = (email?: string) => {
	const tempSavedData = JSON.parse(
		localStorage.getItem(
			NOT_OPEN_GUARANTEE_REGISTER_ALIM_TALK_NOTICE_KEY
		) || '{}'
	);
	if (tempSavedData.hasOwnProperty(email)) {
		return tempSavedData[email as string] === 'Y' ? true : false;
	}
	return false;
};

export const convertRegisterGuaranteeRequestDataToFormData = ({
	guarantee,
	product,
	images,
	customFields,
}: {
	guarantee: RegisterGuaranteeRequest;
	product: Partial<ProductRegisterFormData>;
	images: ImageState[];
	customFields?: string[];
}) => {
	const formData = new FormData();

	// 개런티 정보 form append
	Object.entries(guarantee).forEach(([key, value]) => {
		const filteredValue = value ? String(value).trim() : '';
		if (filteredValue) {
			formData.append(key, String(filteredValue));
		}
	});

	// 판매처가 기존에 있던 것으로 선택 되었다면, 판매처 idx만 보내줌
	if (formData.get('storeName') && formData.get('storeIdx')) {
		formData.delete('storeName');
	}

	// 공통 정보 form append
	formData.append('requestRoute', 'vircle');

	const isRegisterGuaranteeWithProduct = product.idx ? true : false;

	// 이미 입력된 상품으로 개런티 발급
	if (isRegisterGuaranteeWithProduct) {
		formData.append('partnersProductIdx', String(product.idx));
		return formData;
	}

	// 개런티 발급과 함께 상품 정보 입력
	// 상품 정보 함께 form append
	Object.entries(product).forEach(([key, value]) => {
		const productFields = [
			'brandIdx',
			'name',
			'price',
			'warranty',
			'categoryCode',
			'code',
			'modelNum',
			'material',
			'size',
			'weight',
		];

		const filteredValue = value ? String(value).trim() : '';
		if (productFields.includes(key) && filteredValue) {
			if (key === 'brandIdx') {
				formData.append('brandIdx', filteredValue);
			}
			if (key === 'name') {
				formData.append('productName', filteredValue);
			}
			if (key === 'price') {
				formData.append('price', filteredValue.replace(/,/g, ''));
			}
			if (key === 'warranty') {
				formData.append('warrantyDate', filteredValue);
			}
			if (key === 'categoryCode') {
				formData.append('categoryCode', filteredValue);
			}
			if (key === 'code') {
				formData.append('code', filteredValue);
			}
			if (key === 'modelNum') {
				formData.append('modelNumber', filteredValue);
			}
			if (key === 'material') {
				formData.append('material', filteredValue);
			}
			if (key === 'size') {
				formData.append('size', filteredValue);
			}
			if (key === 'weight') {
				formData.append('weight', filteredValue);
			}
		}
	});

	// customFields 세팅
	const customFieldObj = getProductCustomFieldValue(product, customFields);
	formData.append('customField', JSON.stringify(customFieldObj));

	if (images && images?.length > 0 && images[0].file) {
		if (typeof images[0].file === 'string') {
			formData.append('productImages[0]', images[0].file);
		} else {
			formData.append('productImage', images[0].file);
		}
	}
	return formData;
};

export class ConvertExcelDataToRegisterGuaranteeRequest {
	// brandIdx?: number;
	nftStatus: RegisterGuaranteeStatusType;
	ordererName: string;
	ordererTel: string;

	// 옵셔널 필드
	orderedAt?: string;
	storeName?: string;
	storeIdx?: number | '';
	refOrderId?: string;
	requestRoute?: RegisterGuaranteeRequestRouteType;

	constructor(data: RegisterGuaranteeRequestExcelFormData) {
		this.nftStatus = 'request';
		this.ordererName = data.ordererName;
		this.ordererTel = data.ordererTel;
		this.orderedAt = data.orderedAt;
		this.storeName = data.storeName;
		this.storeIdx = data.storeIdx;
		this.refOrderId = data.refOrderId;
		this.requestRoute = data.requestRoute;
	}
}

export class ConvertExcelDataToRegisterProductRequest {
	// idx?: number;
	name: string;
	brandIdx: number;
	price?: string;
	warranty: string;
	// customField?: string;
	productImage?: ImageState;
	material?: string;
	size?: string;
	weight?: string;
	categoryCode?: string;
	// categoryName?: string;
	// code?: string;
	modelNum?: string;
	// [key in string]?: any;

	constructor(data: RegisterGuaranteeRequestExcelFormData) {
		const {
			productName,
			brandIdx,
			price,
			warrantyDate,
			productImage,
			material,
			size,
			weight,
			categoryCode,
			modelNumber,
			...rest
		} = data;

		this.name = productName as string;
		this.brandIdx = brandIdx as number;
		this.price = price;
		this.warranty = warrantyDate;
		this.productImage = {
			file: productImage || null,
			preview: productImage || null,
		};
		this.material = material;
		this.size = size;
		this.weight = weight;
		this.categoryCode = categoryCode;
		this.modelNum = modelNumber;

		// custom field 위해서 나머지 필드 모두 this에 set
		Object.assign(this, rest);
	}
}
