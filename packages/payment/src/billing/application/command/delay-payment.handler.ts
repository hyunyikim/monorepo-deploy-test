import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {BillingRepository, PaymentRepository} from '../../domain/repository';
import {
	PlanBillingRepository,
	PlanPaymentRepository,
} from '../../infrastructure/respository';

import {DelayPaymentCommand} from './delay-payment.command';
import {
	Payment as TossPayment,
	PAYMENT_STATUS,
	PaymentType,
	TossPaymentsAPI,
} from '../../infrastructure/api-client';
import {DateTime} from 'luxon';
import {PlanPaymentFactory} from '../../domain';
import {VircleCoreApi} from '../../infrastructure/api-client/vircle-core.api';

/**
 * 결제 연장 커맨드 핸들러
 */
@CommandHandler(DelayPaymentCommand)
export class DelayPaymentHandler
	implements ICommandHandler<DelayPaymentCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI)
		private readonly paymentApi: TossPaymentsAPI,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanPaymentFactory)
		private readonly factory: PlanPaymentFactory,
		@Inject(VircleCoreApi)
		private readonly vircleCoreApi: VircleCoreApi
	) {}

	async execute(command: DelayPaymentCommand): Promise<void> {
		const {partnerIdx, billing, orderId, payAmount, failMessage} = command;

		const pricePlan = billing.properties().pricePlan;

		const failedPayment = {
			paymentKey: [
				'FAILED_PAYMENT_KEY',
				partnerIdx.toString(),
				DateTime.now().valueOf(),
			].join('_'),
			status: PAYMENT_STATUS.FAILED,
			type: PaymentType.BILLING,
			orderId: orderId,
			totalAmount: payAmount,
			requestedAt: DateTime.now().toISO(),
			approvedAt: DateTime.now().toISO(),
		} as TossPayment;

		// 결제 실패내역 DB 저장
		const payment = this.factory.create({
			...failedPayment,
			partnerIdx,
			pricePlan,
			failMessage,
		});
		await this.paymentRepo.savePayment(payment);

		// 정기결제 연장정보 DB 업데이트
		billing.delay(payment.properties());
		await this.billingRepo.saveBilling(billing);

		payment.commit();
		billing.commit();
	}
}
