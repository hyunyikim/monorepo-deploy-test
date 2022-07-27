import {Injectable} from '@nestjs/common';
import {DynamoDB} from 'aws-sdk';
import {plainToInstance} from 'class-transformer';
import {Cafe24Interwork} from '../interwork.entity';

@Injectable()
export class InterworkRepository {
	constructor(
		private ddbClient: DynamoDB.DocumentClient,
		private tableName: string
	) {}

	async getInterwork(mallId: string) {
		const {Item} = await this.ddbClient
			.get({
				TableName: this.tableName,
				Key: {
					mallId: mallId,
				},
			})
			.promise();

		return Item ? plainToInstance(Cafe24Interwork, Item) : null;
	}

	async putInterwork(interwork: Cafe24Interwork) {
		await this.ddbClient
			.put({
				TableName: this.tableName,
				Item: interwork,
				ReturnValues: 'ALL_OLD',
			})
			.promise();
	}

	async getInterworkByPartner(partnerIdx: number) {
		const {Items} = await this.ddbClient
			.query({
				TableName: this.tableName,
				IndexName: 'partnerIdx-index',
				KeyConditionExpression: 'partnerIdx = :idx',
				ExpressionAttributeValues: {
					':idx': partnerIdx,
				},
			})
			.promise();

		return Items && Items.length > 0
			? plainToInstance(Cafe24Interwork, Items.pop())
			: null;
	}

	async deleteInterworkItem(mallId: string) {
		await this.ddbClient
			.delete({
				TableName: this.tableName,
				Key: {mallId},
			})
			.promise();
	}

	async getAll() {
		return await this.ddbClient.scan({TableName: this.tableName}).promise();
	}
}
