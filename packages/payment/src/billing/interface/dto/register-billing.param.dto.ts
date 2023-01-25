import {IsString} from 'class-validator';

export class RegisterBillingBodyDTO {
	@IsString()
	readonly planId: string;

	@IsString()
	readonly cardNumber: string;

	@IsString()
	readonly cardExpirationYear: string;

	@IsString()
	readonly cardExpirationMonth: string;

	@IsString()
	readonly cardPassword: string;

	@IsString()
	readonly customerIdentityNumber: string;

	@IsString()
	readonly customerEmail: string;
}

export class UnregisterBillingDTO {
	@IsString()
	readonly customerKey: string;
}

export class FindBillingDTO {
	@IsString()
	readonly customerKey: string;
}

export class ChangeBillingPlanBodyDTO {
	@IsString()
	readonly planId: string;

	@IsString()
	readonly customerKey: string;
}

export class PauseBillingParamDTO {
	@IsString()
	readonly customerKey: string;
}
