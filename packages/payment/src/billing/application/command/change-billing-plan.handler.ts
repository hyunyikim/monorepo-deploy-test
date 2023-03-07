import {BadRequestException, Inject, NotFoundException} from '@nestjs/common';
import {CommandBus, CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository, PaymentRepository} from '../../domain/repository';
import {
	PlanBillingRepository,
	PlanPaymentRepository,
	PricePlanRepository,
} from '../../infrastructure/respository';
import {ChangeBillingPlanCommand} from './change-billing-plan.command';
import {PricePlan, PricePlanProps} from '../../domain';
import {DateTime} from 'luxon';
import {VircleCoreApi} from '../../infrastructure/api-client/vircle-core.api';
import {ApproveBillingPaymentCommand} from './approve-billing-payment.command';
import {RegularPaymentService} from '../service/payment.service';
import {PLAN_TYPE} from '../../infrastructure/api-client';

/**
 * 구독플랜 변경 커맨드 핸들러
 */
@CommandHandler(ChangeBillingPlanCommand)
export class ChangeBillingPlanHandler
	implements ICommandHandler<ChangeBillingPlanCommand, void>
{
	constructor(
		private readonly commandBus: CommandBus,
		@Inject(RegularPaymentService)
		private readonly paymentService: RegularPaymentService,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository,
		@Inject(PricePlanRepository)
		private readonly planRepo: PricePlanRepository,
		@Inject(VircleCoreApi)
		private readonly vircleCoreApi: VircleCoreApi
	) {}

	async execute(command: ChangeBillingPlanCommand): Promise<void> {
		const {planId, token} = command;

		// 현재 구독정보 조회
		const billing = await this.billingRepo.findByPartnerIdx(
			token.partnerIdx
		);
		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		const billingProps = billing.properties();

		// 카드정보가 등록되지 않은 경우
		if (!billingProps.card) {
			throw new BadRequestException('NOT_FOUND_BILLING_CARD');
		}

		// 현재/다음 플랜
		const currentPlan = billingProps.pricePlan;
		const nextPlan = billingProps.nextPricePlan;

		// 무료 플랜 사용중이면서 예약된 플랜이 없는 경우
		const isFree = billingProps.pricePlan.planLevel === 0 && !nextPlan;

		// 구독 취소상태 (무료 플랜이 아니지만 다음 플랜이 없는 경우)
		const isCanceled = !isFree && !nextPlan;

		// 플랜 변경 예정 일자
		let scheduledDate: string | undefined;

		// 잔여 수량
		let remainLimit = 0;

		// 취소할 플랜
		let cancelPlan: PricePlanProps | undefined;

		// 변경할 플랜 조회
		const newPlan = await this.planRepo.findByPlanId(planId);
		if (!newPlan) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		// 현재 이용중인 플랜과 동일한 플랜으로 변경 불가
		if (
			!isFree &&
			!isCanceled &&
			currentPlan.planLevel === newPlan.planLevel
		) {
			throw new BadRequestException('ALREADY_USED_SAME_PLAN');
		}

		// 엔터프라이즈 고객은 플랜 변경 불가
		if (currentPlan.planType === PLAN_TYPE.INFINITE) {
			throw new BadRequestException('IMPOSSIBLE_CHANGE_PLAN');
		}

		////////////////////
		// 상위 플랜으로 변경
		////////////////////
		if (
			!isFree &&
			!isCanceled &&
			currentPlan.planLevel < newPlan.planLevel
		) {
			// 월결제 -> 연결제 (변경 예약)
			if (
				currentPlan.planType === PLAN_TYPE.MONTH &&
				newPlan.planType === PLAN_TYPE.YEAR
			) {
				// 다음달 결제예정일에 업그레이드 예약
				scheduledDate = billingProps.nextPaymentDate;
			}

			// 연결제 -> 연결제 (즉시 변경)
			if (
				currentPlan.planType === PLAN_TYPE.YEAR &&
				newPlan.planType === PLAN_TYPE.YEAR
			) {
				// 사용한 개월수 = 플랜 시작일(직전 결제일) 부터 현재까지 개월 수
				const usedMonths: number =
					Math.ceil(
						-DateTime.fromISO(
							billingProps.lastPaymentAt ||
								billingProps.authenticatedAt
						).diffNow('months').months
					) || 1;

				// 개월수로 계산 시 올림으로 인해 최대 13개월로 계산될 수 있음을 방지
				const remainMonths: number =
					usedMonths >= 12 ? 0 : 12 - usedMonths;

				// 취소된 금액 (총결제금액(12개월, 부가세포함) * 잔여개월수/12)
				const canceledPrice: number =
					currentPlan.payPrice * (remainMonths / 12);

				if (usedMonths > 0) {
					// 취소할 플랜
					cancelPlan = new PricePlan({
						...currentPlan,
						usedMonths,
						canceledPrice,
						startedAt: billingProps.lastPaymentAt,
						finishedAt: DateTime.now().toISO(),
					} as PricePlanProps);
				}
			}

			// 월결제 -> 월결제 (즉시 변경)
			if (
				currentPlan.planType === PLAN_TYPE.MONTH &&
				newPlan.planType === PLAN_TYPE.MONTH
			) {
				console.log('### 월결제 -> 월결제 (즉시 변경) ####');
				// 사용량 조회
				const payload = {
					from: DateTime.fromISO(
						billingProps.lastPaymentAt ||
							billingProps.authenticatedAt
					)
						.toISO()
						.substring(0, 19),
				};
				const {total} = await this.vircleCoreApi.getUsedGuaranteeCount(
					token.token,
					payload
				);

				// 잔여 발급량이 있는 경우 이월
				remainLimit = currentPlan.planLimit - (total ?? 0);
			}
		}

		////////////////////
		// 하위 플랜으로 변경
		////////////////////
		if (currentPlan.planLevel > newPlan.planLevel) {
			// 모든 다운그레이드는 다음달 결제예정일로 예약
			scheduledDate = billingProps.nextPaymentDate;

			// 연결제 -> 연결제 (변경불가!)
			if (
				currentPlan.planType === PLAN_TYPE.YEAR &&
				newPlan.planType === PLAN_TYPE.YEAR
			) {
				throw new BadRequestException('IMPOSSIBLE_CHANGE_PLAN');
			}
		}

		// 결제 요청
		try {
			if (!scheduledDate) {
				// 즉시 결제 요청
				const approveCommand = new ApproveBillingPaymentCommand(
					token.partnerIdx,
					billing,
					newPlan,
					this.paymentService.generatePaymentPayload(
						token.partnerIdx,
						billing.properties().customerKey,
						newPlan,
						cancelPlan
					),
					cancelPlan
				);
				await this.commandBus.execute(approveCommand);
			}

			// 구독정보 변경
			billing.changePlan(newPlan, remainLimit, scheduledDate, cancelPlan);

			// DB 저장
			await this.billingRepo.saveBilling(billing);

			billing.commit();
		} catch (e) {
			throw e;
		}
	}
}
