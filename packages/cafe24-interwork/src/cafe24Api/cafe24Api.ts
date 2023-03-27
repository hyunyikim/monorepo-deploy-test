import {Inject, Injectable, LoggerService} from '@nestjs/common';
import {plainToInstance, TransformPlainToInstance} from 'class-transformer';
import {
	AccessToken,
	Category,
	CustomerPrivacy,
	Order,
	OrderBuyer,
	OrderItem,
	Product,
	Shop,
	Store,
} from './type';
import Axios, {AxiosError, AxiosInstance} from 'axios';
import {stringify} from 'querystring';
import {ErrorResponse} from 'src/common/error';
import {ErrorMetadata} from 'src/common/error-metadata';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
@Injectable()
export class Cafe24API {
	private httpAgent: AxiosInstance;
	private fixedURL = 'cafe24api.com/api/v2';
	constructor(
		private clientId: string,
		private clientSecret: string,
		private redirectURL: string,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
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

			throw new ErrorResponse(ErrorMetadata.canNotAccessToken);
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
		const accessTokenInstance = plainToInstance(AccessToken, data);
		return accessTokenInstance;
	}

	@TransformPlainToInstance(Store)
	async getStoreInfo(mallId: string, shopNo: number, accessToken: string) {
		const url = `https://${mallId}.${this.fixedURL}/admin/store?shop_no=${shopNo}`;
		const {data} = await this.httpAgent.get<{store: Store}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.store;
	}

	@TransformPlainToInstance(Store)
	async getStoreList(mallId: string, accessToken: string) {
		const url = `https://${mallId}.${this.fixedURL}/admin/shops`;
		const {data} = await this.httpAgent.get<{shops: Store[]}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.shops;
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
	async getProductResourceList(
		mallId: string,
		accessToken: string,
		productNoList: string,
		shopNo: number
	) {
		const url = `https://${mallId}.${this.fixedURL}/admin/products?shop_no=${shopNo}&product_no=${productNoList}?limit=100`;
		this.logger.log(`[getProductResourceList] ${url}`);
		const {data} = await this.httpAgent.get<{products: Array<Product>}>(
			url,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		return data.products;
	}

	@TransformPlainToInstance(Product)
	async getProductResourceListByCategory(
		mallId: string,
		accessToken: string,
		category: number,
		shopNo: number
	) {
		const url = `https://${mallId}.${this.fixedURL}/admin/products?shop_no=${shopNo}&category=${category}&limit=100`;
		this.logger.log(`[getProductResourceListByCategory] ${url}`);
		const {data} = await this.httpAgent.get<{products: Array<Product>}>(
			url,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			}
		);
		return data.products;
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

	async getCategoryListFront(
		mallId: string,
		option: {
			name?: string;
			limit: number;
			offset: number;
			depth?: number;
		}
	) {
		const {limit, offset, depth, name} = option;
		const url = `https://${mallId}.cafe24api.com/api/v2/categories`;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const {data} = await this.httpAgent.get<any>(url, {
			params: {
				category_name: name,
				limit,
				offset,
				category_depth: depth,
			},
			headers: {
				'X-Cafe24-Api-Version': '2022-09-01',
				'X-Cafe24-Client-Id': this.clientId,
			},
		});
		// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
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

	@TransformPlainToInstance(Order)
	async getOrder(mallId: string, accessToken: string, orderId: string) {
		const url = `https://${mallId}.${this.fixedURL}/admin/orders/${orderId}?embed=items,buyer`;
		const {data} = await this.httpAgent.get<{order: Order}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.order;
	}

	@TransformPlainToInstance(Order)
	async getOrderList(
		mallId: string,
		accessToken: string,
		orderIds: string,
		shopNo: number
	) {
		const url = `https://${mallId}.${this.fixedURL}/admin/orders?order_id=${orderIds}&embed=items,buyer&limit=1000&shop_no=${shopNo}`;
		this.logger.log(`[getOrderList] ${url}`);
		const {data} = await this.httpAgent.get<{orders: Array<Order>}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.orders;
	}

	@TransformPlainToInstance(OrderItem)
	async getOrderItems(mallId: string, accessToken: string, orderId: string) {
		const url = `https://${mallId}.${this.fixedURL}/admin/orders/${orderId}/items`;
		const {data} = await this.httpAgent.get<{items: OrderItem[]}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.items;
	}

	@TransformPlainToInstance(OrderBuyer)
	async getOrderBuyer(mallId: string, accessToken: string, orderId: string) {
		const url = `https://${mallId}.${this.fixedURL}/admin/orders/${orderId}/buyer`;
		const {data} = await this.httpAgent.get<{buyer: OrderBuyer}>(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		});
		return data.buyer;
	}
}
