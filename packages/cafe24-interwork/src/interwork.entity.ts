import {Type} from 'class-transformer';
import {
	IsArray,
	IsDateString,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import {AccessToken, Store} from './Cafe24ApiService';

export class IssueSetting {
	@IsString()
	issueTiming: 'AFTER_SHIPPING' | 'AFTER_DELIVERED';

	@IsArray()
	issueCategories: string[];

	@IsArray()
	issueProducts: string[];

	@IsArray()
	issueCustomerGroups: string[];
}
export class Cafe24Interwork {
	@IsNumber()
	partnerIdx: number;

	@IsString()
	mallId: string;

	/** 최근 사용된 Auth Code */
	@IsString()
	authCode: string;

	@IsObject()
	@ValidateNested()
	@Type(() => AccessToken)
	accessToken: AccessToken;

	@IsObject()
	@ValidateNested()
	@Type(() => Store)
	store: Store;

	@IsObject()
	@ValidateNested()
	@Type(() => IssueSetting)
	issueSetting: IssueSetting;

	@IsDateString()
	joinedAt: string;

	@IsDateString()
	confirmedAt: string;

	@IsDateString()
	updatedAt: string;

	@IsOptional()
	@IsDateString()
	leavedAt?: string;

	@IsOptional()
	@IsString()
	reasonForLeave: string[];
}
