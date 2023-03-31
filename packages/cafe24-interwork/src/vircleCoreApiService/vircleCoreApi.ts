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
	image?: Readable | null;
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
		const {data} = await this.httpAgent.patch<Nft>(
			`/v1/admin/nft/cancel/${reqIdx}`,
			{},
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
		form.append('requestRoute', 'cafe24');
		image && form.append('productImage', image);
		category && form.append('categoryCode', category);
		brandIdx && form.append('brandIdx', brandIdx);
		productName && form.append('productName', productName);
		modelNum && form.append('modelNumber', modelNum);
		material && form.append('material', material);
		size && form.append('size', size);
		weight && form.append('weight', weight);
		if (price !== undefined) form.append('price', price);
		warranty && form.append('warrantyDate', warranty);
		platformName && form.append('storeName', platformName);
		orderedAt && form.append('orderedAt', orderedAt);
		orderId && form.append('refOrderId', orderId);
		ordererName && form.append('ordererName', ordererName);
		ordererTel && form.append('ordererTel', ordererTel);
		nftState && form.append('nftStatus', nftState);

		const {data} = await this.httpAgent.post<{
			idx: number;
			nftStatusCode: number;
			nftStatus: string;
			issuerName: string;
		}>('/v1/admin/nft', form, {
			headers: {
				Authorization: `Bearer ${token}`,
				...form.getHeaders(),
				token,
			},
		});
		return data;
	}
}
