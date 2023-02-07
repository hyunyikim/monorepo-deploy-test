import axios, {AxiosInstance} from 'axios';
import {
	BadRequestException,
	InternalServerErrorException,
} from '@nestjs/common';
import {BillingResource, PaymentResource} from './resource';

export const TOSS_PAYMENTS_API_BASE_URL = 'https://api.tosspayments.com/v1';
export const TOSS_PAYMENTS_TEST_KEY = 'test_sk_Kma60RZblrq66aPokGb8wzYWBn14';
export const AUTH_TYPE = 'Basic';

export interface TossPaymentsConfig {
	/** 시크릿 키는 토스페이먼츠 API를 호출할 때 사용되는 키입니다. 노출되면 안됩니다. */
	secretKey: string;
	/** 토스페이먼츠 API를 호출할 https endpoint 입니다. */
	baseURL: string;
}

export class TossPaymentsAPI {
	readonly payments: PaymentResource;
	readonly billing: BillingResource;
	readonly httpClient: AxiosInstance;
	constructor(config: TossPaymentsConfig) {
		const {secretKey, baseURL} = config;
		const base64key = Buffer.from(secretKey + ':', 'utf-8').toString(
			'base64'
		);

		this.httpClient = axios.create({
			baseURL,
			headers: {
				'Content-Type': `application/json`,
				'Accept-Encoding': 'application/json',
				Authorization: `${AUTH_TYPE} ${base64key}`,
			},
			responseType: 'json',
			validateStatus: (status) => {
				return status >= 200 && status < 500;
			},
		});

		this.httpClient.interceptors.response.use(
			(response) => {
				if (response.status !== 200) {
					throw new BadRequestException(response.data);
				}
				return response;
			},
			(error) => {
				throw new InternalServerErrorException(
					'일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
				);
			}
		);

		this.billing = new BillingResource(this.httpClient);
		this.payments = new PaymentResource(this.httpClient);
	}
}
