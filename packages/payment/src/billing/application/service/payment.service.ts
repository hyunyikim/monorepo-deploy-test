import {Inject, Injectable} from '@nestjs/common';
import {CommandBus} from '@nestjs/cqrs';
import {
	BillingRepository,
	PaymentRepository,
} from 'src/billing/domain/repository';
import {PlanPaymentRepository} from 'src/billing/infrastructure/respository/payment.repository';
import {Billing} from '../../domain/billing';
import {ApproveBillingPaymentCommand} from '.././command';
import {DateTime} from 'luxon';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {Cron} from '@nestjs/schedule';

@Injectable()
export class RegularPaymentService {
	constructor(
		private readonly commandBus: CommandBus,
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository
	) {}

	async paymentBatchJob() {
		const billings = await this.billingRepo.getAll(true);
		for (const billing of billings) {
			if (this.isPaymentTiming(billing)) {
				this.createPayment(billing);
			}
		}
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
		if (!!unregisteredAt) return false;
		if (!nextPaymentAt) return false;
		if (!!pausedAt) return false;

		return DateTime.now() > DateTime.fromISO(nextPaymentAt);
	}
}
