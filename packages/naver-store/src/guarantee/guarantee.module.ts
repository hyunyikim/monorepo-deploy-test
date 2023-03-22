import { Module } from "@nestjs/common";

import { GlobalModule } from "src/global.module";
import { GuaranteeEventListener } from "src/guarantee/events/guarantee.listener";
import { InterworkModule } from "src/interwork/interwork.module";

import { GuaranteeService } from "./guarantee.service";
import { GuaranteeController } from "./guarantee.controller";

@Module({
  imports: [GlobalModule, InterworkModule],
  controllers: [GuaranteeController],
  providers: [GuaranteeService, GuaranteeEventListener],
  exports: [GuaranteeService],
})
export class GuaranteeModule {}
