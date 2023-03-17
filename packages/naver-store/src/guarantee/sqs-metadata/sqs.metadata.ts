import {
  GetChangedOrderListEvent,
  GetOrderDetailEvent,
} from "src/guarantee/events/guarantee.event";
import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";
import { ChangedOrder } from "src/naver-api/interfaces/naver-store-api.interface";

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
} as const;
