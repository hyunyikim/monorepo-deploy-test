import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger,
} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const {url, body} = ctx.getRequest<Request>();

		const isNotHealthCheckUrl = url !== '/' && url !== '/cafe24';
		process.env.NODE_ENV !== 'production' &&
			isNotHealthCheckUrl &&
			Logger.log(url, body);

		return next.handle();
	}
}
