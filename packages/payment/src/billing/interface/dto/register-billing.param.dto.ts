import {IsString, IsNumber} from 'class-validator';

export class RegisterBillingDTO {
	@IsString()
	readonly customerKey: string;

	@IsString()
	readonly authKey: string;

	@IsNumber()
	readonly planId: string;
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
	@IsNumber()
	readonly planId: string;
}

export class PauseBillingParamDTO {
	@IsString()
	readonly customerKey: string;
}
