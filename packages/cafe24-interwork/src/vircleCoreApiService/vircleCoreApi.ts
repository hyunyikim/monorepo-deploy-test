import {Injectable} from '@nestjs/common';
import Axios, {AxiosInstance} from 'axios';
import {Partnership} from 'src/interwork.entity';
import {Nft} from '@vircle/entity';
@Injectable()
export class VircleCoreAPI {
	private httpAgent: AxiosInstance;

	constructor(baseURL: string) {
		this.httpAgent = Axios.create({
			baseURL,
		});
	}

	async cancelGuarantee(token: string, reqIdx: number) {
		const {data} = await this.httpAgent.put<Nft>(
			'/v1/admin/nft/cancel',
			{
				nft_req_idx: reqIdx,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return data;
	}

	async getPartnerInfo(token: string) {
		const {data} = await this.httpAgent.get<Partnership>(
			'/v1/admin/partnerships',
			{
				headers: {
					Authorization: `Bearer ${token}`,
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
					Authorization: `Bearer ${token}`,
					'Content-Type': 'multipart/form-data',
					token,
				},
			}
		);
		return data.data;
	}
}
