import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  utilities,
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
} from "nest-winston";
import { transports, format, transport } from "winston";
import WinstonCloudwatch from "winston-cloudwatch";
import { DateTime } from "luxon";
import * as SentryNode from "@sentry/node";
import Sentry from "winston-sentry-log";

import { ENV } from "src/common/enums/env.enum";

@Injectable()
export class LoggerService implements WinstonModuleOptionsFactory {
  constructor(private config: ConfigService) {}
  createWinstonModuleOptions():
    | Promise<WinstonModuleOptions>
    | WinstonModuleOptions {
    const env = this.config.getOrThrow<ENV>("env");
    const isProduction = env === ENV.PRODUCTION;
    const { errors, combine, json, timestamp, ms, splat, prettyPrint } = format;
    const _transports: transport[] = [
      new Sentry({
        config: {
          dsn: this.config.getOrThrow("sentry.dsn"),
          server_name: this.config.getOrThrow("sentry.serverName"),
          environment: env,
        },
        level: "error",
      } as ISentryOptions),
      new transports.Console({
        level: "debug",
        format: combine(
          utilities.format.nestLike("naver-store", {
            prettyPrint: true,
            colors: true,
          })
        ),
      }),
    ];
    ENV.LOCAL !== env &&
      _transports.push(
        new WinstonCloudwatch({
          level: isProduction ? "info" : "silly",
          logGroupName: `naver-store-${env}`,
          logStreamName: DateTime.now().toSQLDate(),
          awsRegion: this.config.getOrThrow("aws.region"),
          jsonMessage: true,
        })
      );

    const loggerOptions = {
      format: combine(
        errors({ stack: true }),
        json(),
        timestamp(),
        ms(),
        splat(),
        prettyPrint()
      ),
      transports: _transports,
    };

    return loggerOptions;
  }
}

interface ISentryOptions {
  name?: string; // (String) - transport's name (defaults to winston-sentry-log)
  silent?: boolean; // (Boolean) - suppress logging (defaults to false)
  level: keyof tSentryLevel; // (String) - transport's level of messages to log (defaults to info)
  levelsMap?: tSentryLevel; // (Object) - log level mapping to Sentry (see Log Level Mapping below)
  sentryClient?: typeof SentryNode; //  (Sentry) - the custom sentry client (defaults to require('@sentry/node'))
  isClientInitialized?: boolean; // (boolean) - whether to initialize the provided sentry client or not (defaults to false)
  tags?: string;
  config: tSentryInitOptions;
}

type tSentryInitOptions = {
  dsn: string;
  logger?: string; // (String) - defaults to winston-sentry-log
  server_name?: string; // (String) - defaults to process.env.SENTRY_NAME or os.hostname()
  release?: string; // (String) - defaults to process.env.SENTRY_RELEASE
  environment?: string; // (String) - defaults to process.env.SENTRY_ENVIRONMENT)
  modules?: Record<string, any>; // (Object) - defaults to package.json dependencies
  extra?: Record<string, any>; // (Object) - no default value
  fingerprint?: Array<any>; // (Array) - no default value
};

type tSentryLevel = {
  silly: "debug";
  verbose: "debug";
  info: "info";
  debug: "debug";
  warn: "warning";
  error: "error";
};
