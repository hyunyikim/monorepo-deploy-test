import {PlanRepository} from '../../domain/repository';
import {InjectionToken} from '../../../injection.token';
import {Inject, Injectable} from '@nestjs/common';
import {DynamoDB} from 'aws-sdk';
import {PricePlan, PricePlanProps} from '../../domain/pricePlan';
import {PLAN_TYPE} from '../api-client';

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
	async getAll(activated: boolean, planType?: PLAN_TYPE) {
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
	async findFreePlan(planType: PLAN_TYPE = PLAN_TYPE.MONTH) {
		const plans: PricePlan[] = await this.getAll(false);
		return plans.filter(
			(plan) => plan.planLevel === 0 && plan.planType === planType
		)[0];
	}

	/**
	 * 엔터프라이즈 플랜 찾기
	 */
	async findEnterprisePlan() {
		const plans: PricePlan[] = await this.getAll(false);
		return plans.filter((plan) => plan.planType === PLAN_TYPE.INFINITE)[0];
	}
}
