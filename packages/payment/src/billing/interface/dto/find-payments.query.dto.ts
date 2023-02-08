import {IsNumber, IsOptional, IsString} from 'class-validator';
import {Transform} from 'class-transformer';
import {PAYMENT_STATUS} from '../../infrastructure/api-client';

export class FindPaymentsQueryDto {
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

	@IsOptional()
	@Transform(({value}) => PAYMENT_STATUS[value], {toClassOnly: true})
	@IsString()
	readonly status: PAYMENT_STATUS;

	@IsNumber()
	@IsOptional()
	@Transform(({value}) => Number(value || 1))
	readonly page: number;

	@IsNumber()
	@IsOptional()
	@Transform(({value}) => Number(value || 10))
	readonly pageSize: number;
}
