import {ICommand} from '@nestjs/cqrs';
import {Billing, PricePlanProps} from '../../domain';

export class ApproveBillingPaymentCommand implements ICommand {
	constructor(
		readonly partnerIdx: number,
		readonly billing: Billing,
		readonly pricePlan: PricePlanProps,
		readonly payload: {
			amount: number;
			customerKey: string;
			orderId: string;
			orderName: string;
		},
		readonly canceledPricePlan?: PricePlanProps,
		readonly useDelay?: boolean
	) {}
}
