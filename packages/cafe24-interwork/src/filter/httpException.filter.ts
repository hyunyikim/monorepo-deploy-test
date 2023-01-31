import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
	catch(err: any, host: ArgumentsHost) {
		Logger.error(err);

		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const exception =
			err instanceof HttpException
				? err
				: new InternalServerErrorException(err);
		const httpStatus = exception.getStatus();

		response.status(httpStatus).json({
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			path: request.url,
			message: exception.message,
		});
	}
}
