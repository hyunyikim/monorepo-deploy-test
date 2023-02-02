import {ICommand} from '@nestjs/cqrs';

export class RegisterBillingCommand implements ICommand {
	constructor(
		readonly partnerIdx: number,
		readonly planId: string,
		readonly customerKey: string,
		readonly cardInfo: {
			cardNumber: string;
			cardExpirationYear: string;
			cardExpirationMonth: string;
			cardPassword: string;
			customerIdentityNumber: string;
			customerName?: string;
			customerEmail?: string;
		}
	) {}
}

export class RegisterFreeBillingCommand implements ICommand {
	constructor(
		readonly partnerIdx: number,
		readonly planMonth?: number,
		readonly planLimit?: number
	) {}
}

export class UnregisterBillingCommand implements ICommand {
	constructor(readonly customerKey: string) {}
}
