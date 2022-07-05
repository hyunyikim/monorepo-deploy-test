import {
	BadRequestException,
	ForbiddenException,
	HttpException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import {plainToInstance} from 'class-transformer';
import Axios, {AxiosError, AxiosInstance} from 'axios';
import {join} from 'path';
import {DeliveryCompanies, RecommendCompanies, TrackingInfo} from './type';

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
		try {
			const url = join('api/v1', 'companylist');

			const query = {
				t_key: this.apiKey,
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

	async getRecommendCompanies(trackingNo: string) {
		try {
			const url = join('api/v1', 'recommend');
			const query = {
				t_key: this.apiKey,
				t_invoice: trackingNo,
			};
			const {data: companyList} =
				await this.httpClient.get<RecommendCompanies>(url, {
					params: query,
				});
			return plainToInstance(RecommendCompanies, companyList);
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

			switch (res.data['code']) {
				case '101':
					throw new InvalidAPIKey();
				case '102':
					throw new ExpiredAPIKey();
				case '103':
					throw new ExceedUsage();
				case '104':
					throw new InvalidTrackingInfo();
				default:
					break;
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
			switch (error.response.data['code']) {
				case '101':
					throw new InvalidAPIKey();
				case '102':
					throw new ExpiredAPIKey();
				case '103':
					throw new ExceedUsage();
				case '104':
					throw new InvalidTrackingInfo();
				default:
					break;
			}
		} else if (error instanceof HttpException) {
			throw error;
		}
		throw new InternalServerErrorException();
	}
}

/** CODE 101 */
export class InvalidAPIKey extends InternalServerErrorException {
	constructor() {
		super('유효하지 않은 API KEY 입니다.');
		this.name = 'INVALID_TRACKING_INFO';
	}
}

/** CODE 102 */
export class ExpiredAPIKey extends InternalServerErrorException {
	constructor() {
		super('만료된 API KEY 입니다.');
		this.name = 'EXPIRED_API_KEY';
	}
}

/** CODE 103 */
export class ExceedUsage extends InternalServerErrorException {
	constructor() {
		super('사용량을 초과했습니다.');
		this.name = 'EXCEED_CAPACITY';
	}
}

/** CODE 104 */
export class InvalidTrackingInfo extends BadRequestException {
	constructor() {
		super('유효하지 않은 운송장번호 이거나 택배사 코드 입니다.');
		this.name = 'INVALID_TRACKING_INFO';
	}
}

export class RequestLimitExceed extends ForbiddenException {
	constructor() {
		super('유효하지 않은 API KEY 입니다.');
		this.name = 'REQUEST_LIMIT_EXCEED';
	}
}
