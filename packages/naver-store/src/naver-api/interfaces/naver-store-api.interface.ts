import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

import { eProductOrderStatus } from "src/common/enums/product-order-status.enum";
import { NFT_STATUS, ReqGuaranteePayload } from "src/common/vircle-api.http";
import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";

export class GetAccessTokenResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty({
    description: "만료기간",
    example: 10800,
    type: "number",
  })
  expires_in: number;

  @ApiProperty()
  token_type: "Bearer";

  // TODO: Token info 와 응답 객체를 구분해줘야...
  @ApiProperty({ type: "boolean", default: false })
  isAlreadyExist = false;
}

export interface GetSellerChannelsResponse {
  channelNo: number;
  channelType: "STOREFARM" | "WINDOW";
  name: string;
}

export interface getChangedOrderResponse {
  timestamp: Date;
  traceId: string;
  data: {
    lastChangeStatuses: ChangedOrder[];
    count: 3;
  };
}

export class InterworkCategory {
  @IsNumber()
  id: number;
  @IsString()
  name: string;
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

  // TODO: 구조를 정리해야됨
  // 여긴 plain 변경 주문 객체를 담고, 아래 property와 메소드들은 개런티 이벤트 전용임
  isFilteredByCategory = false;
  orderDetail: OrderDetail;
  productDetail: NaverProductDetail;
  category: NaverCategory;
  payload: ReqGuaranteePayload;

  setInterworkInfoToPayload(
    payload: ReqGuaranteePayload,
    interwork: NaverStoreInterwork
  ) {
    payload.brandIdx = interwork.partnerInfo?.brand?.idx;
    payload.warranty = interwork.partnerInfo?.warrantyDate;
    payload.nftState = interwork.issueSetting.isAutoIssue
      ? NFT_STATUS.REQUESTED
      : NFT_STATUS.READY;
    return payload;
  }
  setOrderDetailInfoToPayload(
    payload: ReqGuaranteePayload,
    orderDetail: OrderDetail
  ) {
    payload.orderId = orderDetail.productOrder.productOrderId;
    payload.ordererTel = orderDetail.order.ordererTel;
    payload.ordererName = orderDetail.order.ordererName;
    payload.orderedAt = orderDetail.order.orderDate;
    payload.price = orderDetail.order.generalPaymentAmount;
    payload.platformName = orderDetail.productOrder.inflowPath;
    return payload;
  }
  setProductDetailInfoToPayload(productDetail: NaverProductDetail) {
    const payload = new ReqGuaranteePayload();
    payload.productName = productDetail.originProduct.name;
    payload.image = productDetail.originProduct.images.representativeImage.url;
    payload.category = productDetail.originProduct.leafCategoryId;

    return payload;
  }
}

export interface GetOrderDetailResponse {
  timestamp: string;
  traceId: string;
  data: OrderDetail[];
}

export interface OrderDetail {
  cancel: {
    cancelApprovalDate: "2023-01-16T17:14:51.794+09:00";
    cancelCompletedDate: "2023-01-16T17:14:51.794+09:00";
    cancelDetailedReason: "string";
    cancelReason: "string";
    claimRequestDate: "2023-01-16T17:14:51.794+09:00";
    claimStatus: "string";
    refundExpectedDate: "2023-01-16T17:14:51.794+09:00";
    refundStandbyReason: "string";
    refundStandbyStatus: "string";
    requestChannel: "string";
  };
  delivery: {
    deliveredDate: "2023-01-16T17:14:51.794+09:00";
    deliveryCompany: "string";
    deliveryMethod: "DELIVERY";
    deliveryStatus: "COLLECT_REQUEST";
    isWrongTrackingNumber: true;
    pickupDate: "2023-01-16T17:14:51.794+09:00";
    sendDate: "2023-01-16T17:14:51.794+09:00";
    trackingNumber: "string";
    wrongTrackingNumberRegisteredDate: "2023-01-16T17:14:51.794+09:00";
    wrongTrackingNumberType: "string";
  };
  exchange: {
    claimDeliveryFeeDemandAmount: 0;
    claimDeliveryFeePayMeans: "string";
    claimDeliveryFeePayMethod: "string";
    claimRequestDate: "2023-01-16T17:14:51.794+09:00";
    claimStatus: "string";
    collectAddress: {
      addressType: "string";
      baseAddress: "string";
      city: "string";
      country: "string";
      detailedAddress: "string";
      name: "string";
      state: "string";
      tel1: "string";
      tel2: "string";
      zipCode: "string";
      isRoadNameAddress: true;
    };
    collectCompletedDate: "2023-01-16T17:14:51.794+09:00";
    collectDeliveryCompany: "string";
    collectDeliveryMethod: "DELIVERY";
    collectStatus: "NOT_REQUESTED";
    collectTrackingNumber: "string";
    etcFeeDemandAmount: 0;
    etcFeePayMeans: "string";
    etcFeePayMethod: "string";
    exchangeDetailedReason: "string";
    exchangeReason: "string";
    holdbackDetailedReason: "string";
    holdbackReason: "string";
    holdbackStatus: "string";
    reDeliveryMethod: "DELIVERY";
    reDeliveryStatus: "COLLECT_REQUEST";
    reDeliveryCompany: "string";
    reDeliveryTrackingNumber: "string";
    requestChannel: "string";
    returnReceiveAddress: {
      addressType: "string";
      baseAddress: "string";
      city: "string";
      country: "string";
      detailedAddress: "string";
      name: "string";
      state: "string";
      tel1: "string";
      tel2: "string";
      zipCode: "string";
      isRoadNameAddress: true;
    };
    holdbackConfigDate: "2023-01-16T17:14:51.794+09:00";
    holdbackConfigurer: "string";
    holdbackReleaseDate: "2023-01-16T17:14:51.794+09:00";
    holdbackReleaser: "string";
    claimDeliveryFeeProductOrderIds: "string";
    reDeliveryOperationDate: "2023-01-16T17:14:51.794+09:00";
    claimDeliveryFeeDiscountAmount: 0;
    remoteAreaCostChargeAmount: 0;
  };
  order: {
    chargeAmountPaymentAmount: 0;
    checkoutAccumulationPaymentAmount: 0;
    generalPaymentAmount: 0;
    naverMileagePaymentAmount: 0;
    orderDate: "2023-01-16T17:14:51.794+09:00";
    orderDiscountAmount: 0;
    orderId: "string";
    ordererId: "string";
    ordererName: "string";
    ordererTel: "string";
    paymentDate: "2023-01-16T17:14:51.794+09:00";
    paymentDueDate: "2023-01-16T17:14:51.794+09:00";
    paymentMeans: "string";
    isDeliveryMemoParticularInput: "string";
    payLocationType: "string";
    ordererNo: "string";
    payLaterPaymentAmount: 0;
  };
  productOrder: {
    claimStatus: "string";
    claimType: "string";
    decisionDate: "2023-01-16T17:14:51.794+09:00";
    delayedDispatchDetailedReason: "string";
    delayedDispatchReason: "PRODUCT_PREPARE";
    deliveryDiscountAmount: 0;
    deliveryFeeAmount: 0;
    deliveryPolicyType: "string";
    expectedDeliveryMethod: "DELIVERY";
    freeGift: "string";
    mallId: "string";
    optionCode: "string";
    optionPrice: 0;
    packageNumber: "string";
    placeOrderDate: "2023-01-16T17:14:51.794+09:00";
    placeOrderStatus: "string";
    productClass: "string";
    productDiscountAmount: 0;
    productId: "string";
    productName: "string";
    productOption: "string";
    productOrderId: "string";
    productOrderStatus: "string";
    quantity: 0;
    sectionDeliveryFee: 0;
    sellerProductCode: "string";
    shippingAddress: {
      addressType: "string";
      baseAddress: "string";
      city: "string";
      country: "string";
      detailedAddress: "string";
      name: "string";
      state: "string";
      tel1: "string";
      tel2: "string";
      zipCode: "string";
      isRoadNameAddress: true;
      pickupLocationType: "FRONT_OF_DOOR";
      pickupLocationContent: "string";
      entryMethod: "LOBBY_PW";
      entryMethodContent: "string";
    };
    shippingDueDate: "2023-01-16T17:14:51.794+09:00";
    shippingFeeType: "string";
    shippingMemo: "string";
    takingAddress: {
      addressType: "string";
      baseAddress: "string";
      city: "string";
      country: "string";
      detailedAddress: "string";
      name: "string";
      state: "string";
      tel1: "string";
      tel2: "string";
      zipCode: "string";
      isRoadNameAddress: true;
    };
    totalPaymentAmount: 0;
    totalProductAmount: 0;
    unitPrice: 0;
    sellerBurdenDiscountAmount: 0;
    commissionRatingType: "string";
    commissionPrePayStatus: "string";
    paymentCommission: 0;
    saleCommission: 0;
    expectedSettlementAmount: 0;
    inflowPath: "string";
    itemNo: "string";
    optionManageCode: "string";
    sellerCustomCode1: "string";
    sellerCustomCode2: "string";
    claimId: "string";
    channelCommission: 0;
    individualCustomUniqueCode: "string";
    productImediateDiscountAmount: 0;
    productProductDiscountAmount: 0;
    productMultiplePurchaseDiscountAmount: 0;
    sellerBurdenImediateDiscountAmount: 0;
    sellerBurdenProductDiscountAmount: 0;
    sellerBurdenMultiplePurchaseDiscountAmount: 0;
    knowledgeShoppingSellingInterlockCommission: 0;
    giftReceivingStatus: "string";
    sellerBurdenStoreDiscountAmount: 0;
    sellerBurdenMultiplePurchaseDiscountType: "IGNORE_QUANTITY";
    logisticsCompanyId: "string";
    logisticsCenterId: "string";
    hopeDelivery: {
      region: "string";
      additionalFee: 0;
      hopeDeliveryYmd: "string";
      hopeDeliveryHm: "string";
      changeReason: "string";
      changer: "string";
    };
    arrivalGuaranteeDate: "2023-01-16T17:14:51.794+09:00";
    deliveryAttributeType: "NORMAL";
  };
  return: {
    claimDeliveryFeeDemandAmount: 0;
    claimDeliveryFeePayMeans: "string";
    claimDeliveryFeePayMethod: "string";
    claimRequestDate: "2023-01-16T17:14:51.794+09:00";
    claimStatus: "string";
    collectAddress: {
      addressType: "string";
      baseAddress: "string";
      city: "string";
      country: "string";
      detailedAddress: "string";
      name: "string";
      state: "string";
      tel1: "string";
      tel2: "string";
      zipCode: "string";
      isRoadNameAddress: true;
    };
    collectCompletedDate: "2023-01-16T17:14:51.794+09:00";
    collectDeliveryCompany: "string";
    collectDeliveryMethod: "DELIVERY";
    collectStatus: "NOT_REQUESTED";
    collectTrackingNumber: "string";
    etcFeeDemandAmount: 0;
    etcFeePayMeans: "string";
    etcFeePayMethod: "string";
    holdbackDetailedReason: "string";
    holdbackReason: "string";
    holdbackStatus: "string";
    refundExpectedDate: "2023-01-16T17:14:51.794+09:00";
    refundStandbyReason: "string";
    refundStandbyStatus: "string";
    requestChannel: "string";
    returnDetailedReason: "string";
    returnReason: "string";
    returnReceiveAddress: {
      addressType: "string";
      baseAddress: "string";
      city: "string";
      country: "string";
      detailedAddress: "string";
      name: "string";
      state: "string";
      tel1: "string";
      tel2: "string";
      zipCode: "string";
      isRoadNameAddress: true;
    };
    returnCompletedDate: "2023-01-16T17:14:51.794+09:00";
    holdbackConfigDate: "2023-01-16T17:14:51.794+09:00";
    holdbackConfigurer: "string";
    holdbackReleaseDate: "2023-01-16T17:14:51.794+09:00";
    holdbackReleaser: "string";
    claimDeliveryFeeProductOrderIds: "string";
    claimDeliveryFeeDiscountAmount: 0;
    remoteAreaCostChargeAmount: 0;
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

export interface NaverCategory {
  wholeCategoryName: string;
  id: string;
  name: string;
  last: true;
  exceptionalCategories: ["E_COUPON"];
  certificationInfos: [
    {
      id: 0;
      name: string;
      kindTypes: ["KC_CERTIFICATION"];
    }
  ];
}
