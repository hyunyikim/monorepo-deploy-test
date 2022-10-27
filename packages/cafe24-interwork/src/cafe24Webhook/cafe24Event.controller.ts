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
import {Cafe24InterworkService} from '../cafe24Interwork/cafe24Interwork.service';
import {ApiKeyGuard} from '../guard';
import {
	EventAppDelete,
	EventBatchOrderShipping,
	EventOrderRegister,
	EventOrderReturnExchange,
	EventOrderShipping,
	WebHookBody,
} from '../cafe24Interwork';
import {Cafe24EventService} from './cafe24Event.service';
import {HttpExceptionFilter} from '../filter';
import {Cafe24OrderEventHandler} from './cafe24OrderEvent.handler';

@Controller({version: '1', path: 'events'})
@UseFilters(HttpExceptionFilter)
export class Cafe24EventController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService,
		private readonly cafe24EventService: Cafe24EventService,
		private readonly cafe24OrderEventHandler: Cafe24OrderEventHandler
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
		return {
			mallId,
		};
	}

	@Post('order/shipping')
	@UseGuards(ApiKeyGuard)
	async handleOrderShippingEvent(
		@Headers('x-trace-id') traceId: string,
		@Body() webHook: WebHookBody<EventBatchOrderShipping>
	) {
		return await this.cafe24EventService.handleDeliveryHook(
			traceId,
			webHook
		);
	}

	@Post('order/shipping/batch')
	@UseGuards(ApiKeyGuard)
	async handleBatchOrderShippingEvent(
		@Headers('x-trace-id') traceId: string,
		@Body() webHook: WebHookBody<EventBatchOrderShipping>
	) {
		return await this.cafe24EventService.handleDeliveryHook(
			traceId,
			webHook
		);
	}

	@Post('order/register')
	@UseGuards(ApiKeyGuard)
	async handleOrderRegisterEvent(
		@Body() webHook: WebHookBody<EventOrderRegister>
	) {
		const result = await this.cafe24OrderEventHandler.handle(webHook);
		return result;
	}

	@Post('order/return')
	@UseGuards(ApiKeyGuard)
	handleOrderRefundRequestEvent(
		// @Headers('x-trace-id') traceId: string,
		@Body() webHook: WebHookBody<EventOrderReturnExchange>
	) {
		return 'OK';
	}
}
