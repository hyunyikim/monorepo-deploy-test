import { IsEnum, IsString } from "class-validator";

import { eProductOrderStatus } from "src/common/enums/product-order-status.enum";
import { GuaranteeEvent } from "src/guarantee/entities/guarantee-event.entity";

export class NaverStoreGuarantee {
  /** Partition Key */
  @IsString()
  productOrderId: string;

  @IsEnum(eProductOrderStatus)
  productOrderStatus: eProductOrderStatus;

  reqNftId: number;
  reqNftStatus: number;
  accountId: string;
  guaranteeEvent: GuaranteeEvent;
  productId: string;
  categoryId: string;
}
