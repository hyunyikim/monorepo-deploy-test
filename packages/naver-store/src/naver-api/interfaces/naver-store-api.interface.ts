import { IsBoolean, IsDate, IsEnum, IsString } from "class-validator";

import { eProductOrderStatus } from "src/common/enums/product-order-status.enum";

export class GetAccessTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: "Bearer";
}

export interface GetSellerChannelsResponse {
  channelNo: number;
  channelType: "STOREFARM" | "WINDOW";
  name: string;
}

export interface getChangedOrderResponse {
  timestamp: Date;
  data: {
    lastChangeStatuses: ChangedOrder[];
    count: 3;
  };
}

export interface NaverCategory {
  wholeCategoryName: string;
  id: number;
  name: string;
  last: boolean;
}
export class ChangedOrder {
  @IsString()
  productOrderId: string; // "2023032030505341",
  @IsString()
  orderId: string; // "2023032028022811",
  @IsEnum(eProductOrderStatus)
  productOrderStatus: eProductOrderStatus; // "PAYED",
  @IsDate()
  paymentDate: Date; // "2023-03-20T16:58:48.0+09:00",
  @IsDate()
  lastChangedDate: Date; // "2023-03-20T16:58:49.0+09:00",
  @IsBoolean()
  receiverAddressChanged: boolean; // false,
  @IsEnum(eProductOrderStatus)
  lastChangedType: eProductOrderStatus; // "PAYED"
}

export interface GetOrderDetailResponse {
  timestamp: string;
  traceId: string;
  data: OrderDetail[];
}

export interface OrderDetail {
  productOrder: {
    quantity: 3;
    productOrderId: "2023032030505341";
    mallId: "ncp_1njkqz_02";
    productClass: "단일상품";
    productOrderStatus: "PAYED";
    productName: "QA_매스어답션_상품_테스트1";
    productId: string;
    itemNo: "2001973987";
    placeOrderStatus: "OK";
    optionPrice: 0;
    unitPrice: 150000;
    productDiscountAmount: 45000;
    totalPaymentAmount: 405000;
    packageNumber: "2023032012566577";
    shippingDueDate: "2023-03-23T23:59:59.0+09:00";
    saleCommission: 0;
    optionCode: "2001973987";
    placeOrderDate: "2023-03-20T16:58:47.0+09:00";
    shippingAddress: {
      addressType: "DOMESTIC";
      tel1: "010-1233-2352";
      isRoadNameAddress: false;
      name: "길민수";
    };
    totalProductAmount: 450000;
    sellerBurdenDiscountAmount: 45000;
    expectedDeliveryMethod: "NOTHING";
    sellerProductCode: "m202212201f875bd6f";
    commissionRatingType: "결제수수료";
    commissionPrePayStatus: "GENERAL_PRD";
    paymentCommission: 14701;
    expectedSettlementAmount: 390299;
    inflowPath: "네이버쇼핑 외 ";
    channelCommission: 0;
    productImediateDiscountAmount: 45000;
    sellerBurdenImediateDiscountAmount: 45000;
    knowledgeShoppingSellingInterlockCommission: 0;
  };
  order: {
    payLocationType: "PC";
    orderId: "2023032028022811";
    paymentDate: "2023-03-20T16:58:48.0+09:00";
    orderDiscountAmount: 0;
    orderDate: "2023-03-20T16:58:47.0+09:00";
    chargeAmountPaymentAmount: 0;
    generalPaymentAmount: 405000;
    naverMileagePaymentAmount: 0;
    ordererId: "aprm****";
    ordererName: "길민수";
    paymentMeans: "신용카드";
    isDeliveryMemoParticularInput: "false";
    payLaterPaymentAmount: 0;
    ordererTel: "01025052886";
    ordererNo: "200726884";
  };
}

export interface AuthError {
  code: string;
  message: string;
  timestamp: string;
}

export interface NaverProduct {
  originProductNo: 2001982911;
  channelProducts: [
    {
      originProductNo: 2001982911;
      channelProductNo: string;
      channelServiceType: "STOREFARM";
      categoryId: "50000641";
      name: "QA_매스어답션_상품_테스트5";
      sellerManagementCode: "m202212201f875bd6f";
      statusType: "SALE";
      channelProductDisplayStatusType: "ON";
      salePrice: 150000;
      discountedPrice: 135000;
      stockQuantity: 997;
      knowledgeShoppingProductRegistration: false;
      deliveryFee: 0;
      multiPurchaseDiscount: 0;
      multiPurchaseDiscountUnitType: "PERCENT";
      managerPurchasePoint: 1;
      saleStartDate: "2022-12-16T00:00+09:00";
      saleEndDate: "2023-04-30T23:59+09:00";
      regDate: "2023-03-14T23:10:28.583+09:00";
      modifiedDate: "2023-03-14T23:10:28.583+09:00";
    }
  ];
}

export interface NaverProductDetail {
  originProduct: {
    statusType: "WAIT";
    saleType: "NEW";
    leafCategoryId: "string";
    name: "string";
    images: {
      representativeImage: {
        url: "string";
      };
    };
    detailContent: "string";
    saleStartDate: "2019-08-24T14:15:22Z";
    saleEndDate: "2019-08-24T14:15:22Z";
    salePrice: 999999990;
    stockQuantity: 99999999;
  };
}
