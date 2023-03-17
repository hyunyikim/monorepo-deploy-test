import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AxiosError } from "axios";

import { eProductOrderStatus } from "src/common/enums/product-order-status.enum";
import {
  ReqGuaranteePayload,
  VircleApiHttpService,
} from "src/common/vircle-api.http";
import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { NaverStoreApi } from "src/naver-api/naver-store.api";
import {
  ChangedOrder,
  OrderDetail,
} from "src/naver-api/interfaces/naver-store-api.interface";
import {
  GetChangedOrderListEvent,
  GetOrderDetailEvent,
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

      const event = new IssueGuaranteeEvent();
      event.interwork = interwork;
      event.orders = orders;
      event.orderDetails = orderDetailList;
      event.retryCount = retryCount;
      this.emitter.emit(IssueGuaranteeEvent.Key, event);
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);

      await this.sqsService.send(
        SQS_METADATA[GetOrderDetailEvent.Key](interwork, orders, retryCount)
      );
    }
  }

  /**
   * 카테고리 여부에 따라 개런티 발급 필터
   */
  async filterCategories() {}

  async issueGuarantee(
    interwork: NaverStoreInterwork,
    orderDtails: OrderDetail[]
  ) {
    orderDtails.map((order) => {
      order.productOrder.sellerCustomCode1;
    });
    // await this.vircleCoreApi.requestGuarantee(interwork.coreApiToken, {});
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
