import {Inject, Injectable} from '@nestjs/common';
import {ICommand, ofType, Saga} from '@nestjs/cqrs';
import {Observable} from 'rxjs';
import {map, filter, tap} from 'rxjs/operators';
import {ApproveBillingPaymentCommand} from '../command';
import {BillingProps} from '../../domain';
import {
	BillingRegisteredEvent,
	PlanChangedEvent,
	BillingResumedEvent,
} from '../../domain/event';
import {DateTime} from 'luxon';
import {RegularPaymentService} from '../service/payment.service';

@Injectable()
export class BillingSaga {
	constructor(
		@Inject(RegularPaymentService)
		private readonly paymentService: RegularPaymentService
	) {}

	/**
	 * 빌링 등록 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	billingRegistered = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingRegisteredEvent),
			map((e) => this.composeApproveBillingCommand(e.billing))
		);
	};

	/**
	 * 플랜 변경 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	planChanged = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(PlanChangedEvent),
			filter((e) => !e.scheduled),
			filter((e) => e.billing.unregisteredAt === undefined),
			map((e) => this.composeApproveBillingCommand(e.billing))
		);
	};

	/**
	 * 플랜 재개 이벤트 발생 시
	 * @param events$
	 */
	@Saga()
	billingResumed = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingResumedEvent),
			filter((e) => e.billing.unregisteredAt === undefined),
			filter(
				(e) =>
					DateTime.now() >
					DateTime.fromISO(e.billing.nextPaymentDate!)
			),
			map((e) => this.composeApproveBillingCommand(e.billing))
		);
	};

	/**
	 * 결제 승인요청 커맨드
	 * @param billingProps
	 * @private
	 */
	private composeApproveBillingCommand(billingProps: BillingProps) {
		const {
			partnerIdx,
			billingKey,
			pricePlan,
			canceledPricePlan,
			customerKey,
		} = billingProps;

		console.log(' @@@@ 결제 요청 @@@@');
		console.log(billingProps);

		return new ApproveBillingPaymentCommand(
			partnerIdx,
			billingKey,
			pricePlan,
			this.paymentService.generatePaymentPayload(
				partnerIdx,
				customerKey,
				pricePlan,
				canceledPricePlan
			)
		);
	}
}
