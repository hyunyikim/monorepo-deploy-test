import {Injectable} from '@nestjs/common';
import {TransformPlainToInstance} from 'class-transformer';
import {Nft} from '@vircle/entity';
import Axios, {AxiosInstance} from 'axios';
import {Partnership} from 'src/interwork.entity';

@Injectable()
export class VircleCoreAPI {
	private httpAgent: AxiosInstance;

	constructor(baseURL: string) {
		this.httpAgent = Axios.create({
			baseURL,
		});
	}

	async getPartnerInfo(token: string) {
		const {data} = await this.httpAgent.get<Partnership>(
			'/v1/admin/partnerships',
			{
				headers: {
					Authentication: `Bearer ${token}`,
				},
			}
		);
		return data;
	}

	async requestGuarantee(
		token: string,
		payload: {
			nftState: string; // "2"
			productName: string;
			price: number;
			ordererName: string;
			ordererTel: string;
			brandIdx?: number;
			platformName?: string;
			category?: string;
			modelNum?: string;
			warranty?: string;
			material?: string;
			size?: string;
			weight?: string;
			orderedAt?: string;
			orderId?: string;
		}
	) {
		const {data} = await this.httpAgent.post<{
			data: {
				nft_req_idx: number;
				nft_req_state: number;
			};
		}>(
			'/admin/nft',
			{
				cate_cd: payload.category,
				brand_idx: payload.brandIdx,
				pro_nm: payload.productName,
				model_num: payload.modelNum,
				material: payload.material,
				size: payload.size,
				weight: payload.weight,
				price: payload.price,
				warranty_dt: payload.warranty,
				platform_nm: payload.platformName,
				order_dt: payload.orderedAt,
				ref_order_id: payload.orderId,
				orderer_nm: payload.ordererName,
				orderer_tel: payload.ordererTel,
				nft_req_state: payload.nftState,
			},
			{
				headers: {
					Authentication: `Bearer ${token}`,
				},
			}
		);
		return data.data;
	}
}
