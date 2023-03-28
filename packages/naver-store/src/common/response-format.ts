import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseFormat<T = any> {
  data: T | null;
  error: ErrorFormat | null;
  statusCode: HttpStatus;
  timestamp: string;
}

export class AxiosErrorResponseFormat {
  data: null;
  error: ErrorFormat;
  statusCode: HttpStatus;
  timestamp: string;
}

export class ErrorFormat {
  @ApiProperty()
  name: string;
  @ApiProperty()
  code: number;
  @ApiProperty()
  message: string;
  description?: string;
  cause?: Error;
  extra?: Record<string, any>;
}
