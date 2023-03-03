import { HttpModuleOptions } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

import { ErrorResponse } from "src/common/error";
import { ErrorMetadata } from "src/common/error-metadata";

export function createHttpOptions(
  config: ConfigService,
  httpTarget: string
): HttpModuleOptions {
  const http = config.get<HttpModuleOptions>(httpTarget);
  if (!http) {
    throw new ErrorResponse(ErrorMetadata.getConfigFailed(httpTarget));
  }

  return http;
}
