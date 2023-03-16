import {Inject, Injectable} from '@nestjs/common';
import {concatMap, EMPTY, firstValueFrom, map, of} from 'rxjs';
import {
	Cafe24InterworkService,
	EventOrderRegister,
	WebHookBody,
} from 'src/cafe24Interwork';
import {ErrorResponse} from 'src/common/error';
import {ErrorMetadata} from 'src/common/error-metadata';
import {KakaoAlimTalkService} from 'src/kakao-alim-talk';

@Injectable()
export class Cafe24OrderEventHandler {
	constructor(
		@Inject(KakaoAlimTalkService)
		private alimTalkService: KakaoAlimTalkService,
		@Inject(Cafe24InterworkService)
		private cafe24InterworkService: Cafe24InterworkService
	) {}

	async handle(webHook: WebHookBody<EventOrderRegister>) {
		return await firstValueFrom(
			of(webHook).pipe(
				map((webHook) => {
					return {
						mallId: webHook.resource.mall_id,
						shopNo: webHook.resource.event_shop_no,
						productName: webHook.resource.ordering_product_name,
						cellphone: webHook.resource.buyer_cellphone,
						buyerName: webHook.resource.buyer_name,
					};
				}),
				concatMap(({mallId, productName, cellphone, buyerName}) => {
					return of(mallId).pipe(
						concatMap((id) => {
							return this.cafe24InterworkService.getInterworkInfo(
								id
							);
						}),
						map((interwork) => {
							if (interwork === null) {
								throw new ErrorResponse(
									ErrorMetadata.notFoundInterworkInfo
								);
							}
							return interwork;
						}),
						concatMap((interwork) => {
							if (interwork.issueSetting.issueIntro === false) {
								return EMPTY;
							}
							return of(interwork);
						}),

						map((interwork) => ({
							companyName:
								interwork.partnerInfo?.companyName || mallId,
							productName,
							cellphone: cellphone.replaceAll('-', ''),
							userName: buyerName,
						}))
					);
				}),
				concatMap(({companyName, productName, cellphone, userName}) => {
					return this.alimTalkService.sendIntroDigitalGuarantee(
						cellphone,
						{userName, productName, companyName}
					);
				})
			)
		);
	}
}
