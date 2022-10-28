import {Inject, Injectable, UnauthorizedException} from '@nestjs/common';
import {
	concatMap,
	EMPTY,
	firstValueFrom,
	map,
	mergeAll,
	of,
	UnsubscriptionError,
} from 'rxjs';
import {Cafe24API} from 'src/cafe24Api';
import {
	Cafe24InterworkService,
	EventOrderRegister,
	WebHookBody,
} from 'src/cafe24Interwork';
import {KakaoAlimTalkService} from 'src/kakao-alim-talk';
import {TokenRefresher} from 'src/tokenRefresher';

@Injectable()
export class Cafe24OrderEventHandler {
	constructor(
		@Inject(KakaoAlimTalkService)
		private alimTalkService: KakaoAlimTalkService,
		@Inject(Cafe24API)
		private cafe24Api: Cafe24API,
		@Inject(Cafe24InterworkService)
		private cafe24InterworkService: Cafe24InterworkService,
		@Inject(TokenRefresher) private tokenRefresher: TokenRefresher
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
							if (interwork === null)
								throw new UnauthorizedException('');

							return interwork;
						}),
						concatMap((interwork) => {
							if (interwork.issueSetting.issueIntro === false) {
								return EMPTY;
							}
							return this.tokenRefresher.refreshAccessToken(
								interwork
							);
						}),
						concatMap((interwork) =>
							this.cafe24Api.getStoreInfo(
								interwork.mallId,
								interwork.accessToken.access_token
							)
						),
						map((store) => ({
							companyName: store.shop_name,
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
