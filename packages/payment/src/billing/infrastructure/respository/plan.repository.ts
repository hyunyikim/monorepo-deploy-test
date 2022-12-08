import {PlanRepository} from '../../domain/repository';
import {PricePlan} from '../../domain';
import {InjectionToken} from '../../../injection.token';
import {Injectable, Inject} from '@nestjs/common';
import {DynamoDB} from 'aws-sdk';

@Injectable()
export class PricePlanRepository
	extends DynamoDB.DocumentClient
	implements PlanRepository
{
	constructor(
		@Inject(InjectionToken.PLAN_TABLE_NAME)
		private readonly tableName: string,
		@Inject(InjectionToken.AWS_REGION)
		private readonly region: string // private region: string = 'ap-northeast-2'
	) {
		super({region});
	}

	async getAll(activated: boolean) {
		const {Items} = await this.scan({
			TableName: this.tableName,
		}).promise();
		if (!Items || Items.length === 0) return [];
		const plans = Items as PricePlan[];
		if (activated) return plans.filter((plan) => plan.activated);
		return plans;
	}

	async findByPlanId(planId: string) {
		const {Item} = await this.get({
			TableName: this.tableName,
			Key: {
				planId,
			},
		}).promise();
		if (!Item) return null;
		return Item as PricePlan;
	}
}
