import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const _request = ctx.getRequest<Request>();
		const status = exception.getStatus();

		response.status(status).json({
			code: exception.name,
			message: exception.message,
		});
	}
}
