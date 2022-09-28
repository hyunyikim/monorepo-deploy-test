import {Injectable} from '@nestjs/common';
import {DynamoDB} from 'aws-sdk';
import {plainToInstance} from 'class-transformer';
import {DateTime} from 'luxon';
import {GuaranteeRequest} from '../cafe24Interwork/guaranteeReq.entity';

@Injectable()
export class GuaranteeRequestRepository {
	constructor(
		private ddbClient: DynamoDB.DocumentClient,
		private tableName: string
	) {}

	async getRequest(reqIdx: number, mallId: string) {
		const {Item} = await this.ddbClient
			.get({
				TableName: this.tableName,
				Key: {
					reqIdx,
					mallId,
				},
			})
			.promise();

		return Item ? plainToInstance(GuaranteeRequest, Item) : null;
	}

	async getRequestListByOrderId(orderId: string, mallId: string) {
		const {Items} = await this.ddbClient
			.query({
				TableName: this.tableName,
				IndexName: 'orderId-index',
				KeyConditionExpression: 'orderId = :id and mallId = :mId',
				ExpressionAttributeValues: {
					':id': orderId,
					':mId': mallId,
				},
			})
			.promise();

		if (!Items) return [];
		return plainToInstance(GuaranteeRequest, Items);
	}

	async getRequestListByOrderItemCode(orderItemCode: string, mallId: string) {
		const {Items} = await this.ddbClient
			.query({
				TableName: this.tableName,
				IndexName: 'orderItemCode-index',
				KeyConditionExpression:
					'orderItemCode = :id and mallId = :mId and canceledAt = :canceledAt',
				ExpressionAttributeValues: {
					':id': orderItemCode,
					':mId': mallId,
					':canceledAt': null,
				},
			})
			.promise();

		if (!Items) return [];
		return plainToInstance(GuaranteeRequest, Items);
	}

	async putRequest(req: Partial<GuaranteeRequest>) {
		await this.ddbClient
			.put({
				TableName: this.tableName,
				Item: req,
				ReturnValues: 'ALL_OLD',
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
					'set cancelTraceId = :traceId, orderItemCode = :orderItemCode, canceledAt = :canceledAt',
				ExpressionAttributeValues: {
					':traceId': payload.traceId,
					':orderItemCode': payload.orderItemCode,
					':canceledAt': DateTime.now().toISO(),
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
		return await this.ddbClient.scan({TableName: this.tableName}).promise();
	}
}
