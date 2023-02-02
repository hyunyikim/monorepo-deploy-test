import {PlanRepository} from '../../domain/repository';
import {InjectionToken} from '../../../injection.token';
import {Injectable, Inject} from '@nestjs/common';
import {DynamoDB} from 'aws-sdk';
import {PricePlan, PricePlanProps} from '../../domain/pricePlan';

/**
 * 요금제 플랜 데이터 저장소
 */
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

	/**
	 * 플랜 목록 조회
	 * @param activated
	 * @param planType
	 */
	async getAll(activated: boolean, planType?: 'YEAR' | 'MONTH') {
		const {Items} = await this.scan({
			TableName: this.tableName,
			IndexName: 'planType-planLevel-index',
		}).promise();

		if (!Items || Items.length === 0) return [];
		let plans = Items as PricePlanProps[];

		if (activated) {
			plans = plans.filter((plan) => plan.activated);
		}

		if (planType) {
			plans = plans.filter((plan) => plan.planType === planType);
		}

		return plans.map((plan) => new PricePlan(plan));
	}

	/**
	 * ID로 플랜 찾기
	 * @param planId
	 */
	async findByPlanId(planId: string) {
		const {Item} = await this.get({
			TableName: this.tableName,
			Key: {
				planId,
			},
		}).promise();
		if (!Item) return null;
		return new PricePlan(Item as PricePlanProps);
	}

	/**
	 * 무료 플랜 찾기
	 */
	async findFreePlan(planType: 'YEAR' | 'MONTH' = 'MONTH') {
		const plans: PricePlan[] = await this.getAll(false);
		return plans.filter(
			(plan) => plan.planLevel === 0 && plan.planType === planType
		)[0];
	}
}
