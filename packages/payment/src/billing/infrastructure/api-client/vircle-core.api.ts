import {Injectable} from '@nestjs/common';
import Axios, {AxiosInstance} from 'axios';
import {Transform} from 'class-transformer';
import {
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
} from 'class-validator';
import {EMAIL_TEMPLATE} from './resource';

export class FindRangePayload {
	@IsString()
	@IsOptional()
	@Transform(({value}) => encodeURIComponent(String(value ?? '')))
	from?: string;

	@IsString()
	@IsOptional()
	@Transform(({value}) => encodeURIComponent(String(value ?? '')))
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
	params: Record<string, string>;

	@IsString()
	@IsOptional()
	email?: string;
}

export class PaymentSlackPayload {
	@IsNumber()
	@IsNotEmpty()
	partnerIdx: number;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsObject()
	@IsNotEmpty()
	params: Record<string, string>;
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
		const queryString = Object.entries(payload)
			.map((q) => q.join('='))
			.join('&');

		const {data} = await this.httpAgent.get<{
			total: number;
			confirmed: number;
			completed: number;
			canceled: number;
		}>(`v1/admin/nft/used?${queryString}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
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

	/**
	 * 슬랙 메시지 발송
	 * @param body
	 */
	async sendPaymentSlack(body: PaymentSlackPayload): Promise<any> {
		const {data} = await this.httpAgent.post(
			`v1/common/slack/send/payment`,
			body
		);
		return data;
	}
}
