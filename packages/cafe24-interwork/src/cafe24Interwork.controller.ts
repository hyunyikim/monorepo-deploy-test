import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Patch,
	UseGuards,
	Req,
} from '@nestjs/common';
import {Cafe24InterworkService} from './cafe24Interwork.service';
import {GetToken, TokenInfo} from './getToken.decorator';
import {IssueSetting} from './interwork.entity';
import {JwtAuthGuard} from './jwtGuard/jwtAuth.guard';

@Controller({path: 'interwork'})
export class Cafe24InterworkController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService
	) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	getInterworkInfoByToken(@GetToken() token: TokenInfo) {
		return this.cafe24InterworkService.getInterworkInfoByIdx(
			token.partnerIdx
		);
	}

	@Get('all')
	@UseGuards(JwtAuthGuard)
	getInterworkAll(@GetToken() token: TokenInfo) {
		return this.cafe24InterworkService.getAll();
	}

	@Get(':mallId')
	getInterworkInfo(@Param('mallId') mallId: string) {
		return this.cafe24InterworkService.getInterworkInfo(mallId);
	}

	@Post(':mallId')
	async initInterwork(
		@Param('mallId') mallId: string,
		@Body('authCode') authCode: string
	) {
		const interwork = await this.cafe24InterworkService.requestNewInterwork(
			mallId,
			authCode
		);
		return interwork;
	}

	/**
	 *
	 * @param mallId cafe24 Mall Id
	 * @param token 파싱된 JWT 정보
	 * @returns
	 */
	@Post(':mallId/confirm')
	@UseGuards(JwtAuthGuard)
	async confirmInterwork(
		@Param('mallId') mallId: string,
		@GetToken() token: TokenInfo
	) {
		const interwork = await this.cafe24InterworkService.completeInterwork(
			mallId,
			token.partnerIdx
		);
		return interwork;
	}

	/**
	 * 해당 mallId로 카페24와 연동하고 승인된 계정이 있는지 확인하는 엔드포인트 입니다.
	 * @param mallId
	 * @returns
	 */
	@Get(':mallId/confirm')
	isConfirmedPartnership(@Param('mallId') mallId: string) {
		return this.cafe24InterworkService.isConfirmed(mallId);
	}

	@Patch(':mallId/setting')
	@UseGuards(JwtAuthGuard)
	async updateInterworkSetting(
		@Param('mallId') mallId: string,
		@Body() setting: IssueSetting
	) {
		const interwork =
			await this.cafe24InterworkService.changeInterworkSetting(
				mallId,
				setting
			);
		return interwork;
	}
}
