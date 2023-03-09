import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { DateTime } from "luxon";

import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { NaverStoreApi } from "src/naver-api/naver-store.api";

import { UpdateInterworkDto } from "./dto/update-interwork.dto";
import { NaverStoreInterwork } from "./entities/interwork.entity";

@Injectable()
export class InterworkService {
  constructor(
    private naverApi: NaverStoreApi,
    private interworkRepo: InterworkRepository
  ) {}
  async initInterwork(accountId: string) {
    const account = await this.getInterwork(accountId);
    if (account) {
      return account;
    }

    return await this.initToken(accountId);
  }

  async initToken(accountId: string) {
    const tokenInfo = await this.naverApi.generateToken(accountId);
    const naverStoreInterwork = plainToInstance(NaverStoreInterwork, {
      accountId,
      tokenInfo,
      createdAt: DateTime.now().toSQL(),
      deletedAt: null,
      reasonForLeave: null,
    });
    await this.interworkRepo.putInterwork(naverStoreInterwork);
    return tokenInfo;
  }

  async refreshToken(accountId: string) {
    const tokenInfo = await this.naverApi.generateToken(accountId);
    const naverStoreInterwork = plainToInstance(NaverStoreInterwork, {
      accountId,
      tokenInfo,
    });
    await this.interworkRepo.putInterwork(naverStoreInterwork);
    return tokenInfo;
  }

  async getInterwork(accountId: string) {
    return await this.interworkRepo.getInterwork(accountId);
  }

  findAll() {
    return `This action returns all interwork`;
  }

  findOne(id: number) {
    return `This action returns a #${id} interwork`;
  }

  update(id: number, updateInterworkDto: UpdateInterworkDto) {
    return `This action updates a #${id} interwork`;
  }

  remove(id: number) {
    return `This action removes a #${id} interwork`;
  }
}
