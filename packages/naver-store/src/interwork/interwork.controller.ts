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
import { UpdateCategoryListDto } from "src/interwork/dto/update-category-list.dto";

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

  @Delete(":accountId")
  @ApiParam({ name: "accountId", example: "ncp_1njkqz_02" })
  unlinkInterwork(
    @Param("accountId") accountId: string,
    @Query("reason") reason: string
  ) {
    return this.interworkService.unlinkInterwork(accountId, reason);
  }

  @Post(":accountId/refresh")
  @ApiParam({ name: "accountId", example: "ncp_1njkqz_02" })
  refreshToken(@Param("accountId") accountId: string) {
    return this.interworkService.refreshToken(accountId);
  }

  @Get()
  getInterwork(@GetToken() token: TokenInfo) {
    return this.interworkService.getInterworkByToken(token);
  }

  @Get("category")
  getCategories(@Query("token") naverToken: string) {
    return this.interworkService.getCategories(naverToken);
  }

  @Put(":accountId/category")
  updateCategories(
    @Param("accountId") accountId: string,
    @Body() dto: UpdateCategoryListDto
  ) {
    return this.interworkService.updateCategories(accountId, dto.categories);
  }
}
