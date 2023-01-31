import {Injectable} from '@nestjs/common';
import Axios, {AxiosInstance} from 'axios';
export interface FindRangePayload {
	from?: string;
	to?: string;
}
@Injectable()
export class VircleCoreAPI {
	private httpAgent: AxiosInstance;

	constructor(baseURL: string) {
		this.httpAgent = Axios.create({
			baseURL,
		});
	}

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
}
