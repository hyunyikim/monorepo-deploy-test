import { Injectable } from "@nestjs/common";

import { NaverStoreApi } from "../naver-api/naver-store.api";

@Injectable()
export class SellerService {
  constructor(private api: NaverStoreApi) {}

  findAll() {
    return this.api.getSellerChannels();
  }
}
