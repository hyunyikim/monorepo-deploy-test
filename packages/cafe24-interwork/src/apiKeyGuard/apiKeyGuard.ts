import {
	Injectable,
	CanActivate,
	ExecutionContext,
	Inject,
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Request} from 'express';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
	private apiKey: string;
	constructor(@Inject(ConfigService) private configService: ConfigService) {
		this.apiKey = configService.getOrThrow('CAFE24_X_API_KEY');
	}

	canActivate(
		context: ExecutionContext
	): boolean | Promise<boolean> | Observable<boolean> {
		const req: Request = context.switchToHttp().getRequest();
		const apiKey = req.headers['X-API-Key'];
		console.log(apiKey, this.apiKey);
		if (!apiKey) {
			return false;
		}

		return this.apiKey === apiKey;
	}
}
