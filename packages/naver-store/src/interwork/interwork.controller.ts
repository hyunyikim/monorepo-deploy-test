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

@Controller("interwork")
export class InterworkController {
  constructor(private readonly interworkService: InterworkService) {}

  @Post(":accountId")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("Token")
  @ApiParam({ name: "accountId", example: "ncp_1njkqz_02" })
  initInterwork(
    @GetToken() token: TokenInfo,
    @Param("accountId") accountId: string
  ) {
    return this.interworkService.initInterwork(accountId, token);
  }

  @Get(":accountId/isReady")
  @ApiParam({ name: "accountId", example: "ncp_1njkqz_02" })
  isReadyToInterwork(@Param("accountId") accountId: string) {
    return this.interworkService.isReadyToInterwork(accountId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("Token")
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("Token")
  getInterwork(@GetToken() token: TokenInfo) {
    return this.interworkService.getInterworkByPartnerToken(token);
  }

  @Get("category")
  getCategories() {
    return this.interworkService.getCategories();
  }

  @Put("setting")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("Token")
  updateSettings(@GetToken() token: TokenInfo, @Body() dto: UpdateSettingDto) {
    return this.interworkService.updateSetting(token, dto);
  }
}
