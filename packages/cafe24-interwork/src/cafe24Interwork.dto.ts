import {} from 'class-transformer';
import {IsISO8601, IsNumber, IsObject, IsString} from 'class-validator';

export class WebHookBody<T> {
	@IsNumber()
	event_no: number;
	@IsObject()
	resource: T;
}

abstract class Resource {
	@IsString()
	mall_id: string;
}

abstract class App extends Resource {
	@IsString()
	client_id: string;

	@IsString()
	app_name: string;
}

export class EventAppDelete extends App {
	@IsISO8601()
	deleted_date: string;
}

export class EventAppExpire extends App {
	@IsISO8601()
	expired_date: string;
}

abstract class Order extends Resource {
	event_shop_no: string;

	order_id: string;
	/** 결제 PG사 이름 */
	payment_gateway_name: string;
	currency: 'KRW' | 'USD' | 'JPY';
	order_date: string;
	order_place_name: string;
	member_id: string;
	member_authentication: 'T' | 'F' | 'B' | 'J';
	buyer_name: string;
	buyer_email: string;
	buyer_phone: string;
	buyer_cellphone: string;
	group_no_when_ordering: string;
	order_from_mobile: 'T' | 'F';
	paid: 'T' | 'F';
	payment_date: string;
	billing_name: string;
	bank_code: string | null;
	bank_account_no: string;
	payment_method: string;
	use_escrow: string;
	easypay_name: string;
	order_price_amount: string;
	membership_discount_amount: string;
	actual_payment_amount: string;
	mileage_spent_amount: string;
	cancel_date: string | null;
	shipping_fee: string;
	shipping_type: string;
	shipping_status: string;
	wished_delivery_date: string;
	wished_delivery_time: string | null;
	store_pickup: string;
	shipping_message: string;
	order_place_id: string;
	ordering_product_code: string;
	ordering_product_name: string;
}

/** 쇼핑몰에 주문이 접수된 경우 (90023) */
export class EventOrderRegister extends Order {}

/** 쇼핑몰에 접수된 주문의 배송상태가 변경된 경우 (90024) */
export class EventOrderShipping extends Order {
	ordering_product_code: string;
	ordering_product_name: string;
	return_confirmed_date: null;
}

/**쇼핑몰에 접수된 주문의 반품상태가 변경된 경우 (90027, 90028) */
export class EventOrderReturnExchange extends Order {
	ordering_product_code: string;
	ordering_product_name: string;
}
