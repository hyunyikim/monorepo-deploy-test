import {
	Body,
	Controller,
	Get,
	Headers,
	InternalServerErrorException,
	Post,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import {Cafe24InterworkService} from './cafe24Interwork.service';
import {ApiKeyGuard} from './guard';
import {
	EventAppDelete,
	EventBatchOrderShipping,
	EventOrderRegister,
	EventOrderReturnExchange,
	EventOrderShipping,
	WebHookBody,
} from './cafe24Interwork.dto';
import {Cafe24EventService} from './cafe24Event.service';
import {HttpExceptionFilter} from './filter';

@Controller({version: '1', path: 'events'})
@UseFilters(HttpExceptionFilter)
export class Cafe24EventController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService,
		private readonly cafe24EventService: Cafe24EventService
	) {}

	@Get('')
	alive() {
		throw new InternalServerErrorException('error');
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
		await this.cafe24EventService.handleShippingWebhook(traceId, webHook);
		return 'OK';
	}

	@Post('order/shipping/batch')
	@UseGuards(ApiKeyGuard)
	async handleBatchOrderShippingEvent(
		@Headers('x-trace-id') traceId: string,
		@Body() webHook: WebHookBody<EventBatchOrderShipping>
	) {
		await this.cafe24EventService.handleBachShippingWebHook(
			traceId,
			webHook
		);
		return 'OK';
	}

	@Post('order/register')
	@UseGuards(ApiKeyGuard)
	handleOrderRegisterEvent(@Body() webHook: WebHookBody<EventOrderRegister>) {
		console.log(webHook);
		return;
	}

	@Post('order/return')
	@UseGuards(ApiKeyGuard)
	handleOrderRefundRequestEvent(
		// @Headers('x-trace-id') traceId: string,
		@Body() webHook: WebHookBody<EventOrderReturnExchange>
	) {
		console.log(webHook);
		return 'OK';
	}
}
