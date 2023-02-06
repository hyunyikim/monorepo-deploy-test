import {Inject} from '@nestjs/common';
import {CommandBus, CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PlanPaymentFactory} from '../../domain';
import {ApproveBillingPaymentCommand} from './approve-billing-payment.command';
import {TossPaymentsAPI} from '../../infrastructure/api-client';
import {
	PlanPaymentRepository,
	PlanBillingRepository,
} from '../../infrastructure/respository';
import {PaymentRepository, BillingRepository} from '../../domain/repository';
import {VircleCoreApi} from '../../infrastructure/api-client/vircle-core.api';
import {DelayPaymentCommand} from './delay-payment.command';

/**
 * 정기결제 승인 커맨드 핸들러
 */
@CommandHandler(ApproveBillingPaymentCommand)
export class ApproveBillingPaymentHandler
	implements ICommandHandler<ApproveBillingPaymentCommand, void>
{
	constructor(
		private readonly commandBus: CommandBus,
		@Inject(TossPaymentsAPI)
		private readonly paymentsApi: TossPaymentsAPI,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepo: PaymentRepository,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PlanPaymentFactory)
		private readonly factory: PlanPaymentFactory,
		@Inject(VircleCoreApi)
		private readonly vircleCoreApi: VircleCoreApi
	) {}

	async execute(command: ApproveBillingPaymentCommand): Promise<void> {
		const {
			partnerIdx,
			billing,
			pricePlan,
			payload,
			canceledPricePlan,
			useDelay,
		} = command;

		try {
			// 결제 승인 요청
			const tossPayment = await this.paymentsApi.billing.requestApprove(
				billing.properties().billingKey,
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

			// 이메일 발송
			await this.vircleCoreApi.sendPaymentEmail({
				partnerIdx,
				template: 'COMPLETE_PAYMENT',
				params: {
					planName: pricePlan.planName,
					orderId: payload.orderId,
					planPrice: pricePlan.planPrice,
				},
			});

			payment.commit();
			billing.commit();
		} catch (e) {
			if (useDelay) {
				// 결제 연장 신청
				const delayCommand = new DelayPaymentCommand(
					partnerIdx,
					billing,
					payload.orderId,
					payload.amount
				);
				await this.commandBus.execute(delayCommand);
			}

			throw e;
		}
	}
}
