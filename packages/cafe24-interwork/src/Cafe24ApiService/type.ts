import {String} from 'aws-sdk/clients/apigateway';
import {
	IsArray,
	IsDateString,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsString,
	IsUrl,
} from 'class-validator';

export class OrderBuyer {
	'shop_no': number;
	'member_id': string;
	'member_group_no': number;
	'name': string;
	'names_furigana': string;
	'email': string;
	'phone': string;
	'cellphone': string;
	'customer_notification': string;
	'updated_date': string;
	'user_id': string;
	'user_name': string;
}

export class OrderItem {
	/** 멀티쇼핑몰 번호 */
	shop_no: number;

	/** 품목별 주문번호의 아이디 */
	item_no: number;

	/** 품주코드 : 품목별 주문번호의 코드 */
	order_item_code: string; // KEY FEATURE

	/** 품목코드 : 시스템이 품목에 부여한 코드. 해당 쇼핑몰 내에서 품목 코드는 중복되지 않음. */
	variant_code: string;

	/** 상품의 고유한 일련 번호. 해당 쇼핑몰 내에서 상품 번호는 중복되지 않음. */
	product_no: number;

	/** 시스템이 상품에 부여한 코드. 해당 쇼핑몰 내에서 상품코드는 중복되지 않음. */
	product_code: string; // P000000N

	/** 자체상품 코드 */
	custom_product_code: string;

	/** 자체 품목 코드 */
	custom_variant_code: string;

	/** 상품의 영문 이름. 해외 배송 등에 사용 가능함. */
	eng_product_name: string | null;

	/** 상품옵션의 아이디 */
	option_id: string;

	/** 주문한 상품의 옵션값 */
	option_value: string;

	/** 기본옵션값 */
	option_value_default: string;

	additional_option_value: string;
	additional_option_values: {
		key: string;
		type: string;
		name: string;
		value: string;
	}[];

	product_name: string;
	product_name_default: string;
	product_price: string;
	option_price: string;
	additional_discount_price: string;
	coupon_discount_price: string;
	app_item_discount_amount: string;
	payment_amount: string;
	quantity: number;
	/** 상품 세금 구분 (A : 과세 B : 면세 C : 비과세) */
	product_tax_type: 'A' | 'B' | 'C';

	/** 과세율 */
	tax_rate: number;

	/** 공급사의 상품명 */
	supplier_product_name: string;

	/** 공급사의 거래 유형 ( D: 직등록형, P: 수수료형 ) */
	supplier_transaction_type: 'D' | 'P';

	/** 공급사의 아이디 */
	supplier_id: string;

	/** 공급사의 이름 */
	supplier_name: string;

	/** 송장번호 */
	tracking_no: string;

	/** 배송번호. 품목별 주문번호를 배송준비중으로 처리하면 시스템이 자동으로 부여하는 번호. */
	shipping_code: string;

	/** 취소/교환/반품 번호 */
	claim_code: string; //C20190107-0000001

	/** 취소/교환/반품 요청 사유 타입 */
	claim_reason_type: string; //

	/** 구매자의 취소/교환/반품 신청 사유 구분. */
	claim_reason: string; // 구매자의 취소/교환/반품 신청 사유 상세 내용.

	/** 환불 은행 */
	refund_bank_name: string;

	refund_bank_account_no: string;
	refund_bank_account_holder: string;
	// "post_express_flag": null;
	/** 주문상태. 주문 상태별로 각각의 코드가 있음. */
	order_status: string;

	/** 철회상태
	 * Cancellation : 취소철회
	 * Exchange : 교환철회
	 * Return : 반품철회
	 */
	request_undone: string | null;

	/** 취소/교환/반품 요청 수량 */
	claim_quantity: number;
	/** 주문상태의 추가정보 */
	order_status_additional_info: null;

	/**
	 * 현재 처리상태의 코드
	 * N1 : 정상, N2 : 교환상품, C1 : 입금전취소, C2 : 배송전취소, C3 : 반품, E1 : 교환
	 */
	status_code: string;

	/** 현재 처리상태 문구설명 */
	status_text: string;

	/** 마켓연동 상태값 */
	open_market_status: string;

	/** 배송 대상 주문건의 묶음배송 유형
	 *  N : 단일 주문 일반 배송(Normal)
	 * C :복합 주문 결합 배송(Combination)
	 * */
	bundled_shipping_type: 'N' | 'C';

	/** 배송업체의 아이디 */
	shipping_company_id: string;

	/** 배송업체의 이름 */
	shipping_company_name: string;

	/** 배송업체 코드 */
	shipping_company_code: string;

	/** 세트상품 여부 */
	product_bundle: 'T' | 'F';

	/** 세트상품번호 */
	product_bundle_no: string;
	product_bundle_name: string | null;

	original_item_no: number[];
	store_pickup: 'F' | 'T';
	ordered_date: string;
	shipped_date: string | null;
	delivered_date: string | null;
	cancel_date: string | null;
	return_confirmed_date: string | null;
	return_request_date: string | null;
	/** 반품수거일 */
	return_collected_date: string | null;
	/** 취소 요청일 */
	cancel_request_date: string | null;
	/** 환불 완료일 */
	refund_date: string | null;
	/** 교환 요청일 */
	exchange_request_date: string | null;
	/** 교환 완료일 */
	exchange_date: string | null;
	/** 상품의 소재. 복합 소재일 경우 상품의 소재와 함유랑을 함께 입력해야함 */
	product_material: string | null;

	/** 상품소재 영문 설명 */
	product_material_eng: string | null;

	/** 상품이 의류인 경우, 옷감. */
	cloth_fabric: string | null;

	/** 상품 중량 (kg) */
	product_weight: string | null;

	/** 상품의 부피 */
	volume_size: string | null;

	/** 상품의 부피 무게 */
	volume_size_weight: string | null;

	/** 상품의 원산지 */
	origin_place: string;

	/** 원산지 코드 */
	origin_place_no: 1798;

	/** 원산지 국가 코드 */
	made_in_code: string | null;

	/** 사은품 여부 */
	gift: 'F' | 'T';

	order_id: string;

	claim_type: string;

	claim_status: string;
}
export class AccessToken {
	@IsNotEmpty()
	@IsString()
	access_token: string;

	@IsNotEmpty()
	@IsDateString()
	expires_at: string;

	@IsNotEmpty()
	@IsString()
	refresh_token: string;

	@IsNotEmpty()
	@IsDateString()
	refresh_token_expires_at: string;

	@IsNotEmpty()
	@IsString()
	client_id: string;

	@IsNotEmpty()
	@IsString()
	mall_id: string;

	@IsNotEmpty()
	@IsString()
	user_id: string;

	@IsNotEmpty()
	@IsArray()
	scopes: string[];

	@IsNotEmpty()
	@IsDateString()
	issued_at: string;
}

export class Product {
	@IsNumber()
	shop_no: number;

	@IsNumber()
	product_no: number;

	@IsString()
	product_code: string;

	@IsString()
	product_name: string;

	@IsString()
	eng_product_name: string;

	@IsString()
	price: string;

	@IsString()
	retail_price: string;

	@IsUrl()
	detail_image: string;

	@IsUrl()
	list_image: string;

	@IsUrl()
	tiny_image: string;

	@IsUrl()
	small_image: string;

	@IsDateString()
	created_date: string;

	@IsDateString()
	updated_date: string;

	@IsString()
	summary_description: string;

	/**
	01 : 택배
	02 : 빠른등기
	03 : 일반등기
	04 : 직접배송
	05 : 퀵배송
	06 : 기타
	07 : 화물배송
	08 : 매장직접수령
	09 : 배송필요 없음
	 */
	@IsString()
	shipping_method: string;

	@IsString()
	sold_out: 'T' | 'F';
}

export class Category {
	@IsNumber()
	ship_no: number;

	@IsNumber()
	category_no: number;

	/**
	 * 해당 상품분류가 하위 몇 차 상품분류에 있는 카테고리인지 표시함. 1~4차까지 상품분류가 존재한다.
	 */
	@IsNumber()
	category_depth: number;

	/**
	 * 해당 상품분류가 2차(중분류), 3차(소분류), 4차(세분류)일 경우 상위에 있는 상품분류의 번호를 표시함.
	 * parent_category_no = 1일 경우 해당 분류는 대분류를 의미한다.
	 * */
	@IsNumber()
	parent_category_no: number;

	/** 해당 상품분류의 이름을 나타낸다. */
	@IsString()
	category_name: string;

	/** full_category_name */
	@IsObject()
	full_category_name: Record<'1' | '2' | '3' | '4', string>;

	@IsString()
	root_category_no: number;

	@IsObject()
	full_category_no: Record<'1' | '2' | '3' | '4', string>;
}

export class Order {
	@IsNumber()
	ship_no: number;

	currency: string;

	order_id: string;

	member_id: string;
	member_email: string;
	/** 회원 인증여부. 인증여부에 따라 3가지로 회원타입이 나눠짐. */
	member_authentication: 'T' | 'B' | 'J';

	/** 결제자명 */
	billing_name: string;

	/** 결제가 완료되었는지 여부 (T : 결제, F : 미결제, M : 부분 결제) */
	paid: 'T' | 'F' | 'M';

	/** 취소 여부 */
	canceled: 'T' | 'F' | 'M';

	/** 주문일 */
	order_date: string;

	/** 결제일 */
	payment_date: string;

	/** 배송 상태 (F : 배송전, M : 배송중, T : 배송완료, W : 배송보류, X : 발주전) */
	shipping_status: string;
}

export class CustomerPrivacy {
	@IsNumber()
	ship_no: number;

	@IsString()
	member_id: string;

	@IsString()
	name: string;

	@IsString()
	name_english: string;

	@IsString()
	phone: string;

	@IsString()
	cellphone: string;

	@IsEmail()
	email: string;

	@IsDateString()
	birthday: string;

	@IsString()
	gender: 'F' | 'M';

	/** 회원타입 p : 개인, c : 사업자, f : 외국인 */
	@IsString()
	member_type: 'p' | 'c' | 'f';
}

export class Store {
	@IsNumber()
	shop_no: number;

	@IsString()
	shop_name: string;

	@IsString()
	mall_id: string;

	@IsString()
	base_domain: string;

	@IsString()
	primary_domain: string;

	/** 사업장이 위치한 국가에서 발급한 쇼핑몰의 사업자 등록 번호. */
	company_registration_no: string;

	/** 사업자 등록시 등록한 상호명 또는 법인명. */
	company_name: string;

	/** 사업자 등록시 등록한 대표자명. */
	president_name: string;

	/** 전화번호 */
	phone: string;

	/** 이메일 */
	email: string;

	/** 쇼핑몰 주소 */
	mall_url: string;

	address1: string;
	address2: string;
}

export class Shop {
	@IsNumber()
	ship_no: number;

	@IsString()
	default: 'T' | 'F';

	@IsNumber()
	shop_name: number;

	/** 사업자 거점 국가 코드 */
	@IsString()
	business_country_code: string;

	@IsString()
	language_code: string;

	@IsString()
	language_name: string;

	@IsString()
	currency_code: string;

	@IsString()
	currency_name: string;

	@IsString()
	base_domain: string;
	@IsString()
	primary_domain: string;

	@IsArray()
	slave_domain: string[];

	@IsString()
	active: 'T' | 'F';

	@IsString()
	timezone: string;

	@IsString()
	timezone_name: string;

	@IsString()
	date_format: string;

	@IsString()
	time_format: string;

	@IsString()
	use_reference_currency: 'T' | 'F';
}
