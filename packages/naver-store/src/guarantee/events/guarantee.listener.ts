import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import { GuaranteeEvent } from "src/guarantee/entities/guarantee-event.entity";
import { eEventKey } from "src/guarantee/enums/event-key.enum";
import { GuaranteeService } from "src/guarantee/guarantee.service";

@Injectable()
export class GuaranteeEventListener {
  constructor(private guaranteeService: GuaranteeService) {}

  @OnEvent(eEventKey.GetChangedOrderListEvent, { async: true })
  async handleChangedOrderList(event: GuaranteeEvent) {
    await this.guaranteeService.getChangedOrderList(event.interwork);
  }

  @OnEvent(eEventKey.GetOrderDetailEvent, { async: true })
  async handleOrderDetail(event: GuaranteeEvent) {
    await this.guaranteeService.getOrderDetailList(event);
  }

  @OnEvent(eEventKey.GetProductDetailEvent, { async: true })
  async handleGetProductDetail(event: GuaranteeEvent) {
    await this.guaranteeService.getProductDetails(event);
  }

  @OnEvent(eEventKey.GetCategoryEvent, { async: true })
  async handleGetCategory(event: GuaranteeEvent) {
    await this.guaranteeService.getCategory(event);
  }

  @OnEvent(eEventKey.IssueGuaranteeEvent, { async: true })
  async handleIssueGuarantee(event: GuaranteeEvent) {
    await this.guaranteeService.handleGuarantee(event);
  }
}
