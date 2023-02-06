import {Inject, Injectable} from '@nestjs/common';
import {RegularPaymentService} from '../service/payment.service';

@Injectable()
export class BillingSaga {
	constructor(
		@Inject(RegularPaymentService)
		private readonly paymentService: RegularPaymentService
	) {}
}
