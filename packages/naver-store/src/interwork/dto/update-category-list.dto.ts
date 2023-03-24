import { PartialType } from "@nestjs/swagger";

import { IssueSetting } from "src/interwork/entities/interwork.entity";

export class UpdateSettingDto extends PartialType(IssueSetting) {}
