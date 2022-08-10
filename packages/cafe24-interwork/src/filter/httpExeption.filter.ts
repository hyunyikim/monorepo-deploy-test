import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Inject,
	InternalServerErrorException,
	LoggerService,
} from '@nestjs/common';
import {WINSTON_MODULE_NEST_PROVIDER} from 'nest-winston';
import {Request, Response} from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: LoggerService
	) {}

	catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse<Response>();
		const req = ctx.getRequest<Request>();

		if (!(exception instanceof HttpException)) {
			exception = new InternalServerErrorException();
		}

		const response = (exception as HttpException).getResponse();
		const stack = exception.stack;
		const log = {
			url: req.url,
			response,
			stack,
		};

		this.logger.log(log);

		res.status((exception as HttpException).getStatus()).json(response);
	}
}
