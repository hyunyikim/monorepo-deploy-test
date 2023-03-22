import { Exclude, Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInstance,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { DateTime } from "luxon";

import { Partnership } from "src/common/vircle-api.http";
import {
  GetAccessTokenResponse,
  InterworkCategory,
} from "src/naver-api/interfaces/naver-store-api.interface";

export type IssueTiming = "AFTER_SHIPPING" | "AFTER_DELIVERED";
export class IssueSetting {
  @IsBoolean()
  isAutoIssue = true;

  @IsString()
  issueTiming: IssueTiming = "AFTER_DELIVERED";

  @IsBoolean()
  useCategory = false;

  @IsArray()
  issueCategories: InterworkCategory[] = [];

  @IsBoolean()
  issueIntro?: boolean = true;
}
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

  @IsNumber()
  @IsNotEmpty()
  partnerIdx: number;

  @IsInstance(Partnership)
  partnerInfo: Partnership;

  @IsString()
  coreApiToken: string;

  @IsObject()
  @ValidateNested()
  @Type(() => IssueSetting)
  issueSetting: IssueSetting;

  get accessToken() {
    return this.tokenInfo.access_token;
  }

  get isUsingCategory() {
    return this.issueSetting.useCategory;
  }
}
