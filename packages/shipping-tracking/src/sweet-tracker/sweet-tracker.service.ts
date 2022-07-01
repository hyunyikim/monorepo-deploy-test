import {
	BadRequestException,
	HttpException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import {Expose, plainToInstance, Type} from 'class-transformer';
import Axios, {AxiosError, AxiosInstance} from 'axios';
import {join} from 'path';
import {TrackingInfo} from './type';

export class DeliveryCompanies {
	@Expose({name: 'company'})
	@Type(() => DeliveryCompanies)
	Company: DeliveryCompany[];
}

export class DeliveryCompany {
	/** 회사 이름 */
	@Expose({name: 'name', toPlainOnly: true})
	Name: string;
	/** 회사 코드 */
	@Expose({name: 'code', toPlainOnly: true})
	Code: string;
}

@Injectable()
export class SweetTrackerService {
	private httpClient: AxiosInstance;
	readonly baseURL = 'http://info.sweettracker.co.kr';
	constructor(private apiKey: string) {
		this.httpClient = Axios.create({
			baseURL: this.baseURL,
		});
	}

	async getDeliveryCompanies() {
		const url = join('api/v1', 'companylist');

		const query = {
			t_key: this.apiKey,
		};
		const {data: companyList} =
			await this.httpClient.get<DeliveryCompanies>(url, {
				params: query,
			});
		return plainToInstance(DeliveryCompanies, companyList);
	}

	async getRecommendCompanies(trackingNo: string) {
		try {
			const url = join('api/v1', 'recommend');
			const query = {
				t_key: this.apiKey,
				t_invoice: trackingNo,
			};
			const {data: companyList} =
				await this.httpClient.get<DeliveryCompanies>(url, {
					params: query,
				});
			return plainToInstance(DeliveryCompanies, companyList);
		} catch (error) {
			this.invalidAPIKeyErrorHandle(error);
		}
	}

	async getTrackingInfo(trackingNo: string, companyCode: string) {
		try {
			const url = join('api/v1', 'trackingInfo');
			const query = {
				t_key: this.apiKey,
				t_invoice: trackingNo,
				t_code: companyCode,
			};
			const res = await this.httpClient.get<TrackingInfo>(url, {
				params: query,
			});

			if (res.data['code'] === '104') {
				throw new InvalidTrackingInfo();
			}
			return plainToInstance(TrackingInfo, res.data);
		} catch (error) {
			this.invalidAPIKeyErrorHandle(error);
		}
	}

	async getTrackingInfoHTML(trackingNo: string, companyCode: string) {
		try {
			const url = join('tracking', '1');

			const params = new URLSearchParams();
			params.append('t_key', this.apiKey);
			params.append('t_invoice', trackingNo);
			params.append('t_code', companyCode);

			const {data: html} = await this.httpClient.post<string>(
				url,
				params,
				{
					headers: {
						Host: 'info.sweettracker.co.kr',
						Accept: 'text/html',
						Origin: 'http://info.sweettracker.co.kr',
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			return html;
		} catch (error) {
			this.invalidAPIKeyErrorHandle(error);
		}
	}

	private invalidAPIKeyErrorHandle(error: unknown) {
		if (error instanceof AxiosError && error.response.data) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (error.response.data['code'] === '101') {
				throw new InvalidAPIKey();
			}
		} else if (error instanceof HttpException) {
			throw error;
		}
		throw new InternalServerErrorException();
	}
}

export class InvalidTrackingInfo extends BadRequestException {
	constructor() {
		super('유효하지 않은 운송장번호 이거나 택배사 코드 입니다.');
		this.name = 'INVALID_TRACKING_INFO';
	}
}

export class InvalidAPIKey extends InternalServerErrorException {
	constructor() {
		super('유효하지 않은 API KEY 입니다.');
		this.name = 'INVALID_TRACKING_INFO';
	}
}
