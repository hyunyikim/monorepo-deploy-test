import {Injectable} from '@nestjs/common';
import {TransformPlainToInstance} from 'class-transformer';
import {Nft} from '@vircle/entity';
import Axios, {AxiosInstance} from 'axios';

@Injectable()
export class VircleCoreAPI {
	private httpAgent: AxiosInstance;

	constructor(baseURL: string) {
		this.httpAgent = Axios.create({
			baseURL,
		});
	}

	@TransformPlainToInstance(Nft)
	async getAccessToken(
		token: string,
		payload: {
			nftStatus: string;
			name: string;
			price: number;
			ordererName: string;
			ordererTel: string;
			category?: string;
			brandIdx?: number;
			modelNum?: string;
			warranty?: string;
			material?: string;
			size?: string;
			weight?: string;
			ordered?: string;
		}
	) {
		const {data} = await this.httpAgent.post<Nft>(
			'/v1/admin/nft',
			payload,
			{
				headers: {
					Authentication: `Bearer ${token}`,
				},
			}
		);
		return data;
	}
}
