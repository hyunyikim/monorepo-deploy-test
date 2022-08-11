import {IsNumber, IsObject, IsOptional, IsString} from 'class-validator';
import {Product} from './Cafe24ApiService';
import {WebHookBody, EventOrderShipping} from './cafe24Interwork.dto';

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

	@IsString()
	eventShopNo: string;

	@IsString()
	orderId: string;

	@IsObject()
	webhook: WebHookBody<EventOrderShipping>;

	@IsString()
	traceId: string;

	@IsObject()
	product: Product | null;

	@IsOptional()
	@IsString()
	canceledAt?: string;

	@IsString()
	cancelTraceId?: string;
}
