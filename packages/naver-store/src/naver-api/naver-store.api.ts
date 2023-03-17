import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { hashSync } from "bcryptjs";
import { DateTime } from "luxon";
import { RawAxiosRequestHeaders } from "axios";

import { NaverConfig } from "src/common/configuration";
import {
  URL_GET_CATEGORIES,
  URL_GET_ORDER_DETAIL_LIST,
  URL_GET_ORDER_LIST,
  URL_GET_PRODUCT_LIST,
  URL_GET_SELLER_CHANNELS,
  URL_REQUEST_ACCESS_TOKEN,
} from "src/common/path";

import {
  GetAccessTokenResponse,
  GetSellerChannelsResponse,
  getChangedOrderResponse,
  GetOrderDetailResponse,
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

    return await this.requestPost<GetAccessTokenResponse>(
      URL_REQUEST_ACCESS_TOKEN(id, date.getTime(), hashed, accountId),
      null
    );
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
          `${URL_GET_ORDER_LIST}?lastChangedFrom=${encodeURIComponent(
            DateTime.now().minus({ minutes: 30 }).toISO({})
          )}`,
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
  async getProductList(token: string, accountId: string) {
    return await this.requestPost(
      URL_GET_PRODUCT_LIST,
      {
        searchKeywordType: "SELLER_CODE",
        sellerManagementCode: accountId,
        productStatusTypes: ["SALE"],
        size: 1000,
        orderType: "NO",
      },
      token
    );
  }

  async getCategories(token: string) {
    return await this.requestGet(URL_GET_CATEGORIES, token).catch((e) => {
      console.log(e);
      throw e;
    });
  }

  private async requestPost<T>(url: string, body: any, token?: string) {
    const { data } = await lastValueFrom(
      this.http.post<T>(url, body, {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : (this.http.axiosRef.defaults
              .headers as Partial<RawAxiosRequestHeaders>),
      })
    );
    return data;
  }

  private async requestGet<T>(url: string, token: string) {
    const { data } = await lastValueFrom(
      this.http.get<T>(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    return data;
  }
}
