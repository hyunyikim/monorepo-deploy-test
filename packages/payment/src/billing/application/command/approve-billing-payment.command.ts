import {ICommand} from '@nestjs/cqrs';
import {PricePlanProps} from '../../domain';

export class ApproveBillingPaymentCommand implements ICommand {
	constructor(
		readonly partnerIdx: number,
		readonly billingKey: string,
		readonly pricePlan: PricePlanProps,
		readonly payload: {
			amount: number;
			customerKey: string;
			orderId: string;
			orderName: string;
		}
	) {}
}
