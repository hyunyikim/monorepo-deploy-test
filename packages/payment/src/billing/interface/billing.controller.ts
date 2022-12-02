import {Body, Controller, Post, Get} from '@nestjs/common';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {RegisterBillingDTO} from './dto';
import {RegisterBillingCommand} from '../application/command';

@Controller('billing')
export class BillingController {
	constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

	@Post('/')
	async registerBilling(@Body() dto: RegisterBillingDTO) {
		const registerCommand = new RegisterBillingCommand(
			dto.authKey,
			dto.customerKey
		);
		await this.commandBus.execute(registerCommand);
		return Promise.resolve();
	}

	@Get('/')
	getBilling() {
		return;
	}
}
