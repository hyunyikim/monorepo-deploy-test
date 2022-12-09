import {Injectable, Inject} from '@nestjs/common';
import {DynamoDB} from 'aws-sdk';
import {PlanBillingFactory} from '../../domain/factory';
import {BillingProps, Billing} from '../../domain/billing';
import {BillingRepository} from '../../domain/repository';
import {InjectionToken} from 'src/injection.token';

type BillingEntity = BillingProps;
@Injectable()
export class PlanBillingRepository
	extends DynamoDB.DocumentClient
	implements BillingRepository
{
	constructor(
		@Inject(PlanBillingFactory)
		private readonly factory: PlanBillingFactory,
		@Inject(InjectionToken.BILLING_TABLE_NAME)
		private readonly tableName: string,
		@Inject(InjectionToken.AWS_REGION)
		private readonly region: string // private region: string = 'ap-northeast-2'
	) {
		super({region});
	}

	async saveBilling(billing: Billing) {
		const entity = billing.properties();
		await this.put({
			TableName: this.tableName,
			Item: entity,
			ReturnValues: 'ALL_OLD',
		}).promise();
	}

	async findByKey(billingKey: string) {
		const {Item} = await this.get({
			TableName: this.tableName,
			Key: {
				billingKey,
			},
		}).promise();
		if (!Item) return null;

		const entity = Item as BillingEntity;

		return this.entityToModel(entity);
	}

	async findByCustomerKey(customerKey: string) {
		const {Items} = await this.query({
			TableName: this.tableName,
			IndexName: 'customerKey-index',
			KeyConditionExpression: 'customerKey = :key',
			ExpressionAttributeValues: {
				':key': customerKey,
			},
		}).promise();

		if (!Items || Items.length === 0) return null;

		const entities = Items as BillingEntity[];

		const entity = entities.find(
			(entity) => entity.unregisteredAt === undefined
		);
		if (!entity) return null;
		return this.entityToModel(entity);
	}

	async getAll(registered: boolean) {
		const {Items} = await this.scan({
			TableName: this.tableName,
		}).promise();
		if (!Items || Items.length === 0) return [];
		const billings = Items as BillingEntity[];
		return billings
			.filter((billing) => {
				if (!registered) return true;
				return billing.unregisteredAt !== undefined;
			})
			.map((props) => this.entityToModel(props));
	}

	private entityToModel(entity: BillingEntity) {
		return this.factory.create({
			...entity,
		});
	}
}
