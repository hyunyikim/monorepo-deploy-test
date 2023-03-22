import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { hashSync } from "bcryptjs";
import { AxiosError } from "axios";

import { NaverConfig } from "src/common/configuration";
import {
  URL_GET_CATEGORY,
  URL_GET_CHANNEL_PRODUCT_LIST,
  URL_GET_ORDER_DETAIL_LIST,
  URL_GET_ORDER_LIST,
  URL_GET_PRODUCT_LIST,
  URL_GET_SELLER_CHANNELS,
  URL_REQUEST_ACCESS_TOKEN,
} from "src/common/path";
import { HIGHIST_CATEGORY_LIST } from "src/naver-api/interfaces/category-list";

import {
  GetAccessTokenResponse,
  GetSellerChannelsResponse,
  getChangedOrderResponse,
  GetOrderDetailResponse,
  NaverProduct,
  NaverProductDetail,
  NaverCategory,
} from "./interfaces/naver-store-api.interface";

@Injectable()
export class NaverStoreApi {
  constructor(private config: ConfigService, private http: HttpService) {}

  async generateToken(accountId: string) {
    const naver = this.config.getOrThrow<NaverConfig>("naver");
    const { auth } = naver;
    const { id, secret } = auth;
    const date = new Date();

    const password = `${id}_${date.getTime()}`;
    const hashed = Buffer.from(hashSync(password, secret), "utf-8").toString(
      "base64"
    );

    const { data } = await lastValueFrom(
      this.http.post<GetAccessTokenResponse>(
        URL_REQUEST_ACCESS_TOKEN(id, date.getTime(), hashed, accountId)
      )
    );

    return data;
  }

  async getSellerChannels(token: string) {
    return await this.requestGet<GetSellerChannelsResponse>(
      URL_GET_SELLER_CHANNELS,
      token
    );
  }

  async getChangedOrderList(token: string) {
    return (
      (
        await this.requestGet<getChangedOrderResponse>(
          `${URL_GET_ORDER_LIST}?lastChangedFrom=2023-03-20T16:58:00.0%2B09:00`, //${encodeURIComponent(DateTime.now().minus({ minutes: 30 }).toISO({}))}
          token
        )
      ).data?.lastChangeStatuses ?? []
    );
  }

  async getOrderDetailList(token: string, productOrderIds: string[]) {
    return (
      await this.requestPost<GetOrderDetailResponse>(
        URL_GET_ORDER_DETAIL_LIST,
        { productOrderIds },
        token
      )
    ).data;
  }

  /**
   * 상품 리스트 조회
   * @link https://sandbox-api.commerce.naver.com/partner#tag/%EC%83%81%ED%92%88-%EB%AA%A9%EB%A1%9D/operation/search.product
   */
  async getProductList(productIds: number[], token: string) {
    return (
      await this.requestPost<{ contents: NaverProduct[] }>(
        URL_GET_PRODUCT_LIST,
        {
          searchKeywordType: "CHANNEL_PRODUCT_NO",
          channelProductNos: productIds,
          orderType: "NO",
        },
        token
      )
    ).contents;
  }

  async getHighistCategories() {
    return HIGHIST_CATEGORY_LIST;
    // return await this.requestGet(URL_GET_CATEGORIES, token);
  }

  async getProductDetail(productId: string, token: string) {
    return await this.requestGet<NaverProductDetail>(
      URL_GET_CHANNEL_PRODUCT_LIST(productId),
      token
    );
  }

  async getCategory(categoryId: string, token: string) {
    return await this.requestGet<NaverCategory>(
      URL_GET_CATEGORY(categoryId),
      token
    );
  }

  private async requestPost<T>(url: string, body: any, token: string) {
    const { data } = await lastValueFrom(
      this.http.post<T>(url, body, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).catch((e) => {
      console.log(e);
      throw e;
    });
    return data;
  }

  private async requestGet<T>(url: string, token: string) {
    const { data } = await lastValueFrom(
      this.http.get<T>(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
    ).catch((e: AxiosError) => {
      console.log(e);
      throw e;
    });

    return data;
  }
}
