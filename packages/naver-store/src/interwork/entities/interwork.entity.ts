import { Exclude, Type } from "class-transformer";
import {
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { DateTime } from "luxon";

import { GetAccessTokenResponse } from "src/naver-api/interfaces/naver-store-api.interface";

export class NaverStoreInterwork {
  @IsNumber()
  id: number;

  @IsString()
  accountId: string;

  @Exclude({ toPlainOnly: true })
  @IsObject()
  @ValidateNested()
  @Type(() => GetAccessTokenResponse)
  tokenInfo: GetAccessTokenResponse;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string = DateTime.now().toSQL();

  @IsDateString()
  @IsOptional()
  deletedAt: string | null;

  @IsString()
  @IsOptional()
  reasonForLeave: string | null;

  async getAccessToken() {
    return this.tokenInfo.access_token;
  }
}
