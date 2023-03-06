import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest<Request>();
    let { url } = req;
    const { method } = req;

    const urlPaths = url.split("/");
    if (urlPaths[1] === "naver-store" && urlPaths[2] === "naver-store") {
      url = urlPaths.splice(1, 1).join("/");
    }
    Logger.debug(`Incoming request - Method: ${method}, URL: ${url}`);

    return next.handle();
  }
}
