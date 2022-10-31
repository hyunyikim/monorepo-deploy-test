export type RepairListRequestSearchType = 'all' | 'pro_nm' | 'model_num';

export interface RepairListRequestParam {
	inspct_state: string;
}

export interface RepairListResponse {
	inspct_idx: number;
	inspct_num: string;
	ref_serial_num: any;
	reg_type: string;
	inspct_fee: number;
	return_phone: string;
	buy_place: string;
	priority: number;
	cost: number;
	origin: string;
	serial_num: string;
	product_img: string;
	brand_nm: string;
	brand_nm_en: string;
	pro_nm: string;
	category: string;
	request_dt: string;
	inspct_in_dt: any;
	work_in_dt: string;
	pro_out_dt: any;
	mod_dt: string;
	inspct_state: string;
	inspct_state_text: string;
	work_state: string;
	work_state_text: string;
	inspct_result: string;
	inspct_result_text: string;
	return_nm: string;
	store_idx: number;
	store_nm: string;
	company_nm: string;
	inspctor_idx: number;
	inspct_admin_nm: string;
	self_yn: string;
	comment_cnt: number;
	dlry_list: any;
	dlry_list_text: any;
	tracking_num: any;
	paid_yn: string;
	first_worker_nm: any;
	first_worker_idx: any;
	second_worker_nm: any;
	second_worker_idx: any;
	pre_inspct_result: any;
	estimated_time: string;
	cstmg_memo: string;
}
