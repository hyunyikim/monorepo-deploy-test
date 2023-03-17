import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";
import {
  ChangedOrder,
  OrderDetail,
} from "src/naver-api/interfaces/naver-store-api.interface";

export class GetChangedOrderListEvent {
  static readonly Key = "guarantee.get.changed.orders";
  interwork: NaverStoreInterwork;
  retryCount: number;
}

export class GetOrderDetailEvent {
  static readonly Key = "guarantee.get.order.detail";
  orders: ChangedOrder[];
  interwork: NaverStoreInterwork;
  retryCount: number;
}

export class IssueGuaranteeEvent {
  static readonly Key = "guarantee.issue";
  orders: ChangedOrder[];
  interwork: NaverStoreInterwork;
  orderDetails: OrderDetail[];
  retryCount: number;
}
