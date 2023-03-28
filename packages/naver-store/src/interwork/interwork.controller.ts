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
  HttpStatus,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { GetToken, TokenInfo } from "src/common/getToken.decorator";
import { JwtAuthGuard } from "src/common/jwtAuth.guard";
import { ErrorFormat } from "src/common/response-format";
import {
  ApiCommonErrorResponse,
  ApiCommonOkResponse,
} from "src/common/utils/swagger.util";
import { UpdateSettingDto } from "src/interwork/dto/update-category-list.dto";
import { GetAccessTokenResponse } from "src/naver-api/interfaces/naver-store-api.interface";

import { InterworkService } from "./interwork.service";

@ApiTags("네이버 연동 API")
@Controller("interwork")
export class InterworkController {
  constructor(private readonly interworkService: InterworkService) {}

  @ApiOperation({
    summary: "최초 연동",
    description: "최초 연동 생성",
  })
  // @ApiCreatedResponse({
  //   type: GetAccessTokenResponse,
  //   description: "연동 성공 - 토큰정보 응답",
  //   status: HttpStatus.CREATED,
  // })
  // @ApiForbiddenResponse({
  //   description: "accountId가 잘못 들어왔을 때",
  //   type: ErrorFormat,
  // })
  @ApiCommonOkResponse({
    type: GetAccessTokenResponse,
    description: "연동 성공 - 토큰정보 응답",
    status: HttpStatus.CREATED,
  })
  @ApiCommonErrorResponse({
    description: "accountId가 잘못 들어왔을 때",
    type: ErrorFormat,
  })
  @ApiBearerAuth("Token")
  @ApiParam({ name: "accountId", example: "ncp_1njkqz_02" })
  @Post(":accountId")
  @UseGuards(JwtAuthGuard)
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
