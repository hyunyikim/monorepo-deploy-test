import {IsNumber, IsOptional, IsString} from 'class-validator';
import {Transform} from 'class-transformer';

export class FindPaymentsQueryDto {
	@IsString()
	@IsOptional()
	readonly startAt: Date;

	@IsString()
	@IsOptional()
	readonly endAt: Date;

	@IsOptional()
	@Transform(
		({value}) => {
			return (
				{
					['oldest']: 'ASC',
					['latest']: 'DESC',
				}[value] || 'DESC'
			);
		},
		{toClassOnly: true}
	)
	@IsString()
	readonly sort: 'ASC' | 'DESC';

	@IsNumber()
	@IsOptional()
	@Transform(({value}) => Number(value || 1))
	readonly page: number;

	@IsNumber()
	@IsOptional()
	@Transform(({value}) => Number(value || 10))
	readonly pageSize: number;
}
