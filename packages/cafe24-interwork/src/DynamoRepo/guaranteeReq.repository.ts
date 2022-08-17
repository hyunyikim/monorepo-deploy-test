import {Injectable} from '@nestjs/common';
import {DynamoDB} from 'aws-sdk';
import {plainToInstance} from 'class-transformer';
import {GuaranteeRequest} from 'src/guaranteeReq.entity';

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

	async getRequestListByOrderItemId(orderItemId: string, mallId: string) {
		const {Items} = await this.ddbClient
			.query({
				TableName: this.tableName,
				IndexName: 'orderItemId-index',
				KeyConditionExpression: 'orderItemId = :id and mallId = :mId',
				ExpressionAttributeValues: {
					':id': orderItemId,
					':mId': mallId,
				},
			})
			.promise();

		if (!Items) return [];
		return plainToInstance(GuaranteeRequest, Items);
	}

	async putRequest(req: GuaranteeRequest) {
		await this.ddbClient
			.put({
				TableName: this.tableName,
				Item: req,
				ReturnValues: 'ALL_OLD',
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
