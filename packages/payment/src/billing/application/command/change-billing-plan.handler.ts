import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository, PaymentRepository} from '../../domain/repository';
import {
	PricePlanRepository,
	PlanBillingRepository,
	PlanPaymentRepository,
} from '../../infrastructure/respository';
import {ChangeBillingPlanCommand} from './change-billing-plan.command';

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
		const {planId, customerKey, currentBillingProps} = command;

		// 결제정보 조회
		const billing = await this.billingRepo.findByCustomerKey(customerKey);
		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		// 신규 플랜 조회
		const pricePlan = await this.planRepo.findByPlanId(planId);
		if (!pricePlan) {
			throw new NotFoundException('NOT_FOUND_PLAN');
		}

		// 마지막 결제건 종료 처리
		if (currentBillingProps.lastPaymentKey) {
			const lastPayment = await this.paymentRepo.findByKey(
				currentBillingProps.lastPaymentKey
			);
			if (lastPayment) {
				lastPayment.expire();
				await this.paymentRepo.savePayment(lastPayment);
			}
		}

		// 구독 변경정보 DB 업데이트
		billing.changePlan(pricePlan);
		await this.billingRepo.saveBilling(billing);

		billing.commit();
	}
}
