import {IsString, IsNumber} from 'class-validator';

export class RegisterBillingBodyDTO {
	@IsString()
	readonly customerKey: string;

	@IsString()
	readonly authKey: string;

	@IsString()
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
	@IsString()
	readonly planId: string;
}

export class ChangeBillingPlanParamDTO {
	@IsString()
	readonly customerKey: string;
}

export class PauseBillingParamDTO {
	@IsString()
	readonly customerKey: string;
}
