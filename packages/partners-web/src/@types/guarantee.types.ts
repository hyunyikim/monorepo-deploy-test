export type GuaranteeListRequestSearchType = 'all' | 'nft_req_num';

export type GuaranteeStatus = 'READY' | 'COMPLETE' | 'CANCELED';

export interface GuaranteeListRequestParam {
	nft_req_state: string;
}

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
	nft_req_state: string;
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
