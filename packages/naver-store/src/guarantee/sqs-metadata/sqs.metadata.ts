import {
  GetChangedOrderListEvent,
  GetOrderDetailEvent,
  GetProductDetailEvent,
  GetProductListEvent,
} from "src/guarantee/events/guarantee.event";
import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";
import {
  ChangedOrder,
  NaverProduct,
  OrderDetail,
} from "src/naver-api/interfaces/naver-store-api.interface";

export const SQS_METADATA = {
  [GetChangedOrderListEvent.Key]: (
    interwork: NaverStoreInterwork,
    retryCount: number
  ) => ({
    MessageBody: JSON.stringify({
      key: GetChangedOrderListEvent.Key,
      values: { interwork },
      retryCount: retryCount + 1,
    }),
    MessageAttributes: {
      accountId: {
        DataType: "String",
        StringValue: interwork.accountId,
      },
      partnerIdx: {
        DataType: "Number",
        StringValue: `${interwork.partnerIdx}`,
      },
    },
  }),
  [GetOrderDetailEvent.Key]: (
    interwork: NaverStoreInterwork,
    orders: ChangedOrder[],
    retryCount: number
  ) => ({
    MessageBody: JSON.stringify({
      key: GetChangedOrderListEvent.Key,
      values: { interwork, orders },
      retryCount: retryCount + 1,
    }),
    MessageAttributes: {
      accountId: {
        DataType: "String",
        StringValue: interwork.accountId,
      },
      partnerIdx: {
        DataType: "Number",
        StringValue: `${interwork.partnerIdx}`,
      },
    },
  }),
  [GetProductListEvent.Key]: (
    interwork: NaverStoreInterwork,
    orders: ChangedOrder[],
    orderDetails: OrderDetail[],
    retryCount: number
  ) => ({
    MessageBody: JSON.stringify({
      key: GetChangedOrderListEvent.Key,
      values: { interwork, orders, OrderDetails: orderDetails },
      retryCount: retryCount + 1,
    }),
    MessageAttributes: {
      accountId: {
        DataType: "String",
        StringValue: interwork.accountId,
      },
      partnerIdx: {
        DataType: "Number",
        StringValue: `${interwork.partnerIdx}`,
      },
    },
  }),
  [GetProductDetailEvent.Key]: (
    interwork: NaverStoreInterwork,
    orders: ChangedOrder[],
    OrderDetails: OrderDetail[],
    products: NaverProduct[],
    retryCount: number
  ) => ({
    MessageBody: JSON.stringify({
      key: GetChangedOrderListEvent.Key,
      values: { interwork, orders, OrderDetails, products },
      retryCount: retryCount + 1,
    }),
    MessageAttributes: {
      accountId: {
        DataType: "String",
        StringValue: interwork.accountId,
      },
      partnerIdx: {
        DataType: "Number",
        StringValue: `${interwork.partnerIdx}`,
      },
    },
  }),
} as const;
