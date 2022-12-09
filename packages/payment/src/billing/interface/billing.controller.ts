import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Patch,
	UseGuards,
} from '@nestjs/common';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {
	FindBillingDTO,
	RegisterBillingDTO,
	UnregisterBillingDTO,
	ChangeBillingPlanBodyDTO,
} from './dto';
import {
	RegisterBillingCommand,
	UnregisterBillingCommand,
	ChangeBillingPlanCommand,
} from '../application/command';
import {FindBillingByCustomerKeyQuery} from '../application/query';
import {BillingProps} from 'src/billing/domain/billing';
import {JwtAuthGuard} from '../interface/guards/jwt-auth.guard';
import {GetToken, TokenInfo} from '../interface/getToken.decorator';

@Controller({version: '1', path: 'billing'})
export class BillingController {
	constructor(readonly commandBus: CommandBus, readonly queryBus: QueryBus) {}

	@Post('/')
	@UseGuards(JwtAuthGuard)
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
	@UseGuards(JwtAuthGuard)
	async unregisterBilling(@Param() dto: UnregisterBillingDTO) {
		const {customerKey} = dto;
		const command = new UnregisterBillingCommand(customerKey);
		await this.commandBus.execute(command);
	}

	@Get('/:customerKey')
	@UseGuards(JwtAuthGuard)
	async getBilling(@Param() dto: FindBillingDTO) {
		const {customerKey} = dto;
		const query = new FindBillingByCustomerKeyQuery(customerKey);

		return await this.queryBus.execute<
			FindBillingByCustomerKeyQuery,
			BillingProps
		>(query);
	}

	@Patch('/:customerKey')
	@UseGuards(JwtAuthGuard)
	async changeBillingPlan(
		@GetToken() token: TokenInfo,
		@Body() body: ChangeBillingPlanBodyDTO
	) {
		const {planId} = body;
		const {partnerIdx} = token;

		const command = new ChangeBillingPlanCommand(
			partnerIdx.toString(),
			planId
		);
		await this.commandBus.execute(command);
	}
}
