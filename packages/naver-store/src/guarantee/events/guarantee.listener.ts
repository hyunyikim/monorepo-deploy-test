import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
  GetChangedOrderListEvent,
  GetOrderDetailEvent,
} from "src/guarantee/events/guarantee.event";
import { GuaranteeService } from "src/guarantee/guarantee.service";

@Injectable()
export class GuaranteeEventListener {
  constructor(private guaranteeService: GuaranteeService) {}

  @OnEvent(GetChangedOrderListEvent.Key, { async: true })
  async handleChangedOrderList(event: GetChangedOrderListEvent) {
    const { interwork, retryCount } = event;
    await this.guaranteeService.getChangedOrderList(interwork, retryCount);
  }

  @OnEvent(GetOrderDetailEvent.Key, { async: true })
  async handleOrderDetail(event: GetOrderDetailEvent) {
    const { interwork, orders, retryCount } = event;
    await this.guaranteeService.getOrderDetailList(
      interwork,
      orders,
      retryCount
    );
  }
}
