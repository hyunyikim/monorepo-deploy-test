import { PartialType } from "@nestjs/swagger";
import { CreateInterworkDto } from "./create-interwork.dto";

export class UpdateInterworkDto extends PartialType(CreateInterworkDto) {}
