import {
	Inject,
	Injectable,
	LoggerService,
	NestMiddleware,
} from '@nestjs/common';
import {Request, Response, NextFunction} from 'express';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
	) {}

	use(request: Request, response: Response, next: NextFunction): void {
		const {ip, method, url} = request;
		const userAgent = request.get('user-agent') || '';

		response.on('finish', () => {
			const {statusCode} = response;

			this.logger.log(
				`[${method}] ${url} (${statusCode}) - ${userAgent} [${ip}]`
			);
		});

		next();
	}
}
