import { readFileSync, existsSync } from "fs";
import * as yaml from "js-yaml";
import { join } from "path";
import { plainToInstance } from "class-transformer";
import {
  IsEnum,
  IsObject,
  IsString,
  ValidateNested,
  validateSync,
} from "class-validator";
import { HttpModuleOptions } from "@nestjs/axios";

import { ENV } from "src/common/enums/env.enum";
import { ErrorResponse } from "src/common/error";
import { ErrorMetadata } from "src/common/error-metadata";

export class NaverConfig {
  @IsObject()
  auth: {
    id: string;
    secret: string;
    name: string;
    accountId: string;
  };

  @IsObject()
  http: HttpModuleOptions;
}

export class AwsConfig {
  @IsString()
  region: string;
}
export class Config {
  @IsEnum(ENV)
  env: ENV;

  @ValidateNested()
  naver: NaverConfig;

  @ValidateNested()
  aws: AwsConfig;
}

export const config = (() => {
  const configFilePath = join(
    process.cwd(),
    "dist",
    "env",
    `${process.env.NODE_ENV as string}.yaml`
  );

  if (!existsSync(configFilePath)) {
    throw new ErrorResponse(ErrorMetadata.noConfigFile(configFilePath));
  }

  const _config = {
    ...(yaml.load(readFileSync(configFilePath, "utf8")) as Record<string, any>),
    env: process.env.NODE_ENV ?? "local",
  };
  const configInstance = plainToInstance(Config, _config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(configInstance, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return configInstance;
})();
