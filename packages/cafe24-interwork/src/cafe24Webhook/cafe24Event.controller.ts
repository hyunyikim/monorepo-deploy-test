import {Body, Controller, Get, Headers, Post, UseGuards} from '@nestjs/common';
import {Cafe24InterworkService} from '../cafe24Interwork/cafe24Interwork.service';
import {ApiKeyGuard} from '../guard';
import {
	EventAppDelete,
	EventBatchOrderShipping,
	EventOrderRegister,
	EventOrderReturnExchange,
	WebHookBody,
} from '../cafe24Interwork';
import {Cafe24EventService} from './cafe24Event.service';
import {ApiHeader} from '@nestjs/swagger';
import {ErrorResponse} from 'src/common/error';
import {ErrorMetadata} from 'src/common/error-metadata';

@Controller({version: '1', path: 'events'})
export class Cafe24EventController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService,
		private readonly cafe24EventService: Cafe24EventService
	) {}

	@Get('')
	alive() {
		throw new ErrorResponse(ErrorMetadata.internalServerError('ERROR'));
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
	@ApiHeader({
		name: 'x-api-key',
		allowEmptyValue: false,
		description: '카페24 api 키',
		required: true,
	})
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
	handleOrderRegisterEvent(@Body() webHook: WebHookBody<EventOrderRegister>) {
		// const result = await this.cafe24OrderEventHandler.handle(webHook);
		// return result;
		return 'OK';
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
