import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PaymentRepository} from '../../domain/repository';
import {PlanPaymentRepository} from '../../infrastructure/respository';

import {CancelPaymentCommand} from './cancel-payment.command';
import {TossPaymentsAPI} from '../../infrastructure/api-client';

/**
 * 결제 취소 커맨드 핸들러
 */
@CommandHandler(CancelPaymentCommand)
export class CancelPaymentHandler
	implements ICommandHandler<CancelPaymentCommand, void>
{
	constructor(
		@Inject(TossPaymentsAPI) private readonly paymentApi: TossPaymentsAPI,
		@Inject(PlanPaymentRepository)
		private readonly paymentRepository: PaymentRepository
	) {}

	async execute(command: CancelPaymentCommand): Promise<void> {
		const {partnerIdx, key} = command;

		// 결제 조회
		const payment = await this.paymentRepository.findByKey(key);
		if (!payment) {
			throw new NotFoundException('NOT_FOUND_PAYMENT');
		}

		const paymentProps = payment.properties();

		// 결제 취소 요청
		const canceled = await this.paymentApi.payments.cancel(key, {
			cancelReason: 'REASON',
		});
		payment.cancel({
			...canceled,
			...paymentProps,
		});

		// 결제 DB 업데이트
		await this.paymentRepository.savePayment(payment);

		payment.commit();
	}
}
