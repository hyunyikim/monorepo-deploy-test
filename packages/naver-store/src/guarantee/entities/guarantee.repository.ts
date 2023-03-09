import { Injectable } from "@nestjs/common";
import { DynamoDB } from "aws-sdk";
import { DateTime } from "luxon";

import { NaverStoreGuarantee } from "src/guarantee/entities/guarantee.entity";

@Injectable()
export class GuaranteeRequestRepository {
  constructor(
    private ddbClient: DynamoDB.DocumentClient,
    private tableName: string
  ) {}

  async putRequest(req: Partial<NaverStoreGuarantee>) {
    return await this.ddbClient
      .put({
        TableName: this.tableName,
        Item: req,
        ReturnValues: "ALL_OLD",
      })
      .promise();
  }

  async updateCanceledRequest(
    idx: number,
    payload: {
      traceId: string;
      orderItemCode: string;
    }
  ) {
    await this.ddbClient
      .update({
        TableName: this.tableName,
        Key: {
          reqIdx: idx,
        },
        UpdateExpression:
          "set cancelTraceId = :traceId, orderItemCode = :orderItemCode, canceledAt = :canceledAt",
        ExpressionAttributeValues: {
          ":traceId": payload.traceId,
          ":orderItemCode": payload.orderItemCode,
          ":canceledAt": DateTime.now().toISO(),
        },
      })
      .promise();
  }

  async deleteRequestItem(idx: number) {
    await this.ddbClient
      .delete({
        TableName: this.tableName,
        Key: {
          reqIdx: idx,
        },
      })
      .promise();
  }

  async getAll() {
    return await this.ddbClient.scan({ TableName: this.tableName }).promise();
  }
}
