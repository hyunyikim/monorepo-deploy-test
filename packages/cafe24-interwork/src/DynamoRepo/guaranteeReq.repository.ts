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

	async getRequest(idx: number) {
		const {Item} = await this.ddbClient
			.get({
				TableName: this.tableName,
				Key: {
					reqIdx: idx,
				},
			})
			.promise();

		return Item ? plainToInstance(GuaranteeRequest, Item) : null;
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
