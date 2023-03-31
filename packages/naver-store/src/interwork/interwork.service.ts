import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { plainToInstance } from "class-transformer";
import { DateTime } from "luxon";

import { TokenInfo } from "src/common/getToken.decorator";
import { Partnership, VircleApiHttpService } from "src/common/vircle-api.http";
import { UpdateSettingDto } from "src/interwork/dto/update-category-list.dto";
import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { NaverStoreApi } from "src/naver-api/naver-store.api";

import { NaverStoreInterwork, IssueSetting } from "./entities/interwork.entity";

@Injectable()
export class InterworkService {
  constructor(
    private naverApi: NaverStoreApi,
    private interworkRepo: InterworkRepository,
    private vircleCoreHttp: VircleApiHttpService
  ) {}

  async initInterwork(accountId: string, { token }: TokenInfo) {
    const account = await this.interworkRepo.getInterworkByAccountId(accountId);
    if (account) {
      account.tokenInfo.isAlreadyExist = true;
      return account.tokenInfo;
    }
    const partnership = await this.vircleCoreHttp.getPartnerInfo(token);

    return await this.initToken({
      accountId,
      partnership,
      coreApiToken: token,
    });
  }

  async isReadyToInterwork(accountId: string) {
    return await this.naverApi.generateToken(accountId);
  }

  async unlinkInterwork(token: TokenInfo, reason: string) {
    const interwork = await this.getInterworkByPartnerToken(token);
    if (!interwork) {
      throw new Error("interwork not found");
    }
    interwork.deletedAt = DateTime.now().toSQL();
    interwork.reasonForLeave = reason;

    await this.interworkRepo.putInterwork(interwork);
    return interwork;
  }

  async initToken({
    accountId,
    partnership,
    coreApiToken,
  }: {
    accountId: string;
    partnership: Partnership;
    coreApiToken: string;
  }) {
    const tokenInfo = await this.naverApi.generateToken(accountId);
    const naverStoreInterwork = plainToInstance(NaverStoreInterwork, {
      accountId,
      tokenInfo,
      createdAt: DateTime.now().toSQL(),
      deletedAt: null,
      reasonForLeave: null,
      partnerIdx: partnership.idx,
      partnerInfo: partnership,
      coreApiToken,
      issueSetting: new IssueSetting(),
    });

    await this.interworkRepo.putInterwork(naverStoreInterwork);
    return tokenInfo;
  }

  async refreshToken(accountId: string, interwork?: NaverStoreInterwork) {
    const tokenInfo = await this.naverApi.generateToken(accountId);
    const naverStoreInterwork =
      interwork ?? (await this.getInterworkByAccountId(accountId));

    if (tokenInfo.access_token === naverStoreInterwork.accessToken) {
      return tokenInfo;
    }

    naverStoreInterwork.tokenInfo = tokenInfo;

    await this.interworkRepo.putInterwork(naverStoreInterwork);
    return tokenInfo;
  }

  async getInterworkByAccountId(accountId: string) {
    const interwork = await this.interworkRepo.getInterworkByAccountId(
      accountId
    );
    if (!interwork) {
      throw new Error("interwork not found");
    }
    return interwork;
  }

  async getInterworkByPartnerToken({ partnerIdx }: TokenInfo) {
    const interwork = await this.interworkRepo.getInterworkByPartner(
      partnerIdx
    );
    if (!interwork || interwork.deletedAt) {
      return null;
      // throw new Error("interwork not found");
    }
    return interwork;
  }

  async getCategories() {
    return await this.naverApi.getHighistCategories();
  }

  async updateSetting(token: TokenInfo, setting: UpdateSettingDto) {
    const interwork = await this.getInterworkByPartnerToken(token);

    if (!interwork) {
      throw new Error("no interwork");
    }

    Object.assign(interwork.issueSetting, setting);
    await this.interworkRepo.putInterwork(interwork);
    return true;
  }
}
