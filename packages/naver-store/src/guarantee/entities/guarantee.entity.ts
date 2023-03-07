import { IsNumber } from "class-validator";

export class NaverStoreGuarantee {
  /** Partition Key */
  @IsNumber()
  id: number;
}
