import {Body, Controller, Delete, Get, Param, Post} from '@nestjs/common';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {FindBillingDTO, RegisterBillingDTO, UnregisterBillingDTO} from './dto';
import {
	RegisterBillingCommand,
	UnregisterBillingCommand,
} from '../application/command';
import {FindBillingByCustomerKeyQuery} from '../application/query';
import {BillingProps} from 'src/billing/domain/billing';

@Controller('billing')
export class BillingController {
	constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

	@Post('/')
	async registerBilling(
		@Body() {authKey, customerKey, planId}: RegisterBillingDTO
	) {
		const registerCommand = new RegisterBillingCommand(
			authKey,
			customerKey,
			planId
		);
		await this.commandBus.execute(registerCommand);
	}

	@Delete('/:customerKey')
	async unregisterBilling(@Param() dto: UnregisterBillingDTO) {
		const {customerKey} = dto;
		const command = new UnregisterBillingCommand(customerKey);
		await this.commandBus.execute(command);
	}

	@Get('/:customerKey')
	async getBilling(@Param() dto: FindBillingDTO) {
		const {customerKey} = dto;
		const query = new FindBillingByCustomerKeyQuery(customerKey);

		return await this.queryBus.execute<
			FindBillingByCustomerKeyQuery,
			BillingProps
		>(query);
	}
}
