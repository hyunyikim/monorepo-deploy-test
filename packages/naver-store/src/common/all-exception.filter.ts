/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  Logger,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { AxiosError } from "axios";
import { TypeORMError } from "typeorm";

import { ErrorResponse } from "src/common/error";
import { ResponseFormat } from "src/common/response-format";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    try {
      const errorFormat = this.createResponseFormat(exception);

      /**
       * 로깅 도중 Sentry 라이브러리 에러가 발생해 아래와 같이 예외처리.
       */
      try {
        Logger.error(JSON.stringify(errorFormat));
      } catch (e) {
        Logger.error(JSON.stringify(errorFormat));
      }

      response.status(errorFormat.statusCode).json(errorFormat);
    } catch (e: any) {
      Logger.error(`AllExceptionsFilter error, error: ${JSON.stringify(e)}`);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        data: null,
        error: {
          message: e.message || "AllExceptionsFilter error",
          code: -9999,
          name: "AllExceptionsFilterError",
        },
      } as ResponseFormat);
    }
  }

  createResponseFormat(exception: any) {
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const error = {
      name: "UNHANDLED_ERROR",
      message: "unhandled error",
      code: -9999,
    } as Record<string, any>;

    if (exception instanceof ErrorResponse) {
      statusCode = exception.getStatus();
      error.name = exception.errName;
      error.message = exception.message;
      error.code = exception.code;
      error.cause = exception.cause;
      error.description = exception.description;
      error.extra = exception.extra;
    } else if (exception instanceof AxiosError) {
      statusCode =
        exception.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      error.message = exception.response?.data?.message || "axios error";
    } else if (exception instanceof TypeORMError) {
    } else if (exception instanceof HttpException) {
      // class-validator error
      statusCode = exception.getStatus();
      error.name = exception.name;
      const message = exception["response"].message;
      error.message = typeof message === "string" ? message : { ...message }; // class-validator error
      error.code = -9000;
      error.cause = exception.cause;
      const options = exception["options"] as Record<string, any>;
      error.extra = Object.keys(options).length ? options : undefined;
    } else {
      // unhandled error
    }

    return {
      statusCode,
      timestamp: new Date().toISOString(),
      data: null,
      error: error,
    } as ResponseFormat;
  }
}
