import {Injectable} from '@nestjs/common';
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
@Injectable()
export class BillingSaga {
	@Saga()
	billingRegistered = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingRegisteredEvent),
			map((e) => this.composeApproveBillingCmd(e.billing))
		);
	};

	@Saga()
	planChanged = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(PlanChangedEvent),

			filter((e) => e.billing.unregisteredAt === undefined),

			filter((e) => e.offset > 0),
			tap((e) => {
				console.log('CALL', e.billing.billingKey);
			}),

			map((e) => this.composeApproveBillingCmd(e.billing))
		);
	};

	@Saga()
	billingResumed = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingResumedEvent),
			filter((e) => e.billing.unregisteredAt === undefined),
			filter(
				(e) =>
					DateTime.now() > DateTime.fromISO(e.billing.nextPaymentAt!)
			),
			map((e) => this.composeApproveBillingCmd(e.billing))
		);
	};

	private composeApproveBillingCmd(billingProps: BillingProps) {
		const {billingKey, pricePlan, customerKey} = billingProps;
		console.log('commnads');
		return new ApproveBillingPaymentCommand(billingKey, {
			amount: pricePlan.planPrice,
			customerKey: customerKey,
			orderId: `${customerKey}_${pricePlan.planId}_${DateTime.now()
				.valueOf()
				.toString(16)}`,
			orderName: pricePlan.planName,
		});
	}
}
