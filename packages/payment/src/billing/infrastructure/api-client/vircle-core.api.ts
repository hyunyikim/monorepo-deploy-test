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
import {BillingProps, PricePlanProps} from '../../domain';
import {BillingInterface} from '../../interface/billing.controller';

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
	 * 이용 플랜 업데이트
	 * @param token
	 * @param billing
	 */
	async updateUsedPlan(
		token: string,
		billing: BillingInterface
	): Promise<any> {
		const params = {
			payPlan: billing.pricePlan.planName,
			payPlanId: billing.pricePlan.planId,
			planStartDate: billing.planStartedAt || '',
			planExpireDate: billing.planExpireDate || '',
			payLimit: billing.pricePlan.planLimit,
		};

		return await this.httpAgent.patch(
			`v1/admin/partnerships/plan`,
			params,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	}

	/**
	 * 이용 플랜 업데이트 (관리자)
	 * @param token
	 * @param partnerIdx
	 * @param billing
	 */
	async updateUsedPlanForMaster(
		token: string,
		partnerIdx: number,
		billing: BillingInterface
	): Promise<any> {
		const params = {
			partnerIdx,
			payPlan: billing.pricePlan.planName,
			payPlanId: billing.pricePlan.planId,
			planStartDate: billing.planStartedAt || '',
			planExpireDate: billing.planExpireDate || '',
			payLimit: billing.pricePlan.planLimit,
		};

		return await this.httpAgent.patch(
			`v1/master/partnerships/plan`,
			params,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
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
