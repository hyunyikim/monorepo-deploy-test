import {ICommand} from '@nestjs/cqrs';
import {TokenInfo} from '../../interface/getToken.decorator';

export class RegisterBillingCommand implements ICommand {
	constructor(
		readonly token: TokenInfo,
		readonly planId: string,
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

export class RegisterCardCommand implements ICommand {
	constructor(
		readonly token: TokenInfo,
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

export class DeleteCardCommand implements ICommand {
	constructor(readonly token: TokenInfo) {}
}

export class UnregisterBillingCommand implements ICommand {
	constructor(readonly customerKey: string) {}
}

export class DeleteBillingCommand implements ICommand {
	constructor(readonly partnerIdx: number) {}
}
