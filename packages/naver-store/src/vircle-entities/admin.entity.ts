import { Exclude, Expose } from "class-transformer";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToOne,
} from "typeorm";
import { Brand } from "./brand.entity";
import { BLOCKCHAIN_PLATFORM } from "./enums";
import { Nft } from "./nft.entity";

enum YN {
  YES = "Y",
  NO = "N",
}

export enum SUB_ACCOUNT_ROLE {
  CS = "C",
  INSPECTOR = "I",
  FINAL_INSPECTOR = "F",
}

export enum ADMIN_TYPE {
  MASTER = "M",
  MANAGER = "A",
  INSPECTOR = "V",
  REPAIRER = "R",
  B2B = "b2b",
}

export enum B2BType {
  BRAND = "B",
  PLATFORM = "P",
  COOPERATOR = "C",
}

@Entity({ name: "TB_ADMIN" })
export class Admin {
  @PrimaryGeneratedColumn({ name: "admin_idx", type: "int" })
  idx: number;

  @Column({ name: "parent_idx", type: "int" })
  parentId: number;

  @ManyToOne(() => Admin, (admin) => admin.children, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  @JoinColumn({ name: "parent_idx" })
  parent: Promise<Admin>;

  @OneToMany(() => Admin, (admin) => admin.parent, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  children: Promise<Admin[]>;

  @Column({ name: "admin_type", enum: ADMIN_TYPE })
  adminType: ADMIN_TYPE;

  @Column({ name: "admin_nm", type: "varchar", length: 30 })
  name: string;

  @Index({ unique: true })
  @Column({ name: "admin_email", type: "varchar", length: 50 })
  email: string;

  @Exclude()
  @Column({ name: "admin_pw", type: "varchar", length: 250, select: false })
  password: string;

  @Column({ name: "admin_tel", type: "varchar", length: 15 })
  adminTelephone: string;

  @Expose({ groups: [] })
  @Column({ name: "use_yn", enum: YN, default: YN.YES })
  used: YN;

  @Column({ name: "reg_id", type: "varchar" })
  registrantIdx: string;

  @ManyToOne(() => Admin, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  @JoinColumn({ name: "reg_id" })
  registrant: Admin;

  @Expose({ groups: [] })
  @CreateDateColumn({ name: "reg_dt", type: "datetime" })
  registered: Date;

  @ManyToOne(() => Admin, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  @JoinColumn({ name: "mod_id" })
  modifier: Admin;

  @Expose({ groups: [] })
  @UpdateDateColumn({ name: "mod_dt", type: "datetime", nullable: false })
  modified: Date;

  @Expose()
  @Column({ name: "company_nm", type: "varchar", length: 250 })
  companyName: string;

  /** 노출되는 이름 (브랜드명) */
  @Expose()
  @Column({ name: "display_nm", type: "varchar", length: 30 })
  displayName: string;

  //사업자 번호
  @Expose()
  @Column({ name: "business_num", type: "varchar", length: 250 })
  businessNum: string;

  @Column({ name: "business_paper_img", type: "varchar", length: 250 })
  businessPaperImage: string;

  @Column({ name: "b2b_type", enum: B2BType, nullable: true })
  b2bType: B2BType;

  @Column({
    name: "corperate_num",
    type: "varchar",
    length: 250,
    nullable: true,
  })
  corporationNum: string;

  @Expose({ groups: ["detail"] })
  @Column({ name: "biz_zipcode", type: "varchar", length: 10, nullable: true })
  zipcode: string;

  @Expose({ groups: ["detail"] })
  @Column({ name: "biz_addr1", type: "varchar", length: 250, nullable: true })
  bizAddr1: string;

  @Expose({ groups: ["detail"] })
  @Column({ name: "biz_addr2", type: "varchar", length: 250, nullable: true })
  bizAddr2: string;

  @Expose({ groups: ["detail"] })
  @Column({ name: "expiration_dt", type: "datetime", nullable: true })
  expireDate: Date;

  @Expose({ groups: ["detail"] })
  @Column({ name: "pay_plan", type: "varchar", length: 10, nullable: true })
  payPlan: string;

  @Expose({ groups: ["detail"] })
  @Column({ name: "profile_img", type: "varchar", length: 250, nullable: true })
  profileImage: string;

  @Expose({ groups: ["detail"] })
  @Column({ name: "auth_info", type: "mediumtext", nullable: true })
  authInfo: string;

  @Expose({ groups: ["detail"] })
  @Column({ name: "klip_wallet_address", type: "varchar", length: 250 })
  klipWalletAddress: string;

  @Exclude()
  @Column({ name: "leave_yn", enum: YN, default: YN.NO })
  isLeaved: YN;

  @Expose({ groups: ["detail"] })
  @Column({ name: "leave_dt", type: "datetime", nullable: true })
  leaved: Date;

  @Expose({ groups: ["detail"] })
  @Column({ name: "auth_key", type: "mediumtext", nullable: true })
  authKey: string;

  //????? 어떤 용도인지 모르겠음.
  @Expose({ groups: ["detail"] })
  @Column({ name: "main_yn", enum: YN, default: YN.NO })
  mainYN: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_category",
    type: "varchar",
    length: 20,
    default: "1,2,3,4,5,6",
  })
  useCategory: string;

  @Expose({ groups: ["detail"] })
  @Column({ name: "use_unipass", enum: YN, default: YN.YES })
  useUnipass: YN;

  @Expose({ groups: ["detail"] })
  @Column({ name: "use_inspect", enum: YN, default: YN.YES })
  useInspect: YN;

  @Expose({ groups: ["detail"] })
  @Column({ name: "use_repair", enum: YN, default: YN.YES })
  useRepair: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "view_field_brand_nm",
    enum: YN,
    default: YN.YES,
  })
  viewFieldBrandName: YN;

  @Expose({ groups: ["detail"] })
  @Column({ name: "view_field_price", enum: YN, default: YN.YES })
  viewFieldPrice: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_field_model_num",
    enum: YN,
    default: YN.YES,
  })
  useFieldModelNum: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_field_material",
    enum: YN,
    default: YN.NO,
  })
  useFieldMaterial: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_field_size",
    enum: YN,
    default: YN.NO,
  })
  useFieldSize: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_field_weight",
    enum: YN,
    default: YN.NO,
  })
  useFieldWeight: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_card_name",
    type: "varchar",
    length: 50,
    default: "디지털 보증서",
    nullable: false,
  })
  nftCardName: string;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_group_symbol_img",
    type: "varchar",
    length: 250,
  })
  nftGroupSymbolImg: string;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_group_name",
    type: "varchar",
    length: 50,
  })
  nftGroupName: string;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_bg_img",
    type: "varchar",
    length: 250,
  })
  nftBackgroundImg: string;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_bg_color",
    type: "varchar",
    length: 20,
  })
  nftBackgroundColor: string;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_logo_img",
    type: "varchar",
    length: 250,
  })
  nftLogoImg: string;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_custom_field",
    type: "varchar",
    length: 100,
  })
  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_nft_logo",
    enum: YN,
    default: YN.YES,
  })
  useNftLogo: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_nft_prod_img",
    enum: YN,
    default: YN.YES,
  })
  useNnfProdImage: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_alimtalk",
    enum: YN,
    default: YN.YES,
  })
  useAlimTalk: YN;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_prod_img_x",
    type: "varchar",
    default: "50%",
  })
  nftProductionImgX: number;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_prod_img_y",
    type: "varchar",
    default: "50%",
  })
  nftProductionImgY: number;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_prod_img_w",
    type: "int",
    default: 700,
  })
  nftProductionImgW: number;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_prod_img_h",
    type: "int",
    default: 700,
  })
  nftProductionImgH: number;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "use_direct_mint",
    enum: YN,
    default: YN.NO,
  })
  useDirectMint: YN;

  @Expose({ groups: ["sub-account"] })
  @Column({
    name: "sub_account_role",
    enum: SUB_ACCOUNT_ROLE,
    nullable: true,
  })
  subAccountRole: string;

  @OneToMany(() => Nft, (nft) => nft.register, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  nftList: Promise<Nft[]>;

  @Column({
    name: "exc_inspector_idx",
    type: "int",
  })
  excInspectorIdx: number;

  @Column({
    name: "exc_repairer_idx",
    type: "int",
  })
  excRepairerIdx: number;

  @Column({
    name: "brand_idx",
    type: "int",
  })
  brandIdx: string;

  @OneToOne(() => Brand, { createForeignKeyConstraints: false, eager: true })
  @JoinColumn({ name: "brand_idx" })
  brand: Brand;

  @Column({
    name: "warranty_dt",
    type: "varchar",
    length: 250,
  })
  warrantyDate: string;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "blockchain_platform",
    enum: BLOCKCHAIN_PLATFORM,
    default: BLOCKCHAIN_PLATFORM.KLAYTN_KLIP,
  })
  blockchainPlatform: BLOCKCHAIN_PLATFORM;

  @Expose({ groups: ["detail"] })
  @Column({
    name: "nft_custom_field",
    type: "varchar",
    length: 100,
  })
  nftCustomField: string;

  @Column({
    name: "webhook_api_transfer",
    type: "varchar",
    length: 250,
  })
  webhookApiTransfer: string;

  @Column({
    name: "webhook_api_wallet",
    type: "varchar",
    length: 250,
  })
  webhookApiWallet: string;

  @Column({
    name: "after_service_info",
    type: "varchar",
    length: 1000,
  })
  afterServiceInfo: string;

  @Column({
    name: "return_info",
    type: "varchar",
    length: 1000,
  })
  returnInfo: string;

  @Column({
    name: "use_auto_increment_order_num",
    enum: YN,
  })
  useAutoIncrementOrderNum: YN;

  @Column({
    name: "customer_center_url",
    type: "varchar",
    length: 250,
  })
  customerCenterUrl: string;
}
