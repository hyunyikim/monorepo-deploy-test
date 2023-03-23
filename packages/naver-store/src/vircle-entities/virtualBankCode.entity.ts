import { Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "TB_VBANK_CODE" })
export class VirtualBankCode {
  @PrimaryColumn({
    name: "vbank_name",
    type: "varchar",
    length: 250,
    nullable: false,
  })
  virtualBankName: string;

  @PrimaryColumn({
    name: "pg_provider",
    type: "varchar",
    length: 250,
    nullable: false,
  })
  paymentGatewayProvider: string;

  @PrimaryColumn({
    name: "vbank_code",
    type: "varchar",
    length: 250,
    nullable: false,
  })
  virtualBankCode: string;
}
