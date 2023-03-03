import { Module } from "@nestjs/common";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { GlobalModule } from "./global.module";
import { SellerModule } from "./seller/seller.module";

@Module({
  imports: [GlobalModule, AuthModule, SellerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
