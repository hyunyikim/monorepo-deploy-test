import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	Logger,
} from '@nestjs/common';
import {randomUUID} from 'crypto';
import {Observable} from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const ctx = context.switchToHttp();
		const req = ctx.getRequest<Request>();
		const {body, method, url} = req;
		const traceId = randomUUID();
		req['traceId'] = traceId;
		const isNotHealthCheckUrl = url !== '/' && url !== '/cafe24';
		isNotHealthCheckUrl &&
			Logger.log(`${traceId} ${method} ${url} ${JSON.stringify(body)}`);

		return next.handle();
	}
}
