import { Module } from "@nestjs/common";

import { GlobalModule } from "src/global.module";

import { GuaranteeService } from "./guarantee.service";
import { GuaranteeController } from "./guarantee.controller";

@Module({
  imports: [GlobalModule],
  controllers: [GuaranteeController],
  providers: [GuaranteeService],
})
export class GuaranteeModule {}
