import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
// import { MongooseModule } from "@nestjs/mongoose";
import AWS from "aws-sdk";

import { config } from "src/common/configuration";
import { LoggerService } from "src/common/logger";
import { InterworkRepository } from "src/interwork/entities/interwork.repository";
import { GuaranteeRequestRepository as GuaranteeRepository } from "src/guarantee/entities/guarantee.repository";
import { VircleApiHttpService } from "src/common/vircle-api.http";

import { createHttpOptions } from "./common/http";
import { NaverStoreApi } from "./naver-api/naver-store.api";

@Global()
@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (config: ConfigService) =>
        createHttpOptions(config, "naver.http"),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      load: [() => config],
      isGlobal: true,
    }),
    WinstonModule.forRootAsync({ useClass: LoggerService }),

    // MongooseModule.forRoot("mongodb://localhost/nest", {}),
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
          region: "ap-northeast-2",
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
          region: "ap-northeast-2",
        });
        return new GuaranteeRepository(ddbClient, tableName);
      },
      inject: [ConfigService],
    },
    {
      provide: VircleApiHttpService,
      useClass: VircleApiHttpService,
    },
  ],
  exports: [NaverStoreApi, InterworkRepository, GuaranteeRepository],
})
export class GlobalModule {}
