import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";

import {
  GetChangedOrderListEvent,
  GetOrderDetailEvent,
  GetProductDetailEvent,
  GetProductListEvent,
  IssueGuaranteeEvent,
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

  @OnEvent(GetProductListEvent.Key, { async: true })
  async handleGetProductList(event: GetProductListEvent) {
    const { interwork, orders, retryCount, orderDetails } = event;
    await this.guaranteeService.getProducts(
      interwork,
      orders,
      orderDetails,
      retryCount
    );
  }

  @OnEvent(GetProductDetailEvent.Key, { async: true })
  async handleGetProductDetail(event: GetProductDetailEvent) {
    const { interwork, orders, retryCount, orderDetails, products } = event;
    await this.guaranteeService.getProductDetails(
      interwork,
      orders,
      orderDetails,
      products,
      retryCount
    );
  }

  @OnEvent(IssueGuaranteeEvent.Key, { async: true })
  async handleIssueGuarantee(event: IssueGuaranteeEvent) {
    const {
      interwork,
      orders,
      retryCount,
      orderDetails,
      products,
      productDetails,
    } = event;
    await this.guaranteeService.issueGuarantee(
      interwork,
      orders,
      orderDetails,
      products,
      productDetails,
      retryCount
    );
  }
}
