import { Module } from "@nestjs/common";

import { GlobalModule } from "src/global.module";

import { InterworkService } from "./interwork.service";
import { InterworkController } from "./interwork.controller";

@Module({
  imports: [GlobalModule],
  controllers: [InterworkController],
  providers: [InterworkService],
  exports: [InterworkService],
})
export class InterworkModule {}
