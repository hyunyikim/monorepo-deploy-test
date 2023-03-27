import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Delete,
  Query,
  Body,
  Put,
} from "@nestjs/common";
import { ApiBearerAuth, ApiParam } from "@nestjs/swagger";

import { GetToken, TokenInfo } from "src/common/getToken.decorator";
import { JwtAuthGuard } from "src/common/jwtAuth.guard";
import { UpdateSettingDto } from "src/interwork/dto/update-category-list.dto";

import { InterworkService } from "./interwork.service";

@UseGuards(JwtAuthGuard)
@ApiBearerAuth("Token")
@Controller("interwork")
export class InterworkController {
  constructor(private readonly interworkService: InterworkService) {}

  @Post(":accountId")
  @ApiParam({ name: "accountId", example: "ncp_1njkqz_02" })
  initInterwork(
    @GetToken() token: TokenInfo,
    @Param("accountId") accountId: string
  ) {
    return this.interworkService.initInterwork(accountId, token);
  }

  @Delete()
  unlinkInterwork(
    @GetToken() token: TokenInfo,
    @Query("reason") reason: string
  ) {
    return this.interworkService.unlinkInterwork(token, reason);
  }

  @Post(":accountId/refresh")
  @ApiParam({ name: "accountId", example: "ncp_1njkqz_02" })
  refreshToken(@Param("accountId") accountId: string) {
    return this.interworkService.refreshToken(accountId);
  }

  @Get()
  getInterwork(@GetToken() token: TokenInfo) {
    return this.interworkService.getInterworkByPartnerToken(token);
  }

  @Get("category")
  getCategories() {
    return this.interworkService.getCategories();
  }

  @Put("setting")
  updateSettings(@GetToken() token: TokenInfo, @Body() dto: UpdateSettingDto) {
    return this.interworkService.updateSetting(token, dto);
  }
}
