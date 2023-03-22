import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {ErrorResponse} from 'src/common/error';
import {ErrorMetadata} from 'src/common/error-metadata';

export interface TokenInfo {
	partnerIdx: number;
	token: string;
}

export const GetToken = createParamDecorator(
	(data, ctx: ExecutionContext): TokenInfo => {
		const req: Express.Request = ctx.switchToHttp().getRequest();
		if (!('partnerIdx' in req) || !('token' in req))
			throw new ErrorResponse(ErrorMetadata.noAuthToken);
		return {
			partnerIdx: req['partnerIdx'] as number,
			token: req['token'] as string,
		};
	}
);

export const GetTokenOrNot = createParamDecorator(
	(data, ctx: ExecutionContext): TokenInfo => {
		const req: Express.Request = ctx.switchToHttp().getRequest();
		return {
			partnerIdx: req['partnerIdx'] as number,
			token: req['token'] as string,
		};
	}
);
