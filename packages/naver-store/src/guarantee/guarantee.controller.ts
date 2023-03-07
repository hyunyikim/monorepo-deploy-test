import { Controller, Get, Query } from "@nestjs/common";

import { GuaranteeService } from "./guarantee.service";

@Controller("guarantee")
export class GuaranteeController {
  constructor(private readonly guaranteeService: GuaranteeService) {}

  @Get()
  findAll(@Query("token") token: string) {
    return this.guaranteeService.getOrderList(token);
  }
}
