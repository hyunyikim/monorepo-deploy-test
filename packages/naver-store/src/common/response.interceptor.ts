import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Response } from "express";
import { map, Observable } from "rxjs";

import { ResponseFormat } from "./response-format";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  /**
   * TODO: 응답 인터셉터
   * @param context
   * @param next
   * @returns
   */
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const res = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: unknown) => {
        const statusCode = res.statusCode || HttpStatus.OK;

        return {
          error: null,
          statusCode,
          data,
          timestamp: new Date().toLocaleString(),
        } as ResponseFormat;
      })
    );
  }
}
