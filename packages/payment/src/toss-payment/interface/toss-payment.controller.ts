import {Controller, Post} from '@nestjs/common';

@Controller('toss-payments')
export class TossPaymentController {
	@Post()
	registerBillingCard() {
		return null;
	}
}
