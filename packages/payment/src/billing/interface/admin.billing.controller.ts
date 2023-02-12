import {
	Body,
	Controller,
	Post,
	UseGuards,
	UseFilters,
	UnauthorizedException,
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

/**
 * 정기결제 API 컨트롤러
 */
@Controller({version: '1', path: 'admin/billing'})
@UseFilters(HttpExceptionFilter)
@UseGuards(JwtAuthGuard)
export class AdminBillingController {
	constructor(readonly commandBus: CommandBus) {}

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
}
