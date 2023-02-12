import {IsNumber, IsString} from 'class-validator';

export class RegisterCardBodyDTO {
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

export class RegisterBillingBodyDTO extends RegisterCardBodyDTO {
	@IsString()
	readonly planId: string;
}

export class RegisterFreeBillingBodyDTO {
	@IsNumber()
	readonly planMonth?: number;

	@IsNumber()
	readonly planLimit?: number;
}

export class CustomerKeyDTO {
	@IsString()
	readonly customerKey: string;
}

export class ChangeBillingPlanBodyDTO {
	@IsString()
	readonly planId: string;
}

export class AdminRegisterFreeBillingBodyDTO {
	@IsNumber()
	readonly partnerIdx: number;

	@IsNumber()
	readonly planMonth: number;

	@IsNumber()
	readonly planLimit: number;
}

export class AdminRegisterEnterpriseBillingBodyDTO {
	@IsNumber()
	readonly partnerIdx: number;
}
