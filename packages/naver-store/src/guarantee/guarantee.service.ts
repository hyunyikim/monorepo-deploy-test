import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
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
import { sleep } from "src/common/utils/sleep.util";
import { NaverStoreGuarantee } from "src/guarantee/entities/guarantee.entity";

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
const DELAY_SECONDS = 1000;

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

  /*********************************************
   ************** 개런티 발급 프로세스 **************
   *********************************************/

  /**
   * 1. 연동된 업체 조회 (연동 해제된 업체 제외)
   * 2. 각 업체별 토큰 갱신
   * 3. 변경된 주문 조회 (상태값에 따라 이벤트 분기 처리)
   * 4. 주문 상세 정보 조회
   * 5. 주문별 상품 상세 조회
   * 6. 카테고리 조회 (연동 정보에 카테고리 사용 여부가 true일 때만)
   * 7. 주문 상태별 분기처리
   */

  // TODO: 연동 도중 토큰 만료되면?

  // TODO: prod 나갈때 주석 풀 것.
  // @Cron("0 * * * * *")
  async startIssueGuarantee(from?: Date) {
    Logger.log("startIssueGuarantee");
    const interworks = await this.interworkRepo.getAllWithoutUnlinked();
    for (const interwork of interworks) {
      await this.interworkService
        .refreshToken(interwork.accountId, interwork)
        .catch((e) => {
          throw new Error("토큰 갱신 실패");
        }); // 토큰 갱신 후 시작

      await this.getChangedOrderList(interwork, from);
    }
  }

  async getChangedOrderList(interwork: NaverStoreInterwork, from?: Date) {
    try {
      let orders = await this.api.getChangedOrderList(
        interwork.accessToken,
        from
      );
      const guarantees = await this.guaranteeRepo.getAll();
      orders = orders.filter((order) => {
        const guarantee = guarantees.find(
          (guarantee) => guarantee.productOrderId === order.productOrderId
        );
        if (guarantee) {
          return guarantee.productOrderStatus !== order.productOrderStatus;
        } else {
          return true;
        }
      });

      if (!orders.length) {
        Logger.log("변경된 주문 없음.");
        return;
      }

      const payedList = orders.filter(
        (order) => order.productOrderStatus === eProductOrderStatus.PAYED
      );
      const deliveredList = orders.filter((order) =>
        [eProductOrderStatus.DELIVERED, eProductOrderStatus.EXCHANGED].includes(
          order.productOrderStatus
        )
      );
      const elseList = orders.filter((order) =>
        [eProductOrderStatus.CANCELED, eProductOrderStatus.RETURNED].includes(
          order.productOrderStatus
        )
      );

      /**
       * 필터된 주문 리스트에 따라 이벤트 분기처리
       */
      if (payedList.length) {
        //TODO: 결제 완료 시 알림 전송
        // await this.sendIntroGuarantee(payedList, interwork);
      }

      if (deliveredList.length) {
        const guaranteeEvent = new GuaranteeEvent();
        guaranteeEvent.interwork = interwork;
        guaranteeEvent.orders = deliveredList;

        this.emitter.emit(eEventKey.GetOrderDetailEvent, guaranteeEvent);
      }

      if (elseList) {
        const guaranteeEvent = new GuaranteeEvent();
        guaranteeEvent.interwork = interwork;
        const guaranteeOrders = elseList
          .map((order) => {
            const guarantee = guarantees.find(
              (guarantee) => guarantee.productOrderId === order.productOrderId
            ) as NaverStoreGuarantee;

            // 스케줄러가 돌기 전에 취소까지 왔다면?
            if (!guarantee) {
              Logger.log(
                `${order.productOrderId}: 개런티 발급 전 취소 또는 반품됨`
              );
              return null;
            } else {
              Object.assign(guarantee.order, order);
              return guarantee.order;
            }
          })
          .filter((_) => _) as ChangedOrder[]; // 발급 전 취소/반품된 주문 필터
        guaranteeEvent.orders = guaranteeOrders;
        this.emitter.emit(eEventKey.IssueGuaranteeEvent, guaranteeEvent);
      }
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);
      const guaranteeEvent = new GuaranteeEvent();
      guaranteeEvent.interwork = interwork;
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

      for (const order of orders) {
        const productDetail = await this.api.getProductDetail(
          order.orderDetail.productOrder.productId,
          interwork.accessToken
        );
        await sleep(DELAY_SECONDS);
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
      for (const order of guaranteeEvent.orders) {
        switch (order.productOrderStatus) {
          case eProductOrderStatus.DELIVERED: {
            await this.issueGuarantee(order, guaranteeEvent.interwork);
            break;
          }
          case eProductOrderStatus.CANCELED:
          case eProductOrderStatus.RETURNED: {
            await this.cancelGuarantee(order, guaranteeEvent.interwork);
            break;
          }
          case eProductOrderStatus.EXCHANGED: {
            const guaranteeEntity =
              await this.guaranteeRepo.getGuaranteeByOrderId(
                order.productOrderId
              );
            // 발급된 개런티가 있었다면 취소
            if (guaranteeEntity) {
              const interworkEntity =
                (await this.interworkService.getInterworkByAccountId(
                  guaranteeEntity.accountId
                )) as NaverStoreInterwork;
              await this.cancelGuarantee(
                guaranteeEntity.order,
                interworkEntity
              );
            }

            await this.issueGuarantee(order, guaranteeEvent.interwork);
          }
        }
      }
    } catch (e) {
      e instanceof AxiosError ? Logger.error(e.toJSON()) : Logger.error(e);
      await this.sqsService.send(
        SQS_PARAM(eEventKey.IssueGuaranteeEvent, guaranteeEvent)
      );
    }
  }

  async issueGuarantee(order: ChangedOrder, interwork: NaverStoreInterwork) {
    if (!order.isFilteredByCategory) {
      const payload = order.setProductDetailInfoToPayload(order.productDetail);
      order.setOrderDetailInfoToPayload(payload, order.orderDetail);
      order.setInterworkInfoToPayload(payload, interwork);
      order.payload = payload;

      const reqNft = await this.vircleCoreApi
        .requestGuarantee(interwork.coreApiToken, order.payload)
        .catch((e) => {
          console.log(e);
          throw e;
        });

      await this.guaranteeRepo.putRequest({
        productOrderId: order.productOrderId,
        productOrderStatus: order.productOrderStatus,
        reqNftId: reqNft.nft_req_idx,
        reqNftStatus: reqNft.nft_req_state,
        accountId: interwork.accountId,
        productId: order.orderDetail.productOrder.productId,
        categoryId: order.category?.id,
        order,
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
        order.isFilteredByCategory = true;
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
    interwork: NaverStoreInterwork
  ) {
    const nft = await this.vircleCoreApi.cancelGuarantee(
      interwork.coreApiToken,
      order.productOrderId
    );
    const guaranteeEntity = await this.guaranteeRepo.getGuaranteeByOrderId(
      order.productOrderId
    );
    if (guaranteeEntity) {
      guaranteeEntity.order = order;
      guaranteeEntity.canceledAt = order.orderDetail.cancel.cancelCompletedDate;
      guaranteeEntity.canceledNft = nft;
      await this.guaranteeRepo.putRequest(guaranteeEntity);
    }
  }
}
