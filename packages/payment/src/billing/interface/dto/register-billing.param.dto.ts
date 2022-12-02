import {IsString} from 'class-validator';

export class RegisterBillingDTO {
	@IsString()
	readonly customerKey: string;

	@IsString()
	readonly authKey: string;
}
