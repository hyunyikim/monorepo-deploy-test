import {BadRequestException, Injectable} from '@nestjs/common';
import {TransformPlainToInstance} from 'class-transformer';
import {
	AccessToken,
	Category,
	CustomerPrivacy,
	Product,
	Shop,
	Store,
} from './type';
import Axios, {AxiosError, AxiosInstance} from 'axios';
import {stringify} from 'querystring';
@Injectable()
export class Cafe24API {
	private httpAgent: AxiosInstance;
	private fixedURL = 'cafe24api.com/api/v2';
	constructor(
		private clientId: string,
		private clientSecret: string,
		private redirectURL: string
	) {
		this.httpAgent = Axios.create();
	}

	@TransformPlainToInstance(AccessToken)
	async getAccessToken(mallId: string, authCode: string) {
		const url = `https://${mallId}.${this.fixedURL}/oauth/token`;

		const bodyStr = stringify({
			grant_type: 'authorization_code',
			code: authCode,
			redirect_uri: this.redirectURL,
		});

		const auth = {username: this.clientId, password: this.clientSecret};
		try {
			const {data} = await this.httpAgent.post<AccessToken>(
				url,
				bodyStr,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					auth,
				}
			);
			return data;
		} catch (err) {
			if (!(err instanceof AxiosError)) throw err;
			if (!err.response?.data) throw err;
			if (!('error' in err.response.data)) throw err;
			if (!('error_description' in err.response.data)) throw err;

			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
			throw new InvalidGrant(err.response.data.error_description);
		}
	}

	@TransformPlainToInstance(AccessToken)
	async refreshAccessToken(mallId: string, refreshToken: string) {
		const url = `https://${mallId}.${this.fixedURL}/oauth/token`;
		const auth = {username: this.clientId, password: this.clientSecret};
		const bodyStr = stringify({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		});
		const {data} = await this.httpAgent.post<AccessToken>(url, bodyStr, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			auth,
		});
		return data;
	}

	@TransformPlainToInstance(Store)
	async getStoreInfo(mallId: string, accessToken: string) {
		const url = `https://${mallId}.${this.fixedURL}/admin/store`;
		const {data} = await this.httpAgent.get<{store: Store}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.store;
	}

	@TransformPlainToInstance(Product)
	async getProductList(
		mallId: string,
		accessToken: string,
		query: {
			category?: number;
			order?: 'asc' | 'desc';
			sort?: 'created_date' | 'updated_date' | 'product_name';
			offset?: number;
			limit?: number; // min = 1, max = 100
		}
	) {
		const url = `https://${mallId}.${this.fixedURL}/admin/products`;
		const {data} = await this.httpAgent.get<{products: Product[]}>(url, {
			params: query,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.products;
	}

	@TransformPlainToInstance(Product)
	async getProductResource(
		mallId: string,
		accessToken: string,
		productNo: number
	) {
		const url = `https://${mallId}.${this.fixedURL}/admin/products/${productNo}`;
		const {data} = await this.httpAgent.get<{product: Product}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.product;
	}

	@TransformPlainToInstance(Product)
	async getProductByCode(
		mallId: string,
		accessToken: string,
		productCode: string,
		shopNo?: number
	) {
		const url = `https://${mallId}.${this.fixedURL}/admin/products`;
		const {data} = await this.httpAgent.get<{products: Product[]}>(url, {
			params: {
				product_code: productCode,
				shop_no: shopNo,
			},
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json;charset=UTF-8',
			},
		});

		if (!data.products[0]) return null;

		return data.products[0];
	}

	@TransformPlainToInstance(Category)
	async getCategoryList(
		mallId: string,
		accessToken: string,
		query: {
			ship_no?: number;
			category_depth?: number;
			offset?: number;
			limit?: number;
			parent_category_no?: number;
		}
	) {
		const url = `https://${mallId}.${this.fixedURL}/admin/categories`;
		const {data} = await this.httpAgent.get<{categories: Category[]}>(url, {
			params: query,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.categories;
	}

	@TransformPlainToInstance(CustomerPrivacy)
	async getCustomerPrivacy(
		mallId: string,
		accessToken: string,
		memberId: string
	) {
		const url = `https://${mallId}.${this.fixedURL}/admin/customersprivacy/${memberId}`;
		const {data} = await this.httpAgent.get<{
			customersprivacy: CustomerPrivacy;
		}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.customersprivacy;
	}

	@TransformPlainToInstance(Shop)
	async getShopList(mallId: string, accessToken: string) {
		const url = `https://${mallId}.${this.fixedURL}/admin/shops`;
		const {data} = await this.httpAgent.get<{shops: Shop[]}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.shops;
	}
}

export class InvalidGrant extends BadRequestException {
	constructor(msg: string) {
		super(msg);
		this.name = 'InvalidGrant';
	}
}
