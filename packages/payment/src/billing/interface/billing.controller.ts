import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Patch,
	UseGuards,
	UnauthorizedException,
} from '@nestjs/common';
import {CommandBus, QueryBus} from '@nestjs/cqrs';
import {
	FindBillingDTO,
	RegisterBillingBodyDTO,
	UnregisterBillingDTO,
	ChangeBillingPlanBodyDTO,
	ChangeBillingPlanParamDTO,
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
		@Body() {authKey, customerKey, planId}: RegisterBillingBodyDTO
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
	async getBilling(
		@Param() dto: FindBillingDTO,
		@GetToken() token: TokenInfo
	) {
		const {customerKey} = dto;
		if (customerKey !== token.partnerIdx.toString()) {
			throw new UnauthorizedException('NOT_ALLOWED_RESOURCE_ACCESS');
		}
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
		@Param() params: ChangeBillingPlanParamDTO,
		@Body() body: ChangeBillingPlanBodyDTO
	) {
		const {partnerIdx} = token;
		if (params.customerKey !== partnerIdx.toString()) {
			throw new UnauthorizedException('NOT_ALLOWED_RESOURCE_ACCESS');
		}
		const command = new ChangeBillingPlanCommand(
			partnerIdx.toString(),
			body.planId
		);
		await this.commandBus.execute(command);
	}
}
