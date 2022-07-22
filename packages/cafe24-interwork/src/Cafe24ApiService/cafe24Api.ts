import {Injectable} from '@nestjs/common';
import {TransformPlainToInstance} from 'class-transformer';
import {
	AccessToken,
	Category,
	CustomerPrivacy,
	Product,
	Shop,
	Store,
} from './type';
import Axios, {AxiosInstance} from 'axios';

@Injectable()
export class Cafe24API {
	private httpAgent: AxiosInstance;
	private fixedURL = 'cafe24api.com/api/v2/';
	constructor(private clientId: string, private clientSecret: string) {
		this.httpAgent = Axios.create();
	}

	@TransformPlainToInstance(AccessToken)
	async getAccessToken(mallId: string, authCode: string) {
		const url = `https://${mallId}.${this.fixedURL}/oauth/token`;
		const body = {
			grant_type: 'authorization_code',
			code: authCode,
			redirect_uri: 'https://vircle.co.kr/',
		};

		const auth = {username: this.clientId, password: this.clientSecret};
		const {data} = await this.httpAgent.post<AccessToken>(url, body, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			auth,
		});
		return data;
	}

	@TransformPlainToInstance(AccessToken)
	async refreshAccessToken(mallId: string, refreshToken: string) {
		const url = `https://${mallId}.${this.fixedURL}/oauth/token`;
		const auth = {username: this.clientId, password: this.clientSecret};
		const body = {
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
		};
		const {data} = await this.httpAgent.post<AccessToken>(url, body, {
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
		const url = `https://${mallId}.${this.fixedURL}/admin/store`;
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
