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

	catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const req = ctx.getRequest<Request>();
		const res = ctx.getResponse<Response>();

		if (!(exception instanceof HttpException)) {
			exception = new InternalServerErrorException();
		}

		const response = (exception as HttpException).getResponse();

		this.logger.error({exception, req});

		res.status((exception as HttpException).getStatus()).json(response);
	}
}
