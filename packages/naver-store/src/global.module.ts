import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
// import { MongooseModule } from "@nestjs/mongoose";
import AWS from "aws-sdk";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { EventEmitterModule } from "@nestjs/event-emitter";

import { config } from "src/common/configuration";
import { LoggerService } from "src/common/logger";
import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { GuaranteeRequestRepository as GuaranteeRepository } from "src/guarantee/entities/guarantee.repository";
import { VircleApiHttpService } from "src/common/vircle-api.http";
import { SqsService } from "src/common/sqs/sqs.service";
import { SlackReporter } from "src/common/slack";
import { ENV } from "src/common/enums/env.enum";

import { createHttpOptions } from "./common/http";
import { NaverStoreApi } from "./naver-api/naver-store.api";

@Global()
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      load: [() => config],
      isGlobal: true,
    }),
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) =>
        createHttpOptions(config, "naver.http"),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow("jwt.secret-key"),
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({ useClass: LoggerService }),
    EventEmitterModule.forRoot(),
    // MongooseModule.forRoot("mongodb://localhos2t/nest", {}),
  ],
  providers: [
    NaverStoreApi,
    {
      provide: InterworkRepository,
      useFactory: (config: ConfigService) => {
        const tableName = config.getOrThrow<string>(
          "aws.dynamodb.interwork.tableName"
        );
        const ddbClient = new AWS.DynamoDB.DocumentClient({
          region: config.getOrThrow("aws.region"),
        });
        return new InterworkRepository(ddbClient, tableName);
      },
      inject: [ConfigService],
    },
    {
      provide: GuaranteeRepository,
      useFactory: (config: ConfigService) => {
        const tableName = config.getOrThrow<string>(
          "aws.dynamodb.guarantee.tableName"
        );
        const ddbClient = new AWS.DynamoDB.DocumentClient({
          region: config.getOrThrow("aws.region"),
        });
        return new GuaranteeRepository(ddbClient, tableName);
      },
      inject: [ConfigService],
    },
    {
      provide: SqsService,
      useFactory: (config: ConfigService) => {
        const sqs = new AWS.SQS({
          region: config.getOrThrow("aws.region"),
        });
        return new SqsService(sqs, config);
      },
      inject: [ConfigService],
    },
    {
      provide: SlackReporter,
      useFactory: (config: ConfigService) => {
        const token = config.getOrThrow<string>("slack.botToken");
        const channel = config.getOrThrow<string>("slack.channelId");
        const env = config.getOrThrow<ENV>("env");

        return new SlackReporter(
          token,
          channel,
          env === ENV.DEVELOPMENT || env === ENV.LOCAL
        );
      },
      inject: [ConfigService],
    },
    {
      provide: VircleApiHttpService,
      useClass: VircleApiHttpService,
    },
  ],
  exports: [
    NaverStoreApi,
    InterworkRepository,
    GuaranteeRepository,
    VircleApiHttpService,
    SqsService,
    SlackReporter,
    JwtModule,
  ],
})
export class GlobalModule {}
