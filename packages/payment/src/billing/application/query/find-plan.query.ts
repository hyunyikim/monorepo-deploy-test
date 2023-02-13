import {Inject} from '@nestjs/common';
import {IQuery, IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {PricePlanRepository} from '../../infrastructure/respository';
import {PlanRepository} from '../../domain/repository';
import {PricePlanProps} from '../../domain';
import {PLAN_TYPE} from '../../infrastructure/api-client';

export class FindPlanQuery implements IQuery {
	constructor(readonly planType?: PLAN_TYPE) {}
}

/**
 * 결제 내역 조회
 */
@QueryHandler(FindPlanQuery)
export class FindPlanHandler
	implements IQueryHandler<FindPlanQuery, PricePlanProps[]>
{
	constructor(
		@Inject(PricePlanRepository)
		private readonly planRepo: PlanRepository
	) {}

	async execute(query: FindPlanQuery): Promise<PricePlanProps[]> {
		const {planType} = query;
		const plans = await this.planRepo.getAll(true, planType);

		return plans;
	}
}
