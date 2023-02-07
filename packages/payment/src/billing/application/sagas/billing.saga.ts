import {Inject, Injectable} from '@nestjs/common';
import {ICommand, ofType, Saga} from '@nestjs/cqrs';
import {Observable} from 'rxjs';
import {map, filter, tap} from 'rxjs/operators';
import {RegularPaymentService} from '../service/payment.service';
import {
	BillingApprovedEvent,
	BillingDelayedEvent,
	BillingUnregisteredEvent,
} from '../../domain/event';
import {VircleCoreApi} from '../../infrastructure/api-client/vircle-core.api';
import {EMAIL_TEMPLATE} from 'src/billing/infrastructure/api-client';
import {NotificationCommand} from '../command/notification.command';

@Injectable()
export class BillingSaga {
	constructor(
		@Inject(RegularPaymentService)
		private readonly paymentService: RegularPaymentService,
		@Inject(VircleCoreApi)
		private readonly vircleCoreApi: VircleCoreApi
	) {}

	/**
	 * 정기결제 승인완료 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	billingApproved = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingApprovedEvent),
			filter((e) => !!e.billing.orderId),
			map(
				(e) =>
					new NotificationCommand(
						EMAIL_TEMPLATE.COMPLETE_PAYMENT,
						e.billing,
						e.payment
					)
			)
		);
	};

	/**
	 * 정기결제 취소 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	billingUnregistered = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingUnregisteredEvent),
			filter((e) => !!e.billing.orderId),
			map(
				(e) =>
					new NotificationCommand(
						EMAIL_TEMPLATE.CANCEL_PAYMENT,
						e.billing
					)
			)
		);
	};

	/**
	 * 정기결제 지연 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	billingDelayed = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingDelayedEvent),
			filter((e) => !!e.billing.orderId),
			map(
				(e) =>
					new NotificationCommand(
						EMAIL_TEMPLATE.FAIL_PAYMENT,
						e.billing
					)
			)
		);
	};
}
