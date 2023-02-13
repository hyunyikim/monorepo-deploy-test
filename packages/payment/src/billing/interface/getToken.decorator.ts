import {
	createParamDecorator,
	ExecutionContext,
	UnauthorizedException,
} from '@nestjs/common';
import {ADMIN_TYPE} from './guards/jwt-auth.guard';

export interface TokenInfo {
	partnerIdx: number;
	adminType: ADMIN_TYPE;
	token: string;
}

export const GetToken = createParamDecorator(
	(data, ctx: ExecutionContext): TokenInfo => {
		const req: Express.Request = ctx.switchToHttp().getRequest();
		if (
			!('partnerIdx' in req) ||
			!('adminType' in req) ||
			!('token' in req)
		)
			throw new UnauthorizedException('No Token Info');

		return {
			partnerIdx: req['partnerIdx'] as number,
			adminType: req['adminType'] as ADMIN_TYPE,
			token: req['token'] as string,
		};
	}
);
