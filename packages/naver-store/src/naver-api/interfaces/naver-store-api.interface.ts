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
  timestamp: "2022-05-11T22:27:38.419+09:00";
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

export interface ChangedOrder {
  productOrderStatus: eProductOrderStatus;
  productOrderId: string;
  orderId: string;
  lastChangedDate: string;
  lastChangedType: string;
  receiverAddressChanged: boolean;
}

export interface GetOrderDetailResponse {
  timestamp: string;
  traceId: string;
  data: OrderDetail[];
}

export interface OrderDetail {
  cancel: {
    cancelApprovalDate: string;
    cancelCompletedDate: string;
    cancelDetailedReason: string;
    cancelReason: string;
    claimRequestDate: string;
    claimStatus: string;
    refundExpectedDate: string;
    refundStandbyReason: string;
    refundStandbyStatus: string;
    requestChannel: string;
  };
  delivery: {
    deliveredDate: string;
    deliveryCompany: string;
    deliveryMethod: "DELIVERY";
    deliveryStatus: "COLLECT_REQUEST";
    isWrongTrackingNumber: true;
    pickupDate: string;
    sendDate: string;
    trackingNumber: string;
    wrongTrackingNumberRegisteredDate: string;
    wrongTrackingNumberType: string;
  };
  exchange: {
    claimDeliveryFeeDemandAmount: number;
    claimDeliveryFeePayMeans: string;
    claimDeliveryFeePayMethod: string;
    claimRequestDate: string;
    claimStatus: string;
    collectAddress: {
      addressType: string;
      baseAddress: string;
      city: string;
      country: string;
      detailedAddress: string;
      name: string;
      state: string;
      tel1: string;
      tel2: string;
      zipCode: string;
      isRoadNameAddress: true;
    };
    collectCompletedDate: string;
    collectDeliveryCompany: string;
    collectDeliveryMethod: "DELIVERY";
    collectStatus: "NOT_REQUESTED";
    collectTrackingNumber: string;
    etcFeeDemandAmount: number;
    etcFeePayMeans: string;
    etcFeePayMethod: string;
    exchangeDetailedReason: string;
    exchangeReason: string;
    holdbackDetailedReason: string;
    holdbackReason: string;
    holdbackStatus: string;
    reDeliveryMethod: "DELIVERY";
    reDeliveryStatus: "COLLECT_REQUEST";
    reDeliveryCompany: string;
    reDeliveryTrackingNumber: string;
    requestChannel: string;
    returnReceiveAddress: {
      addressType: string;
      baseAddress: string;
      city: string;
      country: string;
      detailedAddress: string;
      name: string;
      state: string;
      tel1: string;
      tel2: string;
      zipCode: string;
      isRoadNameAddress: true;
    };
    holdbackConfigDate: string;
    holdbackConfigurer: string;
    holdbackReleaseDate: string;
    holdbackReleaser: string;
    claimDeliveryFeeProductOrderIds: string;
    reDeliveryOperationDate: string;
    claimDeliveryFeeDiscountAmount: number;
    remoteAreaCostChargeAmount: number;
  };
  order: {
    chargeAmountPaymentAmount: number;
    checkoutAccumulationPaymentAmount: number;
    generalPaymentAmount: number;
    naverMileagePaymentAmount: number;
    orderDate: string;
    orderDiscountAmount: number;
    orderId: string;
    ordererId: string;
    ordererName: string;
    ordererTel: string;
    paymentDate: string;
    paymentDueDate: string;
    paymentMeans: string;
    isDeliveryMemoParticularInput: string;
    payLocationType: string;
    ordererNo: string;
    payLaterPaymentAmount: number;
  };
  productOrder: {
    claimStatus: string;
    claimType: string;
    decisionDate: string;
    delayedDispatchDetailedReason: string;
    delayedDispatchReason: "PRODUCT_PREPARE";
    deliveryDiscountAmount: number;
    deliveryFeeAmount: number;
    deliveryPolicyType: string;
    expectedDeliveryMethod: "DELIVERY";
    freeGift: string;
    mallId: string;
    optionCode: string;
    optionPrice: number;
    packageNumber: string;
    placeOrderDate: string;
    placeOrderStatus: string;
    productClass: string;
    productDiscountAmount: number;
    productId: string;
    productName: string;
    productOption: string;
    productOrderId: string;
    productOrderStatus: string;
    quantity: number;
    sectionDeliveryFee: number;
    sellerProductCode: string;
    shippingAddress: {
      addressType: string;
      baseAddress: string;
      city: string;
      country: string;
      detailedAddress: string;
      name: string;
      state: string;
      tel1: string;
      tel2: string;
      zipCode: string;
      isRoadNameAddress: true;
      pickupLocationType: "FRONT_OF_DOOR";
      pickupLocationContent: string;
      entryMethod: "LOBBY_PW";
      entryMethodContent: string;
    };
    shippingDueDate: string;
    shippingFeeType: string;
    shippingMemo: string;
    takingAddress: {
      addressType: string;
      baseAddress: string;
      city: string;
      country: string;
      detailedAddress: string;
      name: string;
      state: string;
      tel1: string;
      tel2: string;
      zipCode: string;
      isRoadNameAddress: true;
    };
    totalPaymentAmount: number;
    totalProductAmount: number;
    unitPrice: number;
    sellerBurdenDiscountAmount: number;
    commissionRatingType: string;
    commissionPrePayStatus: string;
    paymentCommission: number;
    saleCommission: number;
    expectedSettlementAmount: number;
    inflowPath: string;
    itemNo: string;
    optionManageCode: string;
    sellerCustomCode1: string;
    sellerCustomCode2: string;
    claimId: string;
    channelCommission: number;
    individualCustomUniqueCode: string;
    productImediateDiscountAmount: number;
    productProductDiscountAmount: number;
    productMultiplePurchaseDiscountAmount: number;
    sellerBurdenImediateDiscountAmount: number;
    sellerBurdenProductDiscountAmount: number;
    sellerBurdenMultiplePurchaseDiscountAmount: number;
    knowledgeShoppingSellingInterlockCommission: number;
    giftReceivingStatus: string;
    sellerBurdenStoreDiscountAmount: number;
    sellerBurdenMultiplePurchaseDiscountType: "IGNORE_QUANTITY";
    logisticsCompanyId: string;
    logisticsCenterId: string;
    hopeDelivery: {
      region: string;
      additionalFee: number;
      hopeDeliveryYmd: string;
      hopeDeliveryHm: string;
      changeReason: string;
      changer: string;
    };
    arrivalGuaranteeDate: string;
    deliveryAttributeType: "NORMAL";
  };
  return: {
    claimDeliveryFeeDemandAmount: number;
    claimDeliveryFeePayMeans: string;
    claimDeliveryFeePayMethod: string;
    claimRequestDate: string;
    claimStatus: string;
    collectAddress: {
      addressType: string;
      baseAddress: string;
      city: string;
      country: string;
      detailedAddress: string;
      name: string;
      state: string;
      tel1: string;
      tel2: string;
      zipCode: string;
      isRoadNameAddress: true;
    };
    collectCompletedDate: string;
    collectDeliveryCompany: string;
    collectDeliveryMethod: "DELIVERY";
    collectStatus: "NOT_REQUESTED";
    collectTrackingNumber: string;
    etcFeeDemandAmount: number;
    etcFeePayMeans: string;
    etcFeePayMethod: string;
    holdbackDetailedReason: string;
    holdbackReason: string;
    holdbackStatus: string;
    refundExpectedDate: string;
    refundStandbyReason: string;
    refundStandbyStatus: string;
    requestChannel: string;
    returnDetailedReason: string;
    returnReason: string;
    returnReceiveAddress: {
      addressType: string;
      baseAddress: string;
      city: string;
      country: string;
      detailedAddress: string;
      name: string;
      state: string;
      tel1: string;
      tel2: string;
      zipCode: string;
      isRoadNameAddress: true;
    };
    returnCompletedDate: string;
    holdbackConfigDate: string;
    holdbackConfigurer: string;
    holdbackReleaseDate: string;
    holdbackReleaser: string;
    claimDeliveryFeeProductOrderIds: string;
    claimDeliveryFeeDiscountAmount: number;
    remoteAreaCostChargeAmount: number;
  };
}
