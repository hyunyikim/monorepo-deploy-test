import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';

export interface TokenInfo {
	partnerIdx: number;
	token: string;
}

export const GetToken = createParamDecorator(
	(data, ctx: ExecutionContext): TokenInfo => {
		const req: Express.Request = ctx.switchToHttp().getRequest();
		if (!('partnerIdx' in req) || !('token' in req))
			throw new UnauthorizedException('No Token Info');

		return {
			partnerIdx: req['partnerIdx'] as number,
			token: req['token'] as string,
		};
	}
);
