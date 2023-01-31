import {Inject, Injectable, Logger} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {BillingRepository, PlanRepository} from '../../domain/repository';
import {Billing, BillingProps, PricePlanProps} from '../../domain';
import {ApproveBillingPaymentCommand} from '../command';
import {DateTime} from 'luxon';
import {
	PlanBillingRepository,
	PricePlanRepository,
} from '../../infrastructure/respository';
import {Cron} from '@nestjs/schedule';
import {InjectionToken} from '../../../injection.token';

/**
 * 결제관련 서비스 로직
 */
@Injectable()
export class RegularPaymentService {
	constructor(
		private readonly commandBus: CommandBus,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(PricePlanRepository)
		private readonly planRepository: PlanRepository,
		@Inject(InjectionToken.CRON_TASK_ON) private readonly cronTask: boolean,
		@Inject(Logger) private readonly logger: Logger
	) {}

	/**
	 * 결제실행 배치 (매일, 매시간 30분 마다 실행)
	 */
	@Cron('30 * * * * *', {name: 'REGULAR_PAYMENT_BATCH_JOB'})
	async paymentBatchJob() {
		if (!this.cronTask) return;
		const billings = await this.billingRepo.getAll(true);
		const paidBillings: BillingProps[] = [];
		for (const billing of billings) {
			if (this.isPaymentTiming(billing)) {
				paidBillings.push(billing.properties());
				this.createPayment(billing);
			}
		}
		this.logger.log(
			{
				title: 'Regular Billing Payments Report',
				date: DateTime.now().toISO(),
				list: paidBillings.map(({customerKey, pricePlan}) => ({
					customerKey,
					pricePlan,
				})),
			},
			this.constructor.name
		);
	}

	/**
	 * 정기결제 요청 생성
	 * @param billing
	 */
	createPayment(billing: Billing) {
		const props = billing.properties();
		const {partnerIdx, billingKey, pricePlan, customerKey} = props;

		const command = new ApproveBillingPaymentCommand(
			partnerIdx,
			billingKey,
			pricePlan,
			this.generatePaymentPayload(partnerIdx, customerKey, pricePlan)
		);
		this.commandBus.execute(command);
	}

	/**
	 * 결제 요청 데이터 생성
	 * @param partnerIdx
	 * @param customerKey
	 * @param orderId
	 * @param pricePlan
	 */
	generatePaymentPayload(
		partnerIdx: number,
		customerKey: string,
		pricePlan: PricePlanProps
	) {
		const orderName = `${pricePlan.planName} (${
			pricePlan.planType === 'YEAR' ? '연 결제' : '월 결제'
		})`;

		const orderId = [
			partnerIdx.toString(),
			pricePlan.planId,
			DateTime.now().valueOf(),
		].join('_');

		return {
			customerKey,
			amount: pricePlan.totalPrice + pricePlan.vat,
			orderId,
			orderName,
		};
	}

	/**
	 * 결제 시점 체크
	 * @param billing
	 * @private
	 */
	private isPaymentTiming(billing: Billing) {
		const {unregisteredAt, nextPaymentDate, pausedAt, card} =
			billing.properties();

		// 빌링이 취소된 경우
		if (unregisteredAt !== undefined) return false;

		// 카드 정보가 등록되지 않은 경우
		if (!card || !card.number) return false;

		// 다음 결제 예정일자가 없는 경우
		if (!nextPaymentDate) return false;

		// 현재 이용중인 플랜이 일시 중지된 경우
		if (pausedAt !== undefined) return false;

		// 다음 예정 플랜이 무료플랜인 경우

		return DateTime.now() > DateTime.fromISO(nextPaymentDate);
	}
}
