import {
	Controller,
	Get,
	NotFoundException,
	Query,
	UseFilters,
	UseGuards,
} from '@nestjs/common';
import {TransformInstanceToPlain} from 'class-transformer';
import {HttpExceptionFilter} from 'src/filter';
import {MasterAuthGuard} from 'src/guard';
import {Cafe24InterworkService} from './cafe24Interwork.service';

@Controller({path: 'master/interwork'})
@UseFilters(HttpExceptionFilter)
export class MasterCafe24InterworkController {
	constructor(
		private readonly cafe24InterworkService: Cafe24InterworkService
	) {}

	/**
	 * 이 API는 Master 계정을 위해 만들어진 API 입니다.
	 * @param partnershipIdx
	 * @returns
	 */
	@Get()
	@UseGuards(MasterAuthGuard)
	@TransformInstanceToPlain()
	async getInterworkByIdx(@Query('partnershipIdx') partnershipIdx: number) {
		console.log(partnershipIdx, 'hello');
		const interwork =
			await this.cafe24InterworkService.getInterworkInfoByIdx(
				partnershipIdx
			);
		if (!interwork) {
			throw new NotFoundException('NOT_FOUND_INTERWORK_INFO');
		}
		return interwork;
	}
}
