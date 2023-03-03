export interface Cafe24Interwork {
	mallId: string;
	issueSetting: IssueSetting;
	store: Store;
	partnerIdx: number;
	partnerInfo: any;
	joinedAt: string;
	confirmedAt: string;
	updatedAt: string;
}

export interface IssueSetting {
	manually: boolean;
	issueAll: boolean;
	issueCategories: IssueCategory[];
	issueIntro?: boolean;
}

export type IssueTiming = 'AFTER_SHIPPING' | 'AFTER_DELIVERED';

export interface IssueCategory {
	idx: number;
	depth: number;
	name: string;
	fullName: string[];
	fullNo: number[];
}

export interface Store {
	country: string;
	customer_service_phone: string;
	mall_url: string;
	company_map_url: string;
	customer_service_fax: string;
	company_line: string;
	customer_service_sms: string;
	mall_id: string;
	president_name: string;
	mail_order_sales_registration: string;
	customer_service_email: string;
	missing_report_reason: string;
	privacy_officer_position: string;
	primary_domain: string;
	fax: string;
	notification_only_email: string;
	contact_us_mobile: string;
	email: string;
	shop_no: number;
	missing_report_reason_type: string;
	address2: string;
	address1: string;
	mail_order_sales_registration_number: string;
	privacy_officer_phone: string;
	base_domain: string;
	shop_name: string;
	company_registration_no: string;
	zipcode: string;
	customer_service_hours: string;
	country_code: string;
	privacy_officer_email: string;
	phone: string;
	privacy_officer_name: string;
	company_name: string;
	company_condition: string;
	contact_us_contents: string;
	about_us_contents: string;
	privacy_officer_department: string;
}

export interface Cafe24Category {
	shop_no: number;
	category_no: number;
	category_depth: number;
	parent_category_no: number;
	category_name: string;
	full_category_name: {
		'1': string;
		'2': string | null;
		'3': string | null;
		'4': string | null;
	};
	full_category_no: {
		'1': number;
		'2': number | null;
		'3': number | null;
		'4': number | null;
	};
	root_category_no: number;
	use_display: string;
	display_order: number;
	hash_tags: any[];
}
