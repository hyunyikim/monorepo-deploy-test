import {
	Injectable,
	CanActivate,
	ExecutionContext,
	Inject,
	BadRequestException,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Request} from 'express';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(@Inject(JwtService) private jwtService: JwtService) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const header = req.headers.authorization;
		if (!header) {
			return false;
		}

		const token = header.replaceAll('Bearer ', '');
		req['token'] = token;
		return this.jwtService
			.verifyAsync(token)
			.then((payload: {idx: number; iat: number; exp: number}) => {
				req['partnerIdx'] = payload.idx;
				return true;
			})
			.catch((error) => {
				console.log(error);
				throw new BadRequestException('Invalid Token');
			});
	}
}

@Injectable()
export class MasterAuthGuard implements CanActivate {
	constructor(@Inject(JwtService) private jwtService: JwtService) {}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const header = req.headers.authorization;
		if (!header) {
			return false;
		}

		const token = header.replaceAll('Bearer ', '');
		req['token'] = token;
		return this.jwtService
			.verifyAsync(token)
			.then((payload: {idx: number; type: string}) => {
				return payload.type === 'M';
			})
			.catch((error) => {
				console.log(error);
				throw new BadRequestException('Invalid Token');
			});
	}
}
