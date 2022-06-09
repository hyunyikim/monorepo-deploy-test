import {IsDecimal, IsArray, IsJSON} from 'class-validator';

export class FindAdminDto {
	@IsDecimal()
	readonly idx: number;
}

export class FindAdminListDto {
	@IsArray()
	readonly sort: [string, 'ASC' | 'DESC'];

	@IsArray()
	readonly range: [number, number];

	@IsJSON()
	readonly filter: Record<string, string>;
}
