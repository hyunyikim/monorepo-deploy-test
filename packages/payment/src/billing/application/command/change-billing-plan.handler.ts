import {BadRequestException, Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository, PaymentRepository} from '../../domain/repository';
import {
	PricePlanRepository,
	PlanBillingRepository,
	PlanPaymentRepository,
} from '../../infrastructure/respository';
import {ChangeBillingPlanCommand} from './change-billing-plan.command';
import {BillingProps, PricePlan, PricePlanProps} from '../../domain';
import {DateTime} from 'luxon';
import {VircleCoreAPI} from '../../infrastructure/api-client/vircleCoreApi';

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
		private readonly planRepo: PricePlanRepository,
		@Inject(VircleCoreAPI)
		private readonly vircleCoreApi: VircleCoreAPI
	) {}

	async execute(command: ChangeBillingPlanCommand): Promise<void> {
		const {planId, token} = command;

		// 결제정보 조회
		const billing = await this.billingRepo.findByPartnerIdx(
			token.partnerIdx
		);
		const prevBillingProps: BillingProps | undefined =
			billing?.properties();

		if (!billing || !prevBillingProps?.card) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		// 이전/다음 플랜
		const prevPricePlan = prevBillingProps.pricePlan;
		const nextPricePlan = prevBillingProps.nextPricePlan;

		// 무료 플랜 사용중
		const isFreePlan =
			!nextPricePlan && prevBillingProps.pricePlan.planLevel === 0;

		// 구독 취소상태 (무료 플랜이 아니지만 다음 플랜이 없는 경우)
		const isCanceledPlan = !nextPricePlan && !isFreePlan;

		// 플랜 변경 예정 일자
		let scheduledDate: string | undefined;

		// 잔여 수량
		let remainLimit = 0;

		// 취소된 플랜
		let canceledPricePlan: PricePlanProps | undefined;

		// 신규 플랜 조회
		const newPricePlan = await this.planRepo.findByPlanId(planId);
		if (!newPricePlan) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		// 현재 이용중인 플랜과 동일한 플랜으로 변경 불가
		if (
			!isFreePlan &&
			!isCanceledPlan &&
			prevPricePlan.planLevel === newPricePlan.planLevel
		) {
			throw new BadRequestException('ALREADY_USED_SAME_PLAN');
		}

		////////////////////
		// 상위 플랜으로 변경
		////////////////////
		if (!isFreePlan && prevPricePlan.planLevel < newPricePlan.planLevel) {
			// 월결제 -> 연결제 (변경 예약)
			if (
				prevPricePlan.planType === 'MONTH' &&
				newPricePlan.planType === 'YEAR'
			) {
				// 다음달 결제예정일에 업그레이드 예약
				scheduledDate = prevBillingProps.nextPaymentDate;
			}

			// 연결제 -> 연결제 (즉시 변경)
			if (
				prevPricePlan.planType === 'YEAR' &&
				newPricePlan.planType === 'YEAR'
			) {
				// 사용한 개월수 = 플랜 시작일(직전 결제일) 부터 현재까지 개월 수
				const usedMonths: number =
					-Math.ceil(
						DateTime.fromISO(
							prevBillingProps.lastPaymentAt!
						).diffNow('months').months
					) || 1;

				console.log('@@ 플랜 시작일: ', prevBillingProps.lastPaymentAt);
				console.log(
					'@@ diffnow: ',
					DateTime.fromISO(prevBillingProps.lastPaymentAt!).diffNow(
						'months'
					)
				);
				console.log('@@ 사용한 개월수: ', usedMonths);

				if (usedMonths > 0) {
					// 취소할 플랜
					canceledPricePlan = new PricePlan({
						...prevPricePlan,
						usedMonths,
					} as PricePlanProps);
				}
			}

			// 월결제 -> 월결제 (즉시 변경)
			if (
				prevPricePlan.planType === 'MONTH' &&
				newPricePlan.planType === 'MONTH'
			) {
				// 사용량 조회
				const payload = {
					from: DateTime.fromISO(
						prevBillingProps.lastPaymentAt ||
							prevBillingProps.authenticatedAt
					).toISODate(),
					to: prevBillingProps.planExpireDate
						? DateTime.fromISO(
								prevBillingProps.planExpireDate
						  ).toISODate()
						: undefined,
				};
				const {total} = await this.vircleCoreApi.getUsedGuaranteeCount(
					token.token,
					payload
				);

				// 잔여 발급량이 있는 경우 이월
				remainLimit = prevPricePlan.planLimit - (total ?? 0);
			}
		}

		////////////////////
		// 하위 플랜으로 변경
		////////////////////
		if (prevPricePlan.planLevel > newPricePlan.planLevel) {
			// 모든 다운그레이드는 다음달 결제예정일로 예약
			scheduledDate = prevBillingProps.nextPaymentDate;

			// 연결제 -> 연결제 (변경불가!)
			if (
				prevPricePlan.planType === 'YEAR' &&
				newPricePlan.planType === 'YEAR'
			) {
				throw new BadRequestException('IMPOSSIBLE_CHANGE_PLAN');
			}
		}

		// 구독 변경정보 DB 업데이트
		billing.changePlan(
			newPricePlan,
			remainLimit,
			scheduledDate,
			canceledPricePlan
		);

		await this.billingRepo.saveBilling(billing);

		billing.commit();
	}
}
