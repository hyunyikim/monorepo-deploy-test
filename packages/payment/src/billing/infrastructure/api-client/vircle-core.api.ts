import {Injectable} from '@nestjs/common';
import Axios, {AxiosInstance} from 'axios';
import {IsNotEmpty, IsNumber, IsObject, IsString} from 'class-validator';
import {EMAIL_TEMPLATE} from './resource';

export interface FindRangePayload {
	from?: string;
	to?: string;
}

export class PaymentEmailPayload {
	@IsNumber()
	@IsNotEmpty()
	partnerIdx: number;

	@IsString()
	@IsNotEmpty()
	template: EMAIL_TEMPLATE;

	@IsObject()
	@IsNotEmpty()
	params: Record<string, string | number>;
}

@Injectable()
export class VircleCoreApi {
	private httpAgent: AxiosInstance;

	constructor(baseURL: string) {
		this.httpAgent = Axios.create({
			baseURL,
		});
	}

	/**
	 * 개런티 발급량 조회
	 * @param token
	 * @param payload
	 */
	async getUsedGuaranteeCount(
		token: string,
		payload: FindRangePayload
	): Promise<any> {
		const {data} = await this.httpAgent.get<{
			total: number;
			confirmed: number;
			completed: number;
			canceled: number;
		}>(
			`v1/admin/nft/used?${Object.entries(payload)
				.map((q) => q.join('='))
				.join('&')}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return data;
	}

	/**
	 * 이메일 발송
	 * @param body
	 */
	async sendPaymentEmail(body: PaymentEmailPayload): Promise<any> {
		const {data} = await this.httpAgent.post(`v1/common/mail/send`, body);
		return data;
	}
}
