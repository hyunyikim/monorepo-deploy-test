import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Inject,
	InternalServerErrorException,
	LoggerService,
} from '@nestjs/common';

import {Request, Response} from 'express';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
	) {}

	catch(err: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest<Request>();
		const res = ctx.getResponse<Response>();
		let exception: HttpException;

		if (!(err instanceof HttpException)) {
			exception = new InternalServerErrorException(err);
		} else {
			exception = err;
		}

		this.logger.error({
			exception,
			req: {
				path: req.path,
				params: req.params,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				body: req.body,
				headers: req.headers,
			},
		});
		const response = exception.getResponse();
		res.status(exception.getStatus()).json(response);
	}
}
