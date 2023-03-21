import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";
import {
  ChangedOrder,
  NaverProduct,
  NaverProductDetail,
  OrderDetail,
} from "src/naver-api/interfaces/naver-store-api.interface";

export class GetChangedOrderListEvent {
  static readonly Key = "guarantee.get.changed.orders";
  interwork: NaverStoreInterwork;
  retryCount: number;
}

export class GetOrderDetailEvent {
  static readonly Key = "guarantee.get.order.details";
  orders: ChangedOrder[];
  interwork: NaverStoreInterwork;
  retryCount: number;
}

export class GetProductListEvent {
  static readonly Key = "guarantee.get.products";
  orders: ChangedOrder[];
  interwork: NaverStoreInterwork;
  orderDetails: OrderDetail[];
  retryCount: number;
}

export class GetProductDetailEvent {
  static readonly Key = "guarantee.get.product.detail";
  orders: ChangedOrder[];
  interwork: NaverStoreInterwork;
  orderDetails: OrderDetail[];
  products: NaverProduct[];
  retryCount: number;
}

export class IssueGuaranteeEvent {
  static readonly Key = "guarantee.issue";
  orders: ChangedOrder[];
  interwork: NaverStoreInterwork;
  orderDetails: OrderDetail[];
  products: NaverProduct[];
  productDetails: NaverProductDetail[];
  retryCount: number;
}
