import {IsNumber, IsObject, IsOptional, IsString} from 'class-validator';
import {OrderItem, Product} from './Cafe24ApiService';
import {
	WebHookBody,
	EventOrderShipping,
	EventBatchOrderShipping,
} from './cafe24Interwork.dto';

export class GuaranteeRequest {
	/** Partition Key */
	@IsNumber()
	reqIdx: number;

	/** SortKey */
	@IsString()
	productCode: string;

	@IsString()
	reqAt: string;

	@IsNumber()
	reqState: number;

	@IsString()
	mallId: string;

	@IsNumber()
	eventShopNo: number;

	@IsString()
	orderId: string;

	@IsObject()
	webhook: WebHookBody<EventOrderShipping | EventBatchOrderShipping>;

	@IsString()
	traceId: string;

	@IsString()
	orderItemCode: string;

	@IsObject()
	orderItem: OrderItem;

	@IsOptional()
	@IsString()
	canceledAt?: string;

	@IsString()
	cancelTraceId?: string;

	@IsObject()
	productInfo: Product;
}
