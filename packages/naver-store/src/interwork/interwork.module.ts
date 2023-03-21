import { Module } from "@nestjs/common";

import { GlobalModule } from "src/global.module";
import { InterworkEventListener } from "src/interwork/events/interwork.listener";

import { InterworkService } from "./interwork.service";
import { InterworkController } from "./interwork.controller";

@Module({
  imports: [GlobalModule],
  controllers: [InterworkController],
  providers: [InterworkService, InterworkEventListener],
})
export class InterworkModule {}
