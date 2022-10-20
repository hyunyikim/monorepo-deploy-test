import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {GetToken, TokenInfo} from 'src/getToken.decorator';
import {JwtAuthGuard} from 'src/guard';
import {Cafe24GuaranteeService} from './cafe24Guarantee.service';

@Controller('guarantees')
export class Cafe24GuaranteeController {
	constructor(
		private readonly cafe24GuaranteeService: Cafe24GuaranteeService
	) {}

	@Get(':reqIdx')
	@UseGuards(JwtAuthGuard)
	getReqInfo(@GetToken() token: TokenInfo, @Param(':reqIdx') reqIdx: string) {
		const guaranteeReq =
			this.cafe24GuaranteeService.getGuaranteeRequestInfo(
				+reqIdx,
				token.partnerIdx
			);
		return guaranteeReq;
	}
}
