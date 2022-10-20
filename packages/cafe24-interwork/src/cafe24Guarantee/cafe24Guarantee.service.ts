import {
	Inject,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import {map, mergeMap, of, lastValueFrom} from 'rxjs';
import {Cafe24InterworkService} from 'src/cafe24Interwork';
import {GuaranteeRequestRepository} from 'src/dynamo';

@Injectable()
export class Cafe24GuaranteeService {
	constructor(
		@Inject(GuaranteeRequestRepository)
		private readonly repo: GuaranteeRequestRepository,
		@Inject(Cafe24InterworkService)
		private readonly interworkService: Cafe24InterworkService
	) {}

	async getGuaranteeRequestInfo(reqIdx: number, partnerIdx: number) {
		const req$ = of(partnerIdx).pipe(
			mergeMap((idx) => this.interworkService.getInterworkInfoByIdx(idx)),
			map((interwork) => {
				if (!interwork) {
					throw new UnauthorizedException(
						'NOT_ALLOWED_RESOURCE_ACCESS'
					);
				}
				return interwork;
			}),
			mergeMap((interwork) =>
				this.repo.getRequest(reqIdx, interwork.mallId)
			),
			map((req) => {
				if (!req) {
					throw new NotFoundException('NOT_FOUND_GUARANTEE_REQUEST');
				}
				return req;
			})
		);

		return await lastValueFrom(req$);
	}
}
