import {BadRequestException, Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository, PaymentRepository} from '../../domain/repository';
import {
	PricePlanRepository,
	PlanBillingRepository,
	PlanPaymentRepository,
} from '../../infrastructure/respository';
import {ChangeBillingPlanCommand} from './change-billing-plan.command';
import {BillingProps} from '../../domain';
import {DateTime} from 'luxon';

/**
 * 구독플랜 변경 커맨드 핸들러
 */
@CommandHandler(ChangeBillingPlanCommand)
export class ChangeBillingPlanHandler
	implements ICommandHandler<ChangeBillingPlanCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository,
		@Inject(PricePlanRepository)
		private readonly planRepo: PricePlanRepository
	) {}

	async execute(command: ChangeBillingPlanCommand): Promise<void> {
		const {planId, partnerIdx} = command;

		// 결제정보 조회
		const billing = await this.billingRepo.findByPartnerIdx(partnerIdx);
		const prevBillingProps: BillingProps | undefined =
			billing?.properties();

		if (!billing || !prevBillingProps?.card) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		// 이전 플랜
		const prevPricePlan = prevBillingProps.pricePlan;

		// 신규 플랜 조회
		const pricePlan = await this.planRepo.findByPlanId(planId);
		if (!pricePlan) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		// 동일한 플랜으로 변경 불가
		if (prevPricePlan.planLevel === pricePlan.planLevel) {
			throw new BadRequestException('ALREADY_USED_SAME_PLAN');
		}

		// 플랜 변경 예정 일자
		let scheduledDate: string | undefined;

		// 잔여 수량
		let remainLimit = 0;

		// 상위 플랜으로 변경
		if (prevPricePlan.planLevel < pricePlan.planLevel) {
			// 월결제 -> 연결제
			if (
				prevPricePlan.planType === 'MONTH' &&
				pricePlan.planType === 'YEAR'
			) {
				// 다음달 결제예정일에 업그레이드 예약
				scheduledDate = prevBillingProps.nextPaymentDate;
			}

			// 연결제 -> 연결제
			if (
				prevPricePlan.planType === 'YEAR' &&
				pricePlan.planType === 'YEAR'
			) {
				// 결제 금액 수정 (업그레이드할 플랜 구독료 - 구독중인 플랜 구독료) X (기존 플랜을 이용한 개월 / 12개월)
				const usedMonth =
					DateTime.fromISO(prevBillingProps.authenticatedAt).diffNow(
						'months'
					).months || 1;

				pricePlan.planPrice =
					(pricePlan.planPrice - prevPricePlan.planPrice) *
					(usedMonth / 12);
			}

			// 월결제 -> 월결제
			if (
				prevPricePlan.planType === 'MONTH' &&
				pricePlan.planType === 'MONTH'
			) {
				// 잔여 발급량이 있는 경우 이월
				remainLimit =
					prevPricePlan.planLimit -
					(prevBillingProps.usedNftCount ?? 0);
			}
		}

		// 하위 플랜으로 변경
		if (prevPricePlan.planLevel > pricePlan.planLevel) {
			// 모든 다운그레이드는 다음달 결제예정일로 예약
			scheduledDate = prevBillingProps.nextPaymentDate;

			// 연결제 -> 연결제 (변경불가!)
			if (
				prevPricePlan.planType === 'YEAR' &&
				pricePlan.planType === 'YEAR'
			) {
				throw new BadRequestException('IMPOSSIBLE_CHANGE_PLAN');
			}
		}

		// 구독 변경정보 DB 업데이트
		billing.changePlan(pricePlan, remainLimit, scheduledDate);

		await this.billingRepo.saveBilling(billing);

		billing.commit();
	}
}
