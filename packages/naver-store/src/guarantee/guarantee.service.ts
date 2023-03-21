import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AxiosError } from "axios";

import { eProductOrderStatus } from "src/common/enums/product-order-status.enum";
import {
  NFT_STATUS,
  ReqGuaranteePayload,
  VircleApiHttpService,
} from "src/common/vircle-api.http";
import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { NaverStoreApi } from "src/naver-api/naver-store.api";
import {
  ChangedOrder,
  NaverProductDetail,
  NaverProduct,
  OrderDetail,
} from "src/naver-api/interfaces/naver-store-api.interface";
import {
  GetChangedOrderListEvent,
  GetOrderDetailEvent,
  GetProductDetailEvent,
  GetProductListEvent,
  IssueGuaranteeEvent,
} from "src/guarantee/events/guarantee.event";
import { SqsService } from "src/common/sqs/sqs.service";
import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";
import { SlackReporter } from "src/common/slack";
import { SQS_METADATA } from "src/guarantee/sqs-metadata/sqs.metadata";
// import {} from "";

@Injectable()
export class GuaranteeService {
  constructor(
    private api: NaverStoreApi,
    private interworkRepo: InterworkRepository,
    private vircleCoreApi: VircleApiHttpService,
    private emitter: EventEmitter2,
    private sqsService: SqsService,
    private slackReporter: SlackReporter
  ) {}
  // 30초마다 이벤트 실행
  // 전체 연동된 업체 리스트 조회
  // 각 업체의 주문 변경 이력 획득
  // 각 변경 이력의 상세 주문 정보 획득
  // ???
  // 개런티 발급
  // 톡톡 or 알림톡 발송

  // 만약 실패나면 sqs 전송
  // sqs 에서 주기적으로 꺼내서 다시 이벤트 실행

  // FIXME: 실행 중간에 토큰이 갱신되면?

  // @Cron("*/5 * * * * *", { name: "RETRY_NAVER_EVENT" })
  async retryNaverEvent() {
    const message = await this.sqsService.consume();
    if (message) {
      const param = JSON.parse(message.Body as string) as {
        key: string;
        values: any;
        retryCount: number;
      };

      if (param.retryCount > 3) {
        this.slackReporter.sendWebhookFailed();
        Logger.error({
          message: "Tried naver request 3 times but finally failed",
          param,
        });
        throw new Error("Tried naver request 3 times but finally failed");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        this.emitter.emit(param.key, {
          ...param.values,
          retryCount: param.retryCount,
        });
      }
    }
  }

  // @Cron("0 * * * * *")
  async startIssueGuarantee() {
    const interworks = await this.interworkRepo.getAllWithoutUnlinked();
    for (const interwork of interworks) {
      await this.getChangedOrderList(interwork);
    }
  }

  async getChangedOrderList(interwork: NaverStoreInterwork, retryCount = 0) {
    try {
      const token = interwork.tokenInfo.access_token;
      const stateFilter = [
        eProductOrderStatus.PAYED,
        eProductOrderStatus.DELIVERED,
        eProductOrderStatus.CANCELED,
        eProductOrderStatus.CANCELED_BY_NOPAYMENT,
      ];
      const orderList = await this.api.getChangedOrderList(token);
      // if (!orderList.length) {
      //   console.log("없음");
      //   return;
      // }
      const filteredList = orderList.filter((order) =>
        stateFilter.includes(order.productOrderStatus)
      );

      const event = new GetOrderDetailEvent();
      event.interwork = interwork;
      event.orders = filteredList;
      event.retryCount = retryCount;
      this.emitter.emit(GetOrderDetailEvent.Key, event);
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);

      await this.sqsService.send(
        SQS_METADATA[GetChangedOrderListEvent.Key](interwork, retryCount)
      );
    }
  }

  async getOrderDetailList(
    interwork: NaverStoreInterwork,
    orders: ChangedOrder[],
    retryCount = 0
  ) {
    try {
      const orderDetailList = await this.api.getOrderDetailList(
        interwork.tokenInfo.access_token,
        orders.map((order) => order.productOrderId)
      );

      const event = new GetProductListEvent();
      event.interwork = interwork;
      event.orders = orders;
      event.orderDetails = orderDetailList;
      event.retryCount = retryCount;
      this.emitter.emit(GetProductListEvent.Key, event);
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);

      await this.sqsService.send(
        SQS_METADATA[GetOrderDetailEvent.Key](interwork, orders, retryCount)
      );
    }
  }

  async getProducts(
    interwork: NaverStoreInterwork,
    orders: ChangedOrder[],
    orderDtails: OrderDetail[],
    retryCount = 0
  ) {
    try {
      const productIds = orderDtails.map(
        (detail) => +detail.productOrder.productId
      );

      const products = await this.api.getProductList(
        productIds,
        interwork.getAccessToken()
      );

      const event = new GetProductDetailEvent();
      event.interwork = interwork;
      event.orders = orders;
      event.orderDetails = orderDtails;
      event.products = products;
      event.retryCount = retryCount;
      this.emitter.emit(GetProductDetailEvent.Key, event);
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);

      await this.sqsService.send(
        SQS_METADATA[GetProductListEvent.Key](
          interwork,
          orders,
          orderDtails,
          retryCount
        )
      );
    }
  }

  /**
   * 카테고리 여부에 따라 개런티 발급 필터
   */
  private filterCategories(
    interwork: NaverStoreInterwork,
    orderDetails: OrderDetail[],
    products: NaverProduct[]
  ) {
    const categories = interwork.issueSetting.issueCategories.map(
      (category) => +category.id
    );

    const filteredProducts = products.filter((product) =>
      categories.includes(+product.channelProducts[0].categoryId)
    );
    const filteredProductIds = filteredProducts.map(
      (product) => +product.channelProducts[0].channelProductNo
    );
    const filteredDetails = orderDetails.filter((detail) =>
      filteredProductIds.includes(+detail.productOrder.productId)
    );
    return { filteredDetails, filteredProducts };
  }

  async getProductDetails(
    interwork: NaverStoreInterwork,
    orders: ChangedOrder[],
    orderDtails: OrderDetail[],
    products: NaverProduct[],
    retryCount = 0
  ) {
    try {
      if (interwork.issueSetting.issueCategories.length) {
        const { filteredDetails, filteredProducts } = this.filterCategories(
          interwork,
          orderDtails,
          products
        );
      }

      const productDetails = [] as NaverProductDetail[];
      for (const _product of products) {
        const product = await this.api.getProductDetail(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          _product.channelProducts[0].channelProductNo,
          interwork.getAccessToken()
        );
        productDetails.push(product);
      }

      const event = new IssueGuaranteeEvent();
      event.interwork = interwork;
      event.orders = orders;
      event.orderDetails = orderDtails;
      event.products = products;
      event.productDetails = productDetails;
      event.retryCount = retryCount;
      this.emitter.emit(IssueGuaranteeEvent.Key, event);
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);

      await this.sqsService.send(
        SQS_METADATA[GetProductDetailEvent.Key](
          interwork,
          orders,
          orderDtails,
          products,
          retryCount
        )
      );
    }
  }

  async issueGuarantee(
    interwork: NaverStoreInterwork,
    orders: ChangedOrder[],
    orderDtails: OrderDetail[],
    products: NaverProduct[],
    productDetails: NaverProductDetail[],
    retryCount = 0
  ) {
    try {
      const payload = {
        brandIdx: interwork.partnerInfo?.brand?.idx,
        warranty: interwork.partnerInfo?.warrantyDate,
        nftState: interwork.issueSetting.isAutoIssue
          ? NFT_STATUS.REQUESTED
          : NFT_STATUS.READY,
        orderId: orderDtails[0].productOrder.productOrderId,
        ordererTel: orderDtails[0].order.ordererTel,
        ordererName: orderDtails[0].order.ordererName,
        orderedAt: orderDtails[0].order.orderDate,
        price: orderDtails[0].order.generalPaymentAmount,
        platformName: orderDtails[0].productOrder.inflowPath,
        productName: productDetails[0].originProduct.name,
        image: productDetails[0].originProduct.images.representativeImage.url,
        category: productDetails[0].originProduct.leafCategoryId,
        size: undefined,
        modelNum: undefined,
        weight: undefined,
        material: undefined,
      } as ReqGuaranteePayload;
      await this.vircleCoreApi
        .requestGuarantee(interwork.coreApiToken, payload)
        .catch((e) => {
          console.log(e);
          throw e;
        });
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);

      // await this.sqsService.send(
      //   SQS_METADATA[IssueGuaranteeEvent.Key](
      //     interwork,
      //     orders,
      //     orderDtails,
      //     products,
      //     retryCount
      //   )
      // );
    }
  }

  // private createReqGuaranteePayload(): ReqGuaranteePayload {
  //   return {
  //     brandIdx,
  //     category,
  //     image,
  //     material,
  //     modelNum,
  //     nftState,
  //     orderId,
  //     orderedAt,
  //     ordererName,
  //     ordererTel,
  //     platformName,
  //     price,
  //     productName,
  //     size,
  //     warranty,
  //     weight,
  //   };
  // }
}
