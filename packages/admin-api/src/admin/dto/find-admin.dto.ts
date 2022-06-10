import {plainToInstance, Transform, Type} from 'class-transformer';
import {
	IsDecimal,
	IsArray,
	IsJSON,
	IsNotEmpty,
	IsEmail,
	IsString,
	IsOptional,
	ValidateNested,
	IsNumber,
} from 'class-validator';

export class FindAdminDto {
	@IsDecimal()
	readonly idx: number;
}

export class FindAdminFilter {
	@IsOptional()
	@IsString()
	readonly name: string;

	@IsOptional()
	@IsEmail()
	readonly email: string;
}

export class Range {
	range: [number, number];
}

export class FindAdminListDto {
	// @IsArray()
	@Transform(({value}) => plainToInstance(Array, JSON.parse(value as string)))
	@Type(() => Array)
	@IsNotEmpty()
	readonly sort: [string, string];

	// @ValidateNested({each: true})
	@Transform(({value}) => plainToInstance(Array, JSON.parse(value as string)))
	@Type(() => Array)
	@IsNotEmpty()
	readonly range: [number, number];

	@ValidateNested({each: true})
	@Transform(({value}) =>
		plainToInstance(FindAdminFilter, JSON.parse(value as string))
	)
	@Type(() => FindAdminFilter)
	@IsNotEmpty()
	readonly filter: FindAdminFilter;
}
