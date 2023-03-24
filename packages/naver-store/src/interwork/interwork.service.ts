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
      issueSetting: new IssueSetting(),
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

  async refreshTokenByOldToken(oldToken: string) {
    const naverStoreInterwork = (await this.interworkRepo.getInterworkByToken(
      oldToken
    )) as NaverStoreInterwork;

    const tokenInfo = await this.naverApi.generateToken(
      naverStoreInterwork.accountId
    );
    naverStoreInterwork.tokenInfo = tokenInfo;

    await this.interworkRepo.putInterwork(naverStoreInterwork);
    return tokenInfo.access_token;
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

  async getInterworkByPartner({ partnerIdx }: TokenInfo) {
    const interwork = await this.interworkRepo.getInterworkByPartner(
      partnerIdx
    );
    if (!interwork) {
      throw new Error("interwork not found");
    }
    return interwork;
  }

  async getCategories() {
    return await this.naverApi.getHighistCategories();
  }

  async updateSetting(accountId: string, setting: UpdateSettingDto) {
    const interwork = await this.interworkRepo.getInterworkByAccountId(
      accountId
    );

    if (!interwork) {
      throw new Error("no interwork");
    }

    Object.assign(interwork.issueSetting, setting);
    await this.interworkRepo.putInterwork(interwork);
    return true;
  }
}
