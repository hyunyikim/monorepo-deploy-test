import {ICommand} from '@nestjs/cqrs';

export class ApproveBillingPaymentCommand implements ICommand {
	constructor(
		readonly billingKey: string,
		readonly payload: {
			amount: number;
			customerKey: string;
			orderId: string;
			orderName: string;
		}
	) {}
}
