import { HttpService } from "@nestjs/axios";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { hashSync } from "bcryptjs";

import { NaverConfig } from "src/common/configuration";
import {
  URL_GET_SELLER_CHANNELS,
  URL_REQUEST_ACCESS_TOKEN,
} from "src/common/path";

import {
  GetAccessTokenResponse,
  GetSellerChannelsResponse,
} from "./interfaces/naver-store-api.interface";

@Injectable()
export class NaverStoreApi implements OnModuleInit {
  constructor(private config: ConfigService, private http: HttpService) {}

  private _naverToken = "";
  set naverToken(token: string) {
    this._naverToken = token;
  }

  get naverToken(): string {
    return this._naverToken;
  }

  /** 어플 실행 시 초기화 */
  onModuleInit() {
    this.setAccessToken();
  }

  async setAccessToken() {
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
        URL_REQUEST_ACCESS_TOKEN(id, date.getTime(), hashed)
      )
    );

    this.naverToken = data.access_token;

    return data;
  }

  getAccessToken() {
    return this.naverToken;
  }

  async getSellerChannels() {
    const { data } = await lastValueFrom(
      this.http.get<GetSellerChannelsResponse>(URL_GET_SELLER_CHANNELS, {
        headers: { Authorization: `Bearer ${this.naverToken}` },
      })
    );

    return data;
  }
}
