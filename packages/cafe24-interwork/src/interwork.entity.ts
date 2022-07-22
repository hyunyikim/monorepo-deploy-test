import {Type} from 'class-transformer';
import {
	IsArray,
	IsDateString,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import {AccessToken, Store} from './Cafe24ApiService';

export enum ISSUE_TIMING {
	AFTER_SHIPPING = 'AFTER_SHIPPING',
}

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
	updatedAt: string;

	@IsOptional()
	@IsDateString()
	leavedAt?: string;
}
