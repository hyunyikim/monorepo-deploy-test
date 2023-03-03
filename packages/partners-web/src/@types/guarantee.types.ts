// 구버전 api에 맞춰진 타입
import {ProductRegisterFormData} from './product.types';

export type GuaranteeListRequestSearchType =
	| 'all'
	| 'nft_req_num'
	| 'pro_nm'
	| 'ordererName';

export type GuaranteeStatus = 'READY' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';

export interface GuaranteeListRequestParam {
	nft_req_state: string;
	platform: number | '';
}

export type GuaranteeRequestState = '1' | '2' | '3' | '4' | '9';
export interface GuaranteeListResponse {
	pro_idx: number;
	nft_req_idx: number;
	nft_req_dt: string;
	nft_req_num: string;
	platform_idx: number;
	issuer_idx: number;
	issuer_nm: string;
	platform_text?: string;
	company_idx: number;
	nft_req_nm: string;
	user_num?: string;
	orderer_nm: string;
	orderer_tel: string;
	brand_idx: number;
	brand_nm?: string;
	brand_nm_en?: string;
	cate_cd: string;
	cate_cd_text: string;
	pro_nm: string;
	price: number;
	model_num: string;
	warranty_dt: string;
	blockchain_platform?: string;
	target_wallet: string;
	ref_req_no: string;
	ref_user_idx: string;
	ref_order_id: string;
	ref_order_dtl_id: string;
	ref_cate_cd: string;
	ref_pro_cd: string;
	product_img: any;
	nft_req_state: GuaranteeRequestState;
	nft_req_state_text: string;
	klip_yn: string;
	join_yn: string;
	nft_req_type: string;
	nft_req_type_text: string;
	work_state: any;
	work_state_text: any;
	inspct_state: any;
	inspct_state_text: any;
	reg_dt: string;
	inspct_in_dt: any;
	inspct_out_dt: any;
	work_in_dt: any;
	work_end_dt: any;
	work_out_dt: any;
	pro_in_dt: any;
	pro_out_dt: any;
	issued_dt?: string;
	nft_card_img: string;
}

export interface GauranteeDetailResponse {
	result: string;
	message: string;
	data: Guarantee;
	images: GuaranteeImageResponse[];
	repairImages: any[];
}

export interface Guarantee {
	pro_idx: number;
	productIdx: number;
	nft_req_idx: number;
	company_idx: number;
	issuer_idx: number;
	issuer_id: string;
	nft_bg_img: string;
	issuer_nm: string;
	nft_req_dt: string;
	nft_req_num: string;
	ref_req_no: string;
	ref_user_idx: string;
	ref_order_id: string;
	ref_order_dtl_id: string;
	ref_cate_cd: string;
	ref_pro_cd: string;
	cate_cd: string;
	cate_cd_text: any;
	brand_idx: number;
	brand_nm: string;
	brand_nm_en: string;
	pro_nm: string;
	model_num: string;
	material: string;
	size: string;
	weight: string;
	custom_field: any;
	price: number;
	product_img: any;
	warranty_dt: string;
	carg_mgmt_no: any;
	dclr_no: any;
	mbl_no: any;
	hbl_no: any;
	lod_cnty_cd_text: any;
	dclr_file: any;
	seller_nm: string;
	seller_auth_info: string;
	parent_seller_auth_info: string;
	business_num: string;
	order_platform_idx: number;
	order_platform_nm: any;
	order_platform_id: any;
	blockchain_platform: any;
	target_wallet: any;
	order_dt: any;
	order_num: string;
	orderer_nm: string;
	orderer_tel: string;
	user_idx: number;
	waiting_user_idx: any;
	waiting_wallet_address: any;
	token_id: string | null;
	external_link: any;
	transaction_hash: any;
	nft_req_state: GuaranteeRequestState;
	nft_title: string;
	nft_description: string;
	nft_req_state_text: string;
	nft_req_type: string;
	nft_req_type_text: string;
	nft_card_img: any;
	work_state: any;
	work_state_text: any;
	inspct_state: any;
	inspct_state_text: any;
	klip_activate_yn: string;
	join_yn: string;
	user_nm: any;
	klip_yn: string;
	klip_wallet_address: any;
	kas_wallet_address: any;
	inspct_info: any;
	repair_info: any;
}

export interface GuaranteeImageResponse {
	nft_req_img_idx: number;
	nft_req_idx: number;
	img_detail: string;
	img_sort: number;
}

export interface GuaranteeRegisterRequestParam {
	nft_req_state: Extract<GuaranteeRequestState, '1' | '2'>;
	nft_req_idx?: number;
	orderer_nm: string;
	orderer_tel: string;
	order_dt?: string;
	platform_nm?: string; // 판매처명
	platform_idx?: number; // 판매처 idx
	ref_order_id?: string;

	// 값이 있다면 기존 등록된 상품을 선택했음
	// 값이 없다면 개런티 발급을 위한 상품을 입력했음
	productIdx: number;
}

// 개런티 발급시, 상품 직접 입력하는 경우(상품으로 따로 등록하지 않음)
export interface GuaranteeRegisterProductRequestParam
	extends GuaranteeRegisterRequestParam {
	brand_idx: number;
	pro_nm: string;
	price?: string;
	cate_cd?: number;
	warranty_dt: string;
	model_num?: string;
	custom_field?: string;
	product_img?: string[];
}

export interface GuaranteeExcelUploadFormData
	extends Pick<
		GuaranteeRegisterProductRequestParam,
		| 'orderer_nm'
		| 'orderer_tel'
		| 'warranty_dt'
		| 'pro_nm'
		| 'price'
		| 'product_img'
		| 'order_dt'
		| 'platform_nm'
		| 'ref_order_id'
		| 'custom_field'
	> {
	[key: string]: any; // customFields
}

// 개런티 발급시, 입력되는 폼 데이터 타입
export interface GuaranteeRegisterFormData
	extends Omit<GuaranteeRegisterRequestParam, 'productIdx'> {
	productIdx: number | '';
}

// 개런티 발급시, 입력되는 폼 데이터 타입(상품 직접 입력 후 개런티와 함께 저장)
export interface GuaranteeRegisterProductFormData
	extends GuaranteeRegisterFormData,
		ProductRegisterFormData {}
