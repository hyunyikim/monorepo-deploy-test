import { IsEnum, IsString } from "class-validator";

import { eProductOrderStatus } from "src/common/enums/product-order-status.enum";
import { GuaranteeEvent } from "src/guarantee/entities/guarantee-event.entity";
import { ChangedOrder } from "src/naver-api/interfaces/naver-store-api.interface";
import { Nft } from "src/vircle-entities";

export class NaverStoreGuarantee {
  /** Partition Key */
  @IsString()
  productOrderId: string;

  @IsEnum(eProductOrderStatus)
  productOrderStatus: eProductOrderStatus;

  reqNftId: number;
  reqNftStatus: number;
  accountId: string;
  order: ChangedOrder;
  productId: string;
  categoryId: string;
  canceledAt: string;
  canceledNft: Nft;
}
