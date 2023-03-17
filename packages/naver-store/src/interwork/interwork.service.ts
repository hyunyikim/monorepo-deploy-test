import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { plainToInstance } from "class-transformer";
import { DateTime } from "luxon";

import { TokenInfo } from "src/common/getToken.decorator";
import { Partnership, VircleApiHttpService } from "src/common/vircle-api.http";
import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { NaverCategory } from "src/naver-api/interfaces/naver-store-api.interface";
import { NaverStoreApi } from "src/naver-api/naver-store.api";

import { NaverStoreInterwork, IssueSetting } from "./entities/interwork.entity";

@Injectable()
export class InterworkService {
  constructor(
    private naverApi: NaverStoreApi,
    private interworkRepo: InterworkRepository,
    private vircleCoreHttp: VircleApiHttpService
  ) {}
  @Cron("0 0 */2 * * *")
  async refreshTokenBatch() {
    const interworks = await this.interworkRepo.getAllWithoutUnlinked();
    const result = await Promise.all(
      interworks.map(async (interwork) => ({
        accountId: interwork.accountId,
        partnerIdx: interwork.partnerIdx,
        tokenInfo: await this.refreshToken(interwork.accountId),
      }))
    );
    Logger.log({ ...result });
    return result;
  }

  async initInterwork(accountId: string, { token }: TokenInfo) {
    const account = await this.interworkRepo.getInterworkByAccountId(accountId);
    if (account) {
      return account.tokenInfo.access_token;
    }
    const partnership = await this.vircleCoreHttp.getPartnerInfo(token);

    return await this.initToken({
      accountId,
      partnership,
      coreApiToken: token,
    });
  }

  async unlinkInterwork(accountId: string, reason: string) {
    const interwork = await this.getInterworkByAccountId(accountId);
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
      IssueSetting: new IssueSetting(),
    });

    await this.interworkRepo.putInterwork(naverStoreInterwork);
    return tokenInfo;
  }

  async refreshToken(accountId: string, interwork?: NaverStoreInterwork) {
    const tokenInfo = await this.naverApi.generateToken(accountId);
    const naverStoreInterwork =
      interwork ?? (await this.getInterworkByAccountId(accountId));

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

  async getInterworkByToken({ partnerIdx }: TokenInfo) {
    const interwork = await this.interworkRepo.getInterworkByToken(partnerIdx);
    if (!interwork) {
      throw new Error("interwork not found");
    }
    return interwork;
  }

  async getCategories(token: string) {
    return await this.naverApi.getCategories(token);
  }

  async updateCategories(accountId: string, categories: NaverCategory[]) {
    const interwork = await this.interworkRepo.getInterworkByAccountId(
      accountId
    );

    if (!interwork) {
      throw new Error("no interwork");
    }

    interwork.issueSetting.issueCategories = categories;
    await this.interworkRepo.putInterwork(interwork);
  }
}
