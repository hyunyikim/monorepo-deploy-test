import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Patch,
	UseGuards,
	UseFilters,
	NotFoundException,
	Query,
} from '@nestjs/common';
import {Cafe24InterworkService} from './cafe24Interwork.service';
import {GetToken, TokenInfo} from '../getToken.decorator';
import {IssueSetting} from './interwork.entity';
import {JwtAuthGuard} from '../guard';
import {HttpExceptionFilter} from '../filter';
import {TransformInstanceToPlain} from 'class-transformer';
import {CategoryListParams} from './cafe24Interwork.service';

@Controller({version: '1', path: 'interwork'})
@UseFilters(HttpExceptionFilter)
export class Cafe24InterworkController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService
	) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	@TransformInstanceToPlain()
	async getInterworkInfoByToken(@GetToken() token: TokenInfo) {
		const interwork =
			await this.cafe24InterworkService.getInterworkInfoByIdx(
				token.partnerIdx
			);
		if (!interwork) {
			throw new NotFoundException('NOT_FOUND_INTERWORK_INFO');
		}
		return interwork;
	}

	@Get(':mallId')
	@TransformInstanceToPlain()
	async getInterworkInfo(@Param('mallId') mallId: string) {
		const interwork = await this.cafe24InterworkService.getInterworkInfo(
			mallId
		);
		if (!interwork) {
			throw new NotFoundException('NOT_FOUND_INTERWORK_INFO');
		}
		return interwork;
	}

	/**
	 *
	 * @param mallId cafe24 Mall Id
	 * @param authCode cafe24에서 제공 해준 authCode
	 * @returns
	 */
	@Post(':mallId')
	@TransformInstanceToPlain()
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
	@TransformInstanceToPlain()
	async confirmInterwork(
		@Param('mallId') mallId: string,
		@GetToken() token: TokenInfo
	) {
		const interwork = await this.cafe24InterworkService.completeInterwork(
			mallId,
			token
		);
		return interwork;
	}

	/**
	 * 해당 mallId로 카페24와 연동하고 승인된 계정이 있는지 확인하는 엔드포인트 입니다.
	 * @param mallId
	 * @returns 연동 되어 있음=true, 연동 안됨=false
	 */
	@Get(':mallId/confirm')
	isConfirmedPartnership(@Param('mallId') mallId: string) {
		return this.cafe24InterworkService.isConfirmed(mallId);
	}

	@Patch(':mallId/setting')
	@UseGuards(JwtAuthGuard)
	@TransformInstanceToPlain()
	async updateInterworkSetting(
		@Param('mallId') mallId: string,
		@Body() setting: Partial<IssueSetting>,
		@GetToken() token: TokenInfo
	) {
		const interwork =
			await this.cafe24InterworkService.changeInterworkSetting(
				mallId,
				token,
				setting
			);
		return interwork;
	}

	@Patch(':mallId/leave-reason')
	@UseGuards(JwtAuthGuard)
	async updateLeaveReason(
		@Param('mallId') mallId: string,
		@Body('reasons') reasons: string
	) {
		await this.cafe24InterworkService.changeLeaveReason(mallId, reasons);
		return;
	}

	@Get(':mallId/categories')
	getCategories(
		@Param('mallId') mallId: string,
		@Query() query: Partial<CategoryListParams>
	) {
		const {limit = 100, depth, offset = 0, name} = query;
		return this.cafe24InterworkService.getCategories(mallId, {
			limit,
			depth,
			offset,
			name,
		});
	}
}