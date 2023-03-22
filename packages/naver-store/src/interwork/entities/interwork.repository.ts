import { Injectable } from "@nestjs/common";
import { DynamoDB } from "aws-sdk";
import { plainToInstance } from "class-transformer";

import { NaverStoreInterwork } from "src/interwork/entities/interwork.entity";

@Injectable()
export class InterworkRepository {
  constructor(
    private ddbClient: DynamoDB.DocumentClient,
    private tableName: string
  ) {}

  async getInterworkByAccountId(accountId: string) {
    const { Item } = await this.ddbClient
      .get({
        TableName: this.tableName,
        Key: {
          accountId,
        },
      })
      .promise();

    return Item ? plainToInstance(NaverStoreInterwork, Item) : null;
  }

  async getInterworkByToken(token: string) {
    const interworks = await this.getAll();
    return interworks.find((interwork) => interwork.accessToken === token);
  }

  async putInterwork(interwork: Partial<NaverStoreInterwork>) {
    await this.ddbClient
      .put({
        TableName: this.tableName,
        Item: interwork,
        ReturnValues: "ALL_OLD",
      })
      .promise()
      .catch((e) => {
        console.log(e);
      });
  }

  async getInterworkByPartner(partnerIdx: number) {
    const { Items } = await this.ddbClient
      .query({
        TableName: this.tableName,
        IndexName: "partnerIdx-index",
        KeyConditionExpression: "partnerIdx = :idx",
        ExpressionAttributeValues: {
          ":idx": partnerIdx,
        },
      })
      .promise();

    return Items && Items.length > 0
      ? plainToInstance(NaverStoreInterwork, Items.pop())
      : null;
  }

  async deleteInterworkItem(mallId: string) {
    await this.ddbClient
      .delete({
        TableName: this.tableName,
        Key: { mallId },
      })
      .promise();
  }

  async getAll() {
    const { Items: list } = await this.ddbClient
      .scan({ TableName: this.tableName })
      .promise();
    if (!list) {
      return [];
    }

    return plainToInstance(NaverStoreInterwork, list);
  }

  async getAllWithoutUnlinked() {
    const { Items: list } = await this.ddbClient
      .scan({ TableName: this.tableName })
      .promise();
    if (!list) {
      return [];
    }

    return plainToInstance(NaverStoreInterwork, list).filter(
      (interwork) => !interwork.reasonForLeave
    );
  }
}
