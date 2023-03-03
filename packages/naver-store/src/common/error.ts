import { HttpException, HttpStatus } from "@nestjs/common";
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  validateOrReject,
} from "class-validator";

export class ErrorResponse extends HttpException {
  private _name: string;
  private _code: number;
  private _extra?: Record<string, any>;
  private _description?: string;

  constructor(dto: ErrorParamDto, cause?: Error) {
    validateOrReject(new ErrorParamDto(dto));
    const { code, message, name, description, options, status = 200 } = dto;
    super(message, status, { cause, description });
    this._name = name;
    this._code = code;
    this._extra = options;
    this._description = description;
  }

  get errName() {
    return this._name;
  }
  get code() {
    return this._code;
  }
  get extra() {
    return this._extra;
  }
  get description() {
    return this._description;
  }
}

export class ErrorParamDto {
  constructor(obj: ErrorParamDto) {
    Object.assign(this, obj);
  }
  @IsString()
  name: string;

  @IsString()
  message: string;

  @IsNumber()
  code: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(HttpStatus)
  @IsOptional()
  status?: HttpStatus;

  @IsObject()
  options?: Record<string, any>;
}