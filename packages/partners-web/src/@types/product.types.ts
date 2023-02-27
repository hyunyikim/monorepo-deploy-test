import {ListRequestParam} from './list.types';

export type ProductListRequestSearchType = 'all' | 'name' | 'code' | 'num';

export interface Product {
	idx: number;
	name: string;
	code?: string;
	num: string;
	categoryCode: string;
	categoryName: string;
	brandIdx: number;
	modelNum?: string;
	material?: string;
	size?: string;
	weight?: string;
	price?: number;
	warranty: string;
	customField?: CustomField;
	productImage?: string;
	partnerIdx?: number;
	registrantIdx?: number;
	registeredAt?: string;
	modifiedAt?: string;
	deletedAt?: any;
	brand: Brand;
}

export interface ProductListResponse extends Omit<Product, 'customField'> {
	customField?: CustomField;
}

export interface ProductDetailResponse extends Product {
	nftCount: number;
}

export type CustomField = Record<string, any>;

export interface Brand {
	idx: number;
	name: string;
	englishName: string;
	summary: string;
	mainImage: any;
	detailImage: any;
	registrantIdx: string;
	registeredAt: string;
}

// 상품 등록 요청시 보낼 타입
export interface ProductRegisterRequestParam
	extends CooperatorProductRegisterRequestParam {
	idx?: number;
	name: string;
	brandIdx: number;
	price?: string;
	warranty: string;
	customField?: string;
	productImage?: ImageState;
}

export interface CooperatorProductRegisterRequestParam {
	categoryCode?: string;
	categoryName?: string;
	code?: string;
	modelNum?: string;
}

// 입력시 사용하는 타입
export interface ProductRegisterFormData
	extends Omit<
		ProductRegisterRequestParam,
		'idx' | 'brandIdx' | 'customField'
	> {
	idx: number | '';
	brandIdx: number | '';
	customField: CustomField;
	brandName: string;
	brandNameEn: string;
}
export interface ImageState {
	file: File | string | null;
	preview: string;
}

export type ProductGuaranteeStatus = 'ready' | 'complete' | 'cancel';
export interface ProductGuaranteeRequestParam
	extends Pick<ListRequestParam, 'sort' | 'currentPage' | 'pageMaxNum'> {
	nftStatus: ProductGuaranteeStatus | '';
}
export interface ProductGuarantee {
	idx: number;
	nftNumber: string;
	nftStatusCode: string;
	nftStatus: string;
	nftType: string;
	productName: string;
	ordererName: string;
	ordererTel: string;
	platformIdx: number;
	registeredAt: string;
}

// 엑셀 대량등록
export interface CustomFieldsInput {
	[key: string]: any;
}
export interface ProductExcelUploadInput {
	brandIdx?: number;
	name?: string;
	warranty?: string;
	price?: number;
	code?: string;
	productImageUrl?: string;
	categoryCode?: string;
	modelNum?: string;
	material?: string;
	size?: string;
	weight?: string;
}
// 엑셀 대량등록 입력시 사용
export interface ProductExcelUploadInputWithCustomFields
	extends ProductExcelUploadInput,
		CustomFieldsInput {}

// 엑셀 대량등록 api 요청시 사용
export interface ProductExcelUploadRequestData
	extends Omit<ProductExcelUploadInput, 'brandIdx' | 'name' | 'warranty'> {
	brandIdx: number;
	name: string;
	warranty: string;
	categoryName?: string; // b2b 타입 브랜드 외
	customField?: string;
}
