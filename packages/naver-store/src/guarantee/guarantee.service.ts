import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AxiosError } from "axios";
import { plainToInstance } from "class-transformer";
import { Cron } from "@nestjs/schedule";

import { eProductOrderStatus } from "src/common/enums/product-order-status.enum";
import { VircleApiHttpService } from "src/common/vircle-api.http";
import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { NaverStoreApi } from "src/naver-api/naver-store.api";
import {
  ChangedOrder,
  OrderDetail,
} from "src/naver-api/interfaces/naver-store-api.interface";
import { SqsService } from "src/common/sqs/sqs.service";
import { SlackReporter } from "src/common/slack";
import { InterworkService } from "src/interwork/interwork.service";
import { GuaranteeRequestRepository } from "src/guarantee/entities/guarantee.repository";
import { GuaranteeEvent } from "src/guarantee/entities/guarantee-event.entity";
import { eEventKey } from "src/guarantee/enums/event-key.enum";
import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";

const SQS_PARAM = (key: eEventKey, guaranteeEvent: GuaranteeEvent) => ({
  MessageBody: JSON.stringify({
    key,
    guaranteeEvent,
  }),
  MessageAttributes: {
    accountId: {
      DataType: "String",
      StringValue: guaranteeEvent.interwork.accountId,
    },
    partnerIdx: {
      DataType: "Number",
      StringValue: `${guaranteeEvent.interwork.partnerIdx}`,
    },
  },
});

@Injectable()
export class GuaranteeService {
  constructor(
    private api: NaverStoreApi,
    private interworkRepo: InterworkRepository,
    private guaranteeRepo: GuaranteeRequestRepository,
    private vircleCoreApi: VircleApiHttpService,
    private emitter: EventEmitter2,
    private sqsService: SqsService,
    private slackReporter: SlackReporter,
    private interworkService: InterworkService
  ) {}
  // {30}초마다 이벤트 실행
  // 전체 연동된 업체 리스트 조회 (이탈한 업체 제외) (OK)
  // 각 업체의 주문 변경 이력 획득
  // 각 변경 이력의 상세 주문 정보 획득
  // 각 상세 주문의 상품 정보 획득
  // 각 상품의 상세 정보 획득 (이미지를 위해) (딜레이 고려해야됨)
  // 카테고리 사용유무에 따라 사용할경우 필터

  //
  // 개런티 발급
  // 톡톡 or 알림톡 발송

  // 만약 실패나면 sqs 전송
  // sqs 에서 주기적으로 꺼내서 다시 이벤트 실행

  @Cron("*/5 * * * * *", { name: "RETRY_NAVER_EVENT" })
  async retryNaverEvent() {
    const message = await this.sqsService.consume();
    if (message) {
      const param = JSON.parse(message.Body as string) as {
        key: eEventKey;
        guaranteeEvent: GuaranteeEvent;
      };
      ++param.guaranteeEvent.retryCount;
      if (param.guaranteeEvent.retryCount > 3) {
        this.slackReporter.sendWebhookFailed();
        Logger.error({
          message: "Tried naver request 3 times but finally failed",
          param,
        });
        throw new Error("Tried naver request 3 times but finally failed");
      } else {
        this.emitter.emit(
          param.key,
          plainToInstance(GuaranteeEvent, param.guaranteeEvent)
        );
      }
    }
  }

  // @Cron("0 * * * * *")
  async startIssueGuarantee() {
    Logger.log("startIssueGuarantee");
    const interworks = await this.interworkRepo.getAllWithoutUnlinked();
    for (const interwork of interworks) {
      await this.interworkService
        .refreshToken(interwork.accountId)
        .catch((e) => {
          throw new Error("토큰 갱신 실패");
        }); // 토큰 갱신 후 시작

      const guaranteeEvent = new GuaranteeEvent();
      guaranteeEvent.interwork = interwork;

      await this.getChangedOrderList(guaranteeEvent);
    }
  }

  async getChangedOrderList(guaranteeEvent: GuaranteeEvent) {
    try {
      const { interwork } = guaranteeEvent;
      const stateFilter = [
        eProductOrderStatus.DELIVERED, // 개런티 발급 완료
        eProductOrderStatus.PURCHASE_DECIDED, // 개런티 발급 완료
        eProductOrderStatus.CANCELED, // 개런티 발급 취소
        eProductOrderStatus.CANCELED_BY_NOPAYMENT, // 개런티 발급 취소
        eProductOrderStatus.EXCHANGED, // 개런티 발급 취소 -> 개런티 발급
      ];
      const orderList = await this.api.getChangedOrderList(
        interwork.accessToken
      );

      if (!orderList.length) {
        Logger.log("변경된 주문 없음.");
        return;
      }
      // TODO: 결제완료 알림 전송
      await this.sendIntroGuarantee(orderList, interwork);

      const guarantees = await this.guaranteeRepo.getAll();

      /**
       * 1. 필터에 해당되는 상태의 주문 추가
       * 2. 해당 주문번호로 저장된 개런티가 있을 경우 상태가 바뀐 주문만 추가
       * 3. 해당 주문번호로 저장된 개런티가 없을 경우 추가
       */
      const filteredList = orderList
        .filter((order) => stateFilter.includes(order.productOrderStatus))
        .filter((order) => {
          const guarantee = guarantees.find(
            (guarantee) => order.productOrderId === guarantee.productOrderId
          );
          return guarantee
            ? guarantee.productOrderStatus !== order.productOrderStatus
            : true;
        });

      if (!filteredList.length) {
        Logger.log("처리할 주문 없음");
        return;
      }

      guaranteeEvent.orders = filteredList;
      this.emitter.emit(eEventKey.GetOrderDetailEvent, guaranteeEvent);
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);
      await this.sqsService.send(
        SQS_PARAM(eEventKey.GetChangedOrderListEvent, guaranteeEvent)
      );
    }
  }

  async getOrderDetailList(guaranteeEvent: GuaranteeEvent) {
    const { interwork, orders } = guaranteeEvent;
    try {
      const orderDetailList = await this.api.getOrderDetailList(
        interwork.accessToken,
        orders.map((order) => order.productOrderId)
      );

      guaranteeEvent.orders.forEach((order) => {
        order.orderDetail = orderDetailList.find(
          (detail) =>
            detail.productOrder.productOrderId === order.productOrderId
        ) as OrderDetail;
      });

      this.emitter.emit(eEventKey.GetProductDetailEvent, guaranteeEvent);
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);
      await this.sqsService.send(
        SQS_PARAM(eEventKey.GetOrderDetailEvent, guaranteeEvent)
      );
    }
  }

  async getProductDetails(guaranteeEvent: GuaranteeEvent) {
    try {
      const { interwork, orders } = guaranteeEvent;
      // if (interwork.isUsingCategory) {
      //   this.filterCategories(guaranteeEvent);
      // }

      for (const order of orders) {
        // TODO: 딜레이 고려
        const productDetail = await this.api.getProductDetail(
          order.orderDetail.productOrder.productId,
          interwork.accessToken
        );
        order.productDetail = productDetail;
      }

      if (interwork.isUsingCategory) {
        this.emitter.emit(eEventKey.GetCategoryEvent, guaranteeEvent);
      } else {
        this.emitter.emit(eEventKey.IssueGuaranteeEvent, guaranteeEvent);
      }
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);

      await this.sqsService.send(
        SQS_PARAM(eEventKey.GetProductDetailEvent, guaranteeEvent)
      );
    }
  }

  async getCategory(guaranteeEvent: GuaranteeEvent) {
    try {
      const { interwork, orders } = guaranteeEvent;

      for (const order of orders) {
        const category = await this.api.getCategory(
          order.productDetail.originProduct.leafCategoryId,
          interwork.accessToken
        );
        order.category = category;
        this.filterCategories(interwork, order);
      }

      this.emitter.emit(eEventKey.IssueGuaranteeEvent, guaranteeEvent);
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);

      await this.sqsService.send(
        SQS_PARAM(eEventKey.GetCategoryEvent, guaranteeEvent)
      );
    }
  }

  async handleGuarantee(guaranteeEvent: GuaranteeEvent) {
    try {
      throw new Error("test");
      // for (const order of guaranteeEvent.orders) {
      //   switch (order.productOrderStatus) {
      //     case eProductOrderStatus.DELIVERED:
      //     case eProductOrderStatus.PURCHASE_DECIDED: {
      //       this.issueGuarantee(order, guaranteeEvent);
      //       break;
      //     }
      //     case eProductOrderStatus.CANCELED:
      //     case eProductOrderStatus.RETURNED: {
      //       await this.cancelGuarantee(order, guaranteeEvent);
      //       break;
      //     }
      //     case eProductOrderStatus.EXCHANGED: {
      //       await this.cancelGuarantee(order, guaranteeEvent);
      //       await this.issueGuarantee(order, guaranteeEvent);
      //     }
      //   }
      // }
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);
      await this.sqsService.send(
        SQS_PARAM(eEventKey.IssueGuaranteeEvent, guaranteeEvent)
      );
    }
  }

  async issueGuarantee(order: ChangedOrder, guaranteeEvent: GuaranteeEvent) {
    if (!order.isFiltered) {
      const payload = guaranteeEvent.setProductDetailInfoToPayload(
        order.productDetail
      );
      guaranteeEvent.setOrderDetailInfoToPayload(payload, order.orderDetail);
      guaranteeEvent.setInterworkInfoToPayload(
        payload,
        guaranteeEvent.interwork
      );
      const reqNft = await this.vircleCoreApi
        .requestGuarantee(guaranteeEvent.interwork.coreApiToken, payload)
        .catch((e) => {
          console.log(e);
          throw e;
        });

      await this.guaranteeRepo.putRequest({
        productOrderId: order.productOrderId,
        productOrderStatus: order.productOrderStatus,
        reqNftId: reqNft.nft_req_idx,
        reqNftStatus: reqNft.nft_req_state,
        accountId: guaranteeEvent.interwork.accountId,
        productId: order.orderDetail.productOrder.productId,
        categoryId: order.category?.id,
        guaranteeEvent,
      });
    }
  }

  /**
   * 카테고리 여부에 따라 개런티 발급 필터
   */
  private filterCategories(
    interwork: NaverStoreInterwork,
    order: ChangedOrder
  ) {
    interwork.issueSetting.issueCategories.forEach((category) => {
      const isSameCategory =
        order.category.wholeCategoryName.split(">")[0] === category.name;
      if (!isSameCategory) {
        order.isFiltered = true;
      }
    });
  }

  private async sendIntroGuarantee(
    orders: ChangedOrder[],
    interwork: NaverStoreInterwork
  ) {
    const payedList = orders.filter(
      (order) => order.productOrderStatus === eProductOrderStatus.PAYED
    );
  }

  private async cancelGuarantee(
    order: ChangedOrder,
    guaranteeEvent: GuaranteeEvent
  ) {
    const { interwork } = guaranteeEvent;
    await this.vircleCoreApi.cancelGuarantee(
      interwork.coreApiToken,
      order.productOrderId
    );
  }
}
