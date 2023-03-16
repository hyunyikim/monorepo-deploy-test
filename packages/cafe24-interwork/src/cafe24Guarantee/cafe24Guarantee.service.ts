import {Inject, Injectable} from '@nestjs/common';
import {map, mergeMap, of, lastValueFrom} from 'rxjs';
import {Cafe24InterworkService} from 'src/cafe24Interwork';
import {ErrorResponse} from 'src/common/error';
import {ErrorMetadata} from 'src/common/error-metadata';
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
					throw new ErrorResponse(
						ErrorMetadata.notFoundInterworkInfo
					);
				}
				return interwork;
			}),
			mergeMap((interwork) =>
				this.repo.getRequest(reqIdx, interwork.mallId)
			),
			map((req) => {
				if (!req) {
					throw new ErrorResponse(
						ErrorMetadata.notFoundGuaranteeRequest
					);
				}
				return req;
			})
		);

		return await lastValueFrom(req$);
	}
}
