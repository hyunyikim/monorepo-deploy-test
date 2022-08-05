import {Body, Controller, Get, Headers, Post, UseGuards} from '@nestjs/common';
import {Cafe24InterworkService} from './cafe24Interwork.service';
import {ApiKeyGuard} from './apiKeyGuard';
import {
	EventAppDelete,
	EventAppExpire,
	EventOrderRegister,
	EventOrderReturnExchange,
	EventOrderShipping,
	WebHookBody,
} from './cafe24Interwork.dto';
import {Cafe24EventService} from './cafe24Event.service';

@Controller({path: 'events'})
export class Cafe24EventController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService,
		private readonly cafe24EventService: Cafe24EventService
	) {}

	@Get('')
	alive() {
		return 'Alive';
	}

	@Post('app/expire')
	@UseGuards(ApiKeyGuard)
	handleAppExpireEvent(@Body() webHook: WebHookBody<EventAppExpire>) {
		console.log(webHook);
		return;
	}

	@Post('app/delete')
	@UseGuards(ApiKeyGuard)
	async handleAppDeleteEvent(@Body() webHook: WebHookBody<EventAppDelete>) {
		const mallId = webHook.resource.mall_id;
		await this.cafe24InterworkService.inactivateInterwork(mallId);
		return 'OK';
	}

	@Post('order/shipping')
	@UseGuards(ApiKeyGuard)
	async handleOrderShippingEvent(
		@Headers('x-trace-id') traceId: string,
		@Body() webHook: WebHookBody<EventOrderShipping>
	) {
		await this.cafe24EventService.handleShippingEvent(traceId, webHook);

		return 'OK';
	}

	@Post('order/register')
	@UseGuards(ApiKeyGuard)
	handleOrderRegisterEvent(@Body() webHook: WebHookBody<EventOrderRegister>) {
		console.log(webHook);
		return;
	}

	@Post('order/refund')
	@UseGuards(ApiKeyGuard)
	handleOrderRefundEvent(
		@Body() webHook: WebHookBody<EventOrderReturnExchange>
	) {
		console.log(webHook);
		return;
	}
}
