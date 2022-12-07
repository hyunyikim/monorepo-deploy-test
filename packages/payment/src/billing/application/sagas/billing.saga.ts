import {Injectable} from '@nestjs/common';
import {ICommand, ofType, Saga} from '@nestjs/cqrs';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApproveBillingPaymentCommand} from '../command';
import {BillingRegisteredEvent} from '../../domain/event';
import {DateTime} from 'luxon';
@Injectable()
export class BillingSaga {
	@Saga()
	billingRegistered = (events$: Observable<any>): Observable<ICommand> => {
		return events$.pipe(
			ofType(BillingRegisteredEvent),
			map((event) => {
				const {billing} = event;
				const {billingKey, pricePlan, customerKey} = billing;
				console.log('BILLING APPROVE COMMAND DISPATCHED');
				return new ApproveBillingPaymentCommand(billingKey, {
					amount: pricePlan.planPrice,
					customerKey: customerKey,
					orderId: `${customerKey}_${
						pricePlan.planId
					}_${DateTime.now().valueOf().toString(16)}`,
					orderName: pricePlan.planName,
				});
			})
		);
	};
}
