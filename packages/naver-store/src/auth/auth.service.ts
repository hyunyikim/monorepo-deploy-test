import { Injectable } from "@nestjs/common";

import { NaverStoreApi } from "src/naver-api/naver-store.api";

@Injectable()
export class AuthService {
  constructor(private api: NaverStoreApi) {}
  async createToken() {
    return await this.api.setAccessToken();
  }

  getToken() {
    return this.api.getAccessToken();
  }
}
