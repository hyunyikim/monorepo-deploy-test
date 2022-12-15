import {Inject, Injectable, Logger} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {
	BillingRepository,
	PaymentRepository,
} from 'src/billing/domain/repository';
import {PlanPaymentRepository} from 'src/billing/infrastructure/respository/payment.repository';
import {Billing, BillingProps} from '../../domain/billing';
import {ApproveBillingPaymentCommand} from '.././command';
import {DateTime} from 'luxon';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {Cron} from '@nestjs/schedule';
import {InjectionToken} from '../../../injection.token';

@Injectable()
export class RegularPaymentService {
	constructor(
		private readonly commandBus: CommandBus,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(InjectionToken.CRON_TASK_ON) private readonly cronTask: boolean,
		@Inject(Logger) private readonly logger: Logger
	) {}

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

	createPayment(billing: Billing) {
		const props = billing.properties();
		const {billingKey, pricePlan, customerKey} = props;

		const command = new ApproveBillingPaymentCommand(billingKey, {
			amount: props.pricePlan.planPrice,
			customerKey: props.customerKey,
			orderId: `${customerKey}_${pricePlan.planId}_${DateTime.now()
				.valueOf()
				.toString(16)}`,
			orderName: pricePlan.planName,
		});
		this.commandBus.execute(command);
	}

	private isPaymentTiming(billing: Billing) {
		const {unregisteredAt, nextPaymentAt, pausedAt} = billing.properties();
		if (unregisteredAt !== undefined) return false;
		if (!nextPaymentAt) return false;
		if (pausedAt !== undefined) return false;

		return DateTime.now() > DateTime.fromISO(nextPaymentAt);
	}
}
