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
