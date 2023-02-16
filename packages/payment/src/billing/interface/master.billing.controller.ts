import {
	Body,
	Controller,
	Post,
	UseGuards,
	UseFilters,
	UnauthorizedException,
	Inject,
	Patch,
} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {
	AdminRegisterEnterpriseBillingBodyDTO,
	AdminRegisterFreeBillingBodyDTO,
} from './dto';
import {
	RegisterEnterpriseBillingCommand,
	RegisterFreeBillingCommand,
} from '../application/command';
import {ADMIN_TYPE, JwtAuthGuard} from './guards/jwt-auth.guard';
import {GetToken, TokenInfo} from './getToken.decorator';
import {HttpExceptionFilter} from './httpException.filter';
import {PlanBillingRepository} from '../infrastructure/respository';
import {BillingRepository} from '../domain/repository';
import {VircleCoreApi} from '../infrastructure/api-client/vircle-core.api';
import {BillingInterface} from './billing.controller';

export interface BulkResult {
	total: number;
	success: number;
	failure: number;
	error?: {
		idx: number;
		message?: string;
	}[];
}

/**
 * 정기결제 API 컨트롤러
 */
@Controller({version: '1', path: 'master/billing'})
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class MasterBillingController {
	constructor(
		readonly commandBus: CommandBus,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(VircleCoreApi)
		private readonly vircleCoreApi: VircleCoreApi
	) {}

	/**
	 * 무료플랜 부여 API
	 *
	 * @param partnerIdx
	 * @param planMonth
	 * @param planLimit
	 * @param token
	 */
	@Post('/free')
	async registerFreeBilling(
		@Body()
		{partnerIdx, planMonth, planLimit}: AdminRegisterFreeBillingBodyDTO,
		@GetToken() token: TokenInfo
	) {
		if (
			![ADMIN_TYPE.MASTER, ADMIN_TYPE.MANAGER].includes(token.adminType)
		) {
			throw new UnauthorizedException();
		}

		// 무료 플랜 생성 커맨드 실행
		const registerCommand = new RegisterFreeBillingCommand(
			partnerIdx,
			planMonth,
			planLimit
		);
		return await this.commandBus.execute(registerCommand);
	}

	/**
	 * 대량 무료플랜 부여 API
	 *
	 * @param params
	 * @param token
	 */
	@Post('/free/bulk')
	async bulkRegisterFreeBilling(
		@Body() params: AdminRegisterFreeBillingBodyDTO[],
		@GetToken() token: TokenInfo
	) {
		if (
			![ADMIN_TYPE.MASTER, ADMIN_TYPE.MANAGER].includes(token.adminType)
		) {
			throw new UnauthorizedException();
		}

		const result: BulkResult = {
			total: params.length,
			success: 0,
			failure: 0,
		};

		for await (const param of params) {
			const {partnerIdx, planMonth, planLimit} = param;

			try {
				// 무료 플랜 생성 커맨드 실행
				const registerCommand = new RegisterFreeBillingCommand(
					partnerIdx,
					planMonth,
					planLimit
				);
				await this.commandBus.execute(registerCommand);
				result.success += 1;
			} catch (error) {
				result.failure += 1;
				if (!result.error) {
					result.error = [];
				}
				result.error.push({
					idx: partnerIdx,
					message: error instanceof Error ? error.message : undefined,
				});
			}
		}

		return result;
	}

	/**
	 * 엔터프라이즈 플랜 부여 API
	 *
	 * @param partnerIdx
	 * @param token
	 */
	@Post('/enterprise')
	async registerEnterpriseBilling(
		@Body()
		{partnerIdx}: AdminRegisterEnterpriseBillingBodyDTO,
		@GetToken() token: TokenInfo
	) {
		if (
			![ADMIN_TYPE.MASTER, ADMIN_TYPE.MANAGER].includes(token.adminType)
		) {
			throw new UnauthorizedException();
		}

		// 엔터프라이즈 플랜 생성 커맨드 실행
		const registerCommand = new RegisterEnterpriseBillingCommand(
			partnerIdx
		);
		return await this.commandBus.execute(registerCommand);
	}

	/**
	 * 플랜정보 업데이트 일괄 반영
	 *
	 * @param token
	 */
	@Patch('/plan/bulk')
	async bulkUpdatePlan(@GetToken() token: TokenInfo) {
		if (
			![ADMIN_TYPE.MASTER, ADMIN_TYPE.MANAGER].includes(token.adminType)
		) {
			throw new UnauthorizedException();
		}

		// 회원 전체 빌링 조회
		const billings = await this.billingRepo.getAll(true);

		const result: BulkResult = {
			total: billings.length,
			success: 0,
			failure: 0,
		};

		for await (const billing of billings) {
			const billingProps = billing.properties();

			try {
				await this.vircleCoreApi.updateUsedPlanForMaster(
					token.token,
					billingProps.partnerIdx,
					new BillingInterface(billingProps)
				);
				result.success += 1;
			} catch (error) {
				result.failure += 1;
				if (!result.error) {
					result.error = [];
				}
				result.error.push({
					idx: billingProps.partnerIdx,
					message: error instanceof Error ? error.message : undefined,
				});
			}
		}

		return result;
	}
}
