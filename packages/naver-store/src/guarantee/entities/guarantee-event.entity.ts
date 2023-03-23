import { NFT_STATUS, ReqGuaranteePayload } from "src/common/vircle-api.http";
import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";
import {
  ChangedOrder,
  NaverProductDetail,
  OrderDetail,
} from "src/naver-api/interfaces/naver-store-api.interface";

export class GuaranteeEvent {
  interwork: NaverStoreInterwork;
  orders: ChangedOrder[];
  retryCount = 0;
}
