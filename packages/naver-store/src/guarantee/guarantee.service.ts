import { Injectable } from "@nestjs/common";

import { NaverStoreApi } from "src/naver-api/naver-store.api";

@Injectable()
export class GuaranteeService {
  constructor(private api: NaverStoreApi) {}
  async getOrderList(token: string) {
    const result = await this.api.getSellerChannels(token);
    return result;
  }
}
