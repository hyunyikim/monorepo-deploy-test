import { Controller, Get, Post, Param } from "@nestjs/common";

import { InterworkService } from "./interwork.service";

@Controller("interwork")
export class InterworkController {
  constructor(private readonly interworkService: InterworkService) {}

  @Post(":accountId")
  initInterwork(@Param("accountId") accountId: string) {
    return this.interworkService.initInterwork(accountId);
  }

  @Get()
  findAll() {
    return this.interworkService.refreshToken("ncp_1njkqz_02");
  }
}
