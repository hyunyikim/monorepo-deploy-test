import { Controller, Get, Query } from "@nestjs/common";

import { GuaranteeService } from "./guarantee.service";

@Controller("guarantee")
export class GuaranteeController {
  constructor(private readonly guaranteeService: GuaranteeService) {}

  @Get()
  startIssueGuarantee(@Query("from") from: Date) {
    return this.guaranteeService.startIssueGuarantee(from);
  }
}
