import {Inject, Injectable} from '@nestjs/common';
import {ICommand, ofType, Saga} from '@nestjs/cqrs';
import {Observable} from 'rxjs';
import {map, filter, tap} from 'rxjs/operators';
import {RegularPaymentService} from '../service/payment.service';
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
import {VircleCoreApi} from '../../infrastructure/api-client/vircle-core.api';
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
	 * 신규 구독 신청 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	billingRegistered = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingRegisteredEvent),
			map(
				(e) =>
					new NotificationCommand(BillingRegisteredEvent, e.billing)
			)
		);
	};

	/**
	 * 신규 구독 신청 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	billingChanged = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(PlanChangedEvent),
			map(
				(e) =>
					new NotificationCommand(
						PlanChangedEvent,
						e.billing,
						undefined,
						e.prevPlan,
						e.scheduledDate
					)
			)
		);
	};

	/**
	 * 카드 등록 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	cardRegistered = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(CardRegisteredEvent),
			map((e) => new NotificationCommand(CardRegisteredEvent, e.billing))
		);
	};

	/**
	 * 카드 삭제 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	cardDeleted = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(CardDeletedEvent),
			map((e) => new NotificationCommand(CardDeletedEvent, e.billing))
		);
	};

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
						BillingApprovedEvent,
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
					new NotificationCommand(BillingUnregisteredEvent, e.billing)
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
						BillingDelayedEvent,
						e.billing,
						e.payment
					)
			)
		);
	};

	/**
	 * 정기결제 삭제 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	billingDeleted = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingDeletedEvent),
			filter((e) => !!e.billing.orderId),
			map(
				(e) =>
					!e.isBillingChanged &&
					new NotificationCommand(BillingDeletedEvent, e.billing)
			)
		);
	};
}
