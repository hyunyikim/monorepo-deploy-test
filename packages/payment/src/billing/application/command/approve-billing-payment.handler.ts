import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PlanPaymentFactory} from '../../domain';

import {ApproveBillingPaymentCommand} from './approve-billing-payment.command';
import {TossPaymentsAPI} from '../../infrastructure/api-client';
import {
	PlanPaymentRepository,
	PlanBillingRepository,
} from '../../infrastructure/respository';
import {PaymentRepository, BillingRepository} from '../../domain/repository';

/**
 * 정기결제 승인 커맨드 핸들러
 */
@CommandHandler(ApproveBillingPaymentCommand)
export class ApproveBillingPaymentHandler
	implements ICommandHandler<ApproveBillingPaymentCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI) private readonly paymentsApi: TossPaymentsAPI,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanPaymentFactory)
		private readonly factory: PlanPaymentFactory
	) {}

	async execute(command: ApproveBillingPaymentCommand): Promise<void> {
		const {partnerIdx, billingKey, pricePlan, payload, canceledPricePlan} =
			command;

		// 결제정보 조회
		const billing = await this.billingRepo.findByKey(billingKey);
		if (!billing) {
			throw new NotFoundException('NOT_FOUND_BILLING_RESOURCE');
		}

		// 결제 승인 요청
		const tossPayment = await this.paymentsApi.billing.requestApprove(
			billingKey,
			payload
		);

		// 직전 결제건 종료 처리
		const lastPaymentKey = billing.properties().lastPaymentKey;
		if (lastPaymentKey) {
			const lastPayment = await this.paymentRepo.findByKey(
				lastPaymentKey
			);
			if (lastPayment) {
				lastPayment.expire();
				await this.paymentRepo.savePayment(lastPayment);
			}
		}

		// 결제 내역 DB 저장
		const payment = this.factory.create({
			...tossPayment,
			partnerIdx,
			pricePlan,
			canceledPricePlan,
		});
		await this.paymentRepo.savePayment(payment);

		// 정기결제 승인정보 DB 업데이트
		billing.approve(payment.properties());
		await this.billingRepo.saveBilling(billing);

		payment.commit();
		billing.commit();
	}
}
