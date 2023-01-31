import {Inject, Injectable, LoggerService} from '@nestjs/common';
import Axios, {AxiosInstance} from 'axios';
import {Partnership} from '../cafe24Interwork';
import {Nft} from '@vircle/entity';
import * as FormData from 'form-data';
import {Readable} from 'stream';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
export interface GuaranteeRequestPayload {
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
	image?: Readable;
}
@Injectable()
export class VircleCoreAPI {
	private httpAgent: AxiosInstance;

	constructor(
		baseURL: string,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
	) {
		this.httpAgent = Axios.create({
			baseURL,
		});
	}

	async cancelGuarantee(token: string, reqIdx: number) {
		const {data} = await this.httpAgent.put<Nft>(
			'/admin/nft/cancel',
			{
				nft_req_idx: reqIdx.toString(),
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
					token,
				},
			}
		);
		this.logger.log('vircle api cancel guarantee success');
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

	async requestGuarantee(token: string, payload: GuaranteeRequestPayload) {
		const {
			image,
			category,
			brandIdx,
			productName,
			modelNum,
			material,
			size,
			weight,
			price,
			warranty,
			platformName,
			orderedAt,
			orderId,
			ordererName,
			ordererTel,
			nftState,
		} = payload;
		const form = new FormData();
		image && form.append('product_img', image);
		category && form.append('cate_cd', category);
		brandIdx && form.append('brand_idx', brandIdx);
		productName && form.append('pro_nm', productName);
		modelNum && form.append('model_num', modelNum);
		material && form.append('material', material);
		size && form.append('size', size);
		weight && form.append('weight', weight);
		if (price !== undefined) form.append('price', price);
		warranty && form.append('warranty_dt', warranty);
		platformName && form.append('platform_nm', platformName);
		orderedAt && form.append('order_dt', orderedAt);
		orderId && form.append('ref_order_id', orderId);
		ordererName && form.append('orderer_nm', ordererName);
		ordererTel && form.append('orderer_tel', ordererTel);
		nftState && form.append('nft_req_state', nftState);

		const {data} = await this.httpAgent.post<{
			data: {
				nft_req_idx: number;
				nft_req_state: number;
			};
		}>('/admin/nft', form, {
			headers: {
				Authorization: `Bearer ${token}`,
				...form.getHeaders(),
				token,
			},
		});
		return data.data;
	}
}
