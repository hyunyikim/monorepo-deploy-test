import {Inject, Injectable} from '@nestjs/common';
import {KaKaoAlimTalkApi} from './kakao-alim-talk-api/kakao-alim-talk-api';

@Injectable()
export class KakaoAlimTalkService {
	constructor(@Inject(KaKaoAlimTalkApi) private apiAgent: KaKaoAlimTalkApi) {}

	async sendIntroDigitalGuarantee(
		phoneNo: string,
		params: {
			companyName: string;
			userName: string;
			productName: string;
		}
	) {
		const templateCode = 'NFT_B2B_INFO';
		const result = await this.apiAgent.sendMessages(templateCode, [
			{
				phoneNo,
				params: {
					company_nm: params.companyName,
					user_nm: params.userName,
					pro_nm: params.productName,
				},
			},
		]);
		return result.header;
	}
}
