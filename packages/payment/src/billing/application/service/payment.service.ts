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
		private readonly planRepo: PlanRepository,
		@Inject(InjectionToken.CRON_TASK_ON)
		private readonly cronTask: boolean,
		@Inject(Logger) private readonly logger: Logger
	) {}

	/**
	 * 결제실행 배치 (매일, 매시간, 매분 30초 마다 실행) TODO: 오픈전에 변경할 것
	 */
	@Cron('*/30 * * * * *', {name: 'REGULAR_PAYMENT_BATCH_JOB'})
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
		const {partnerIdx, billingKey, nextPricePlan, customerKey} = props;

		if (!nextPricePlan) {
			return false;
		}

		const command = new ApproveBillingPaymentCommand(
			partnerIdx,
			billingKey,
			nextPricePlan,
			this.generatePaymentPayload(partnerIdx, customerKey, nextPricePlan)
		);
		this.commandBus.execute(command);
	}

	/**
	 * 결제 요청 데이터 생성
	 * @param partnerIdx
	 * @param customerKey
	 * @param pricePlan
	 * @param canceledPricePlan
	 */
	generatePaymentPayload(
		partnerIdx: number,
		customerKey: string,
		pricePlan: PricePlanProps,
		canceledPricePlan?: PricePlanProps
	) {
		const orderName = `${pricePlan.planName} (${
			pricePlan.planType === 'YEAR' ? '연 결제' : '월 결제'
		})`;

		// 결제 금액 (부가세 적용)
		let payPrice = pricePlan.payPrice;

		console.log(' @ 결제 금액 : ', payPrice);

		// 취소할 금액이 있을 경우
		if (canceledPricePlan) {
			payPrice -= canceledPricePlan.totalPrice + canceledPricePlan.vat;

			console.log(
				' @ 취소 금액 : ',
				canceledPricePlan.totalPrice + canceledPricePlan.vat
			);
		}

		console.log(' @ 최종 결제 금액 : ', payPrice);

		const orderId = [
			partnerIdx.toString(),
			pricePlan.planId,
			DateTime.now().valueOf(),
		].join('_');

		return {
			customerKey,
			amount: payPrice,
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
		const {deletedAt, nextPaymentDate, nextPricePlan, pausedAt, card} =
			billing.properties();

		// 빌링이 취소된 경우
		if (deletedAt) return false;

		// 카드 정보가 등록되지 않은 경우
		if (!card) return false;

		// 다음 결제 예정일자 또는 결제예정 금액이 없는 경우
		if (!nextPaymentDate || !nextPricePlan || !nextPricePlan.totalPrice) {
			return false;
		}

		// 현재 이용중인 플랜이 일시 중지된 경우
		if (pausedAt) return false;

		// TODO: 이미 결제를 완료한 경우 중복결제 방지

		console.log(
			'## 결제 시점 체크 ##',
			DateTime.now().toISO(),
			DateTime.fromISO(nextPaymentDate).toISO(),
			nextPricePlan.planId,
			nextPricePlan.planPrice
		);

		return DateTime.now() > DateTime.fromISO(nextPaymentDate);
	}
}
