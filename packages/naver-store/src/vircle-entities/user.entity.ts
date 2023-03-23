import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  PrimaryColumn,
  CreateDateColumn,
} from "typeorm";
import { Flex } from "./flex.entity";
import {
  YN,
  BLOCKCHAIN_PLATFORM,
  GENDER,
  REGISTRATION_ROUTE,
  USER_TYPE,
  DELETE_STATE,
} from "./enums";
import { Nft } from "./nft.entity";
import { Product } from "./product.entity";

@Entity({ name: "TB_USER" })
export class User {
  @PrimaryGeneratedColumn({ name: "user_idx", type: "int" })
  id: number;

  @Column({ name: "user_pw", type: "varchar", length: 250, select: false })
  password: string;

  @Column({ name: "user_num", type: "varchar", length: 16 })
  userNumber: string;

  @Column({ name: "user_nm", type: "varchar", length: 30 })
  name: string;

  @Column({ name: "user_nickname", type: "varchar", length: 100 })
  nickName: string;

  @Column({ name: "user_phone", type: "varchar", length: 15 })
  userPhoneNum: string;

  @Column({ name: "agree_yn", enum: YN, default: YN.NO })
  agreeYN: YN;

  @Column({ name: "push_yn", enum: YN, default: YN.YES })
  pushYN: YN;

  @Column({ name: "mkt_yn", enum: YN, default: YN.YES })
  mktYN: YN;

  @Column({ name: "user_type", enum: USER_TYPE, default: USER_TYPE.USER })
  userType: USER_TYPE;

  @Column({ name: "depositor", type: "varchar", length: 20 })
  depositor: string;

  @Column({ name: "bank", type: "varchar", length: 3 })
  bank: string;

  // 계좌 번호
  @Column({ name: "account_num", type: "varchar", length: 100 })
  accountNum: string;

  @Column({ name: "sms_yn", enum: YN, default: YN.YES })
  smsYN: YN;

  @Column({ name: "auth_yn", enum: YN })
  authYN: YN;

  @Column({ name: "leave_yn", enum: YN })
  leaveYN: YN;

  @Column({ name: "lounge_join_yn", enum: YN, default: YN.NO })
  loungeJoinYN: YN;

  @Column({ name: "del_yn", enum: DELETE_STATE, default: DELETE_STATE.NO })
  deleteState: DELETE_STATE;

  @Column({ name: "leave_type", type: "varchar", length: 3 })
  leaveType: string;

  @Column({ name: "leave_dt", type: "datetime" })
  leaveDate: Date;

  @Column({ name: "leave_contents", type: "mediumtext" })
  leaveContents: string;

  @Column({ name: "notice_dt", type: "datetime" })
  noticeDate: Date;

  @Column({ name: "reg_dt", type: "datetime" })
  registrationDate: Date;

  @Column({ name: "mod_dt", type: "datetime" })
  modifiedDate: Date;

  @Column({ name: "klip_yn", enum: YN })
  klipYN: YN;

  @Column({ name: "klip_wallet_address", type: "varchar", length: 250 })
  klipWalletAddress: string;

  // MBTI
  @Column({ name: "tendency", type: "varchar", length: 4 })
  tendency: string;

  @Column({ name: "push_token", type: "varchar", length: 150 })
  pushToken: string;

  @Column({ name: "birth", type: "varchar", length: 8 })
  birth: string;

  @Column({ name: "gender", enum: GENDER })
  gender: GENDER;

  @Column({ name: "profile", type: "varchar", length: 250 })
  profile: string;

  @Column({ name: "shop_nm", type: "varchar", length: 250 })
  shopName: string;

  @Column({ name: "shop_intro", type: "varchar", length: 250 })
  shopIntro: string;

  @Column({ name: "route", enum: REGISTRATION_ROUTE })
  registrationRoute: REGISTRATION_ROUTE;

  @Column({ name: "user_email", type: "varchar", length: 50 })
  email: string;

  @Column({
    name: "last_login_dt",
    type: "datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  lastLoginDate: Date;

  // 유입된 파트너몰 IDX
  @Column({
    name: "ref_platform_idx",
    type: "varchar",
    length: 50,
  })
  platformIdx: string;

  //유입된 파트너몰 사용자 IDX
  @Column({ name: "ref_user_idx", type: "varchar", length: 50 })
  userIdx: string;

  @OneToMany(() => Flex, (flex) => flex.registrant, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  flexList: Promise<Flex[]>;

  @OneToMany(() => Product, (product) => product.registrant, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  productList: Promise<Product[]>;

  @OneToMany(() => Nft, (nft) => nft.owner, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  nftList: Promise<Nft[]>;

  @OneToMany(() => UserWallet, (wallet) => wallet.owner, {
    createForeignKeyConstraints: false,
    eager: false,
  })
  walletList: Promise<UserWallet[]>;
}

@Entity({ name: "TB_USER_BLOCK" })
export class UserBlock {
  @PrimaryColumn({ name: "block_idx", type: "int" })
  id: string;

  @PrimaryColumn({ name: "user_idx", type: "int" })
  userId: string;

  @CreateDateColumn({ name: "reg_dt", type: "datetime" })
  registerDate: Date;
}

@Entity({ name: "TB_USER_WALLET" })
export class UserWallet {
  @PrimaryColumn({ name: "wallet_idx", type: "int" })
  idx: number;

  @Column({ name: "user_idx", type: "int", unsigned: true, nullable: false })
  ownerIdx: number;

  @Column({ name: "user_idx", type: "int" })
  owner: User;

  @Column({ name: "wallet_address", type: "varchar", length: 50 })
  walletAddress: string;

  @Column({ name: "pool_krn", type: "varchar", length: 100 })
  poolKrn: string;

  @Column({ name: "public_key", type: "varchar", length: 200 })
  publicKey: string;

  @Column({ name: "private_key_id", type: "varchar", length: 200 })
  privateKeyId: string;

  @Column({ name: "main_yn", type: "enum", enum: YN })
  mainYN: YN;

  @Column({
    name: "blockchain_platform",
    type: "enum",
    enum: BLOCKCHAIN_PLATFORM,
  })
  blockchainPlatform: BLOCKCHAIN_PLATFORM;

  @Column({ name: "reg_dt", type: "datetime" })
  registered: Date;

  @Column({ name: "mod_dt", type: "datetime" })
  modified: Date;
}

// @Entity({ name: "TB_USER_DELIVERY" })
// export class UserDelivery {

// }

// @Entity({ name: "TB_USER_PAYMENT" })
// export class UserPayment {}

// @Entity({ name: "TB_USER_RETURN" })
// export class UserReturn {}
