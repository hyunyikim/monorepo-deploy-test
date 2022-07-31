import {Body, Controller, Get, Post} from '@nestjs/common';
import {Cafe24InterworkService} from './cafe24Interwork.service';

import {
	EventAppDelete,
	EventAppExpire,
	EventOrderRegister,
	EventOrderReturnExchange,
	EventOrderShipping,
	WebHookBody,
} from './cafe24Interwork.dto';

@Controller({path: 'events'})
export class Cafe24EventController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService
	) {}

	@Get('')
	alive() {
		return 'Alive';
	}

	@Post('app/expire')
	handleAppExpireEvent(@Body() webHook: WebHookBody<EventAppExpire>) {
		console.log(webHook);
		return;
	}

	@Post('app/delete')
	handleAppDeleteEvent(@Body() webHook: WebHookBody<EventAppDelete>) {
		console.log(webHook);
		return;
	}

	@Post('order/shipping')
	handleOrderShippingEvent(@Body() webHook: WebHookBody<EventOrderShipping>) {
		console.log(webHook);
		return;
	}

	@Post('order/register')
	handleOrderRegisterEvent(@Body() webHook: WebHookBody<EventOrderRegister>) {
		console.log(webHook);
		return;
	}

	@Post('order/refund')
	handleOrderRefundEvent(
		@Body() webHook: WebHookBody<EventOrderReturnExchange>
	) {
		console.log(webHook);
		return;
	}
}
