import {ICommand} from '@nestjs/cqrs';

export class RegisterBillingCommand implements ICommand {
	constructor(
		readonly customerKey: string,
		readonly cardInfo: {
			cardNumber: string;
			cardExpirationYear: string;
			cardExpirationMonth: string;
			cardPassword: string;
		},
		readonly customerInfo: {
			customerIdentityNumber: string;
			customerName: string;
			customerEmail: string;
		},
		readonly vbv: {
			cavv: string;
			xid: string;
			eci: string;
		}
	) {}
}

export class UnregisterBillingCommand implements ICommand {
	constructor(readonly billingKey: string) {}
}
