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
  reqGuaranteePayloads: ReqGuaranteePayload[];

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
