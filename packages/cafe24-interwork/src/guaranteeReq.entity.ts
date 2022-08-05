import {IsNumber, IsObject, IsString} from 'class-validator';
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

	@IsObject()
	webhook: WebHookBody<EventOrderShipping>;

	@IsObject()
	product: Product | null;
}
