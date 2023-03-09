import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { GlobalModule } from "./global.module";
import { InterworkModule } from "./interwork/interwork.module";
import { GuaranteeModule } from "./guarantee/guarantee.module";

@Module({
  imports: [GlobalModule, InterworkModule, GuaranteeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
