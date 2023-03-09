import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { hashSync } from "bcryptjs";
import { DateTime } from "luxon";

import { NaverConfig } from "src/common/configuration";
import {
  URL_GET_CHANNEL_PRODUCT_LIST,
  URL_GET_ORDER_LIST,
  URL_GET_PRODUCT_LIST,
  URL_GET_SELLER_CHANNELS,
  URL_REQUEST_ACCESS_TOKEN,
} from "src/common/path";

import {
  GetAccessTokenResponse,
  GetSellerChannelsResponse,
} from "./interfaces/naver-store-api.interface";

@Injectable()
export class NaverStoreApi {
  constructor(private config: ConfigService, private http: HttpService) {}

  private _naverToken = "";
  set naverToken(token: string) {
    this._naverToken = token;
  }

  get naverToken(): string {
    return this._naverToken;
  }

  // /** 어플 실행 시 초기화 */
  // async onModuleInit() {
  //   await this.generateToken(null);
  // }

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

  getAccessToken() {
    return this.naverToken;
  }

  async getSellerChannels(token: string) {
    const { data } = await lastValueFrom(
      this.http.get<GetSellerChannelsResponse>(URL_GET_SELLER_CHANNELS, {
        headers: { Authorization: `Bearer ${token}` },
      })
    );

    return data;
  }

  async getChannelProductList(channelId: number, token: string) {
    return await this.requestGet(
      URL_GET_CHANNEL_PRODUCT_LIST(channelId),
      token
    );
  }

  async getOrderList(token: string) {
    return await this.requestGet(
      `${URL_GET_ORDER_LIST}?lastChangedFrom=${DateTime.now()
        .minus({ months: 1 })
        .toISO()}`,
      token
    );
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

  private async requestPost<T = Record<string, any>>(
    url: string,
    body: T,
    token: string
  ) {
    const { data } = await lastValueFrom(
      this.http.post<T>(url, body, {
        headers: { Authorization: `Bearer ${token}` },
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
