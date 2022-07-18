import {Type} from 'class-transformer';
import {
	IsArray,
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsString,
	ValidateNested,
} from 'class-validator';

export class Cafe24Interwork {
	@IsNumber()
	partnershipIdx: number;

	@IsString()
	mallId: string;

	@IsObject()
	@ValidateNested()
	@Type(() => AccessToken)
	accessToken: AccessToken;
}

export class AccessToken {
	@IsNotEmpty()
	@IsString()
	access_token: string;

	@IsNotEmpty()
	@IsDateString()
	expires_at: string;

	@IsNotEmpty()
	@IsString()
	refresh_token: string;

	@IsNotEmpty()
	@IsDateString()
	refresh_token_expires_at: string;

	@IsNotEmpty()
	@IsString()
	client_id: string;

	@IsNotEmpty()
	@IsString()
	mall_id: string;

	@IsNotEmpty()
	@IsString()
	user_id: string;

	@IsNotEmpty()
	@IsArray()
	scopes: string[];

	@IsNotEmpty()
	@IsDateString()
	issued_at: string;
}
