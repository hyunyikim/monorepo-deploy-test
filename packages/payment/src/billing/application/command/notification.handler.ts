import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {BillingRepository} from '../../domain/repository';
import {NotificationCommand} from './notification.command';
import {EMAIL_TEMPLATE} from 'src/billing/infrastructure/api-client';
import {VircleCoreApi} from '../../infrastructure/api-client/vircle-core.api';

@CommandHandler(NotificationCommand)
export class NotificationHandler
	implements ICommandHandler<NotificationCommand, void>
{
	constructor(
		@Inject(PlanBillingRepository)
		private readonly billingRepo: BillingRepository,
		@Inject(VircleCoreApi)
		private readonly vircleCoreApi: VircleCoreApi
	) {}

	async execute(command: NotificationCommand): Promise<void> {
		const {billing, template, payment} = command;

		switch (template) {
			case EMAIL_TEMPLATE.COMPLETE_PAYMENT:
				await this.vircleCoreApi.sendPaymentEmail({
					partnerIdx: billing.partnerIdx,
					template: EMAIL_TEMPLATE.COMPLETE_PAYMENT,
					params: {
						planName: billing.pricePlan.planName,
						orderId:
							billing.orderId!.split('_')[
								billing.orderId!.split('_').length - 1
							],
						payAmount: payment?.totalAmount || 0,
					},
				});
				break;

			case EMAIL_TEMPLATE.CANCEL_PAYMENT:
				await this.vircleCoreApi.sendPaymentEmail({
					partnerIdx: billing.partnerIdx,
					template: EMAIL_TEMPLATE.CANCEL_PAYMENT,
					params: {
						planName: billing.pricePlan.planName,
					},
				});
				break;

			case EMAIL_TEMPLATE.FAIL_PAYMENT:
				await this.vircleCoreApi.sendPaymentEmail({
					partnerIdx: billing.partnerIdx,
					template: EMAIL_TEMPLATE.FAIL_PAYMENT,
					params: {
						planName: billing.pricePlan.planName,
					},
				});
				break;
		}
	}
}
