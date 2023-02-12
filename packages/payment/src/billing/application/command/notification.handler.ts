import {Inject, NotFoundException} from '@nestjs/common';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {PlanBillingRepository} from '../../infrastructure/respository';
import {BillingRepository} from '../../domain/repository';
import {NotificationCommand} from './notification.command';
import {EMAIL_TEMPLATE} from 'src/billing/infrastructure/api-client';
import {
	PaymentEmailPayload,
	PaymentSlackPayload,
	VircleCoreApi,
} from '../../infrastructure/api-client/vircle-core.api';
import {
	BillingApprovedEvent,
	BillingDelayedEvent,
	BillingDeletedEvent,
	BillingRegisteredEvent,
	BillingUnregisteredEvent,
	CardDeletedEvent,
	CardRegisteredEvent,
	PlanChangedEvent,
} from '../../domain/event';
import {DateTime} from 'luxon';

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
		const {billing, event, payment, prevPlan, date} = command;

		const detailPlanName = `${billing.pricePlan.planName} (${
			billing.pricePlan.planType === 'YEAR' ? '연 결제' : '월 결제'
		})`;

		let mailPayload: PaymentEmailPayload | undefined;
		let slackPayload: PaymentSlackPayload | undefined;

		switch (event) {
			case BillingRegisteredEvent:
				slackPayload = {
					partnerIdx: billing.partnerIdx,
					title: ':moneybag: 신규 정기구독 신청 :blob-clap:',
					params: {
						플랜명: detailPlanName,
						구독료: `${billing.pricePlan.displayTotalPrice.toLocaleString()}원`,
					},
				};
				break;

			case PlanChangedEvent:
				const isUpgrade =
					prevPlan!.planLevel < billing.nextPricePlan!.planLevel;

				slackPayload = {
					partnerIdx: billing.partnerIdx,
					title: `:moneybag: 정기구독 플랜 변경 :arrow_${
						isUpgrade ? 'up' : 'down'
					}:`,
					params: {
						이전플랜명: `${prevPlan!.planName} (${
							prevPlan!.planType === 'YEAR'
								? '연 결제'
								: '월 결제'
						})`,
						신규플랜명: `${billing.nextPricePlan!.planName} (${
							billing.nextPricePlan!.planType === 'YEAR'
								? '연 결제'
								: '월 결제'
						})`,
						변경일자: date
							? DateTime.fromISO(date).toISODate()
							: DateTime.now().toISODate(),
					},
				};
				break;

			case BillingApprovedEvent:
				if (!payment) {
					break;
				}
				mailPayload = {
					email: billing.paymentEmail,
					partnerIdx: payment.partnerIdx,
					template: EMAIL_TEMPLATE.COMPLETE_PAYMENT,
					params: {
						planName: payment.pricePlan.planName,
						orderId:
							payment.orderId.split('_')[
								payment.orderId.split('_').length - 1
							],
						payAmount: String(payment.totalAmount || 0),
					},
				};
				break;

			case BillingUnregisteredEvent:
				mailPayload = {
					email: billing.paymentEmail,
					partnerIdx: billing.partnerIdx,
					template: EMAIL_TEMPLATE.CANCEL_PAYMENT,
					params: {
						planName: billing.pricePlan.planName,
					},
				};

				slackPayload = {
					partnerIdx: billing.partnerIdx,
					title: ':moneybag: 정기구독 취소 :no_entry:',
					params: {
						플랜명: detailPlanName,
					},
				};
				break;

			case CardRegisteredEvent:
				slackPayload = {
					partnerIdx: billing.partnerIdx,
					title: ':moneybag: 정기구독 카드 등록 :credit_card:',
					params: {
						플랜명: detailPlanName,
					},
				};
				break;

			case CardDeletedEvent:
				slackPayload = {
					partnerIdx: billing.partnerIdx,
					title: ':moneybag: 정기구독 카드 삭제 :no_entry_sign:',
					params: {
						플랜명: detailPlanName,
					},
				};
				break;

			case BillingDelayedEvent:
				if (!payment) {
					break;
				}
				mailPayload = {
					email: billing.paymentEmail,
					partnerIdx: billing.partnerIdx,
					template: EMAIL_TEMPLATE.FAIL_PAYMENT,
					params: {
						planName: billing.pricePlan.planName,
					},
				};

				const failCount = billing.paymentFailedCount || 0;
				slackPayload = {
					partnerIdx: billing.partnerIdx,
					title: `:moneybag: 정기구독 결제지연 발생 ${
						failCount > 5
							? ' [이용정지] :bangbang:'
							: ':heavy_exclamation_mark:'
					}`,
					params: {
						플랜명: detailPlanName,
						결제금액: `${payment.totalAmount.toLocaleString()}원`,
						실패회수: String(failCount),
						실패사유: payment.failMessage ?? '',
					},
				};
				break;

			case BillingDeletedEvent:
				slackPayload = {
					partnerIdx: billing.partnerIdx,
					title: ':moneybag: 정기구독 삭제 :x:',
					params: {
						플랜명: detailPlanName,
					},
				};
				break;
		}

		try {
			if (mailPayload) {
				await this.vircleCoreApi.sendPaymentEmail(mailPayload);
			}

			if (slackPayload) {
				await this.vircleCoreApi.sendPaymentSlack(slackPayload);
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
}
