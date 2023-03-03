import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WinstonModule } from "nest-winston";
// import { MongooseModule } from "@nestjs/mongoose";

import { config } from "src/common/configuration";
import { LoggerService } from "src/common/logger";

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
  providers: [NaverStoreApi],
  exports: [NaverStoreApi],
})
export class GlobalModule {}
