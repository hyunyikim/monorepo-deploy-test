import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Version,
	Patch,
} from '@nestjs/common';
import {Cafe24InterworkService} from './cafe24Interwork.service';
import {IssueSetting} from './interwork.entity';

@Controller('cafe24')
export class Cafe24InterworkController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService
	) {}

	@Version('1')
	@Get('interwork')
	getInterworkInfoByToken(partnerIdx: number) {
		return this.cafe24InterworkService.getInterworkInfoByIdx(partnerIdx);
	}

	@Version('1')
	@Get('interwork/:mallId')
	getInterworkInfo(@Param('mallId') mallId: string) {
		return this.cafe24InterworkService.getInterworkInfo(mallId);
	}

	@Post('interwork/:mallId/init')
	async initInterwork(
		@Param('mallId') mallId: string,
		@Body('authCode') authCode: string
	) {
		const interwork = await this.cafe24InterworkService.createNewInterwork(
			mallId,
			authCode
		);
		return interwork;
	}

	@Patch('interwork/:mallId/partner')
	async updateInterworkPartner(
		@Param('mallId') mallId: string,
		@Body('partnerIdx') idx: number
	) {
		const interwork = await this.cafe24InterworkService.completeInterwork(
			mallId,
			idx
		);
		return interwork;
	}

	@Patch('interwork/:mallId/setting')
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
