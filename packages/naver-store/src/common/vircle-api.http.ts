import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Axios, { AxiosHeaders, AxiosInstance, CreateAxiosDefaults } from "axios";
import FormData from "form-data";
import { Nft } from "@vircle/entity";

import { PRODUCT_CATEGORY } from "src/common/enums/product-category.enum";
import { NFT_REQUEST_ROUTE } from "src/common/enums/nft-req-route.enum";

@Injectable()
export class VircleApiHttpService {
  private httpAgent: AxiosInstance;
  constructor(private config: ConfigService) {
    this.httpAgent = Axios.create(
      config.getOrThrow<CreateAxiosDefaults>("vircle-api.http")
    );
  }

  async cancelGuarantee(token: string, reqIdx: string) {
    const { data } = await this.httpAgent.put<Nft>(
      "/admin/nft/cancel",
      {
        nft_req_idx: reqIdx,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          token,
        },
      }
    );
    Logger.log("vircle api cancel guarantee success");
    return data;
  }

  async getPartnerInfo(token: string) {
    const { data } = await this.httpAgent.get<Partnership>(
      "/v1/admin/partnerships",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  }

  async requestGuarantee(token: string, payload: ReqGuaranteePayload) {
    const {
      image,
      category,
      brandIdx,
      productName,
      modelNum,
      material,
      size,
      weight,
      price,
      warranty,
      platformName,
      orderedAt,
      orderId,
      ordererName,
      ordererTel,
      nftState,
    } = payload;
    const form = new FormData();

    image && form.append("product_img", image);
    category && form.append("cate_cd", category);
    brandIdx && form.append("brand_idx", brandIdx);
    productName && form.append("pro_nm", productName);
    modelNum && form.append("model_num", modelNum);
    material && form.append("material", material);
    size && form.append("size", size);
    weight && form.append("weight", weight);
    if (price !== undefined) form.append("price", price);
    warranty && form.append("warranty_dt", warranty);
    platformName && form.append("platform_nm", platformName);
    orderedAt && form.append("order_dt", orderedAt);
    orderId && form.append("ref_order_id", orderId);
    ordererName && form.append("orderer_nm", ordererName);
    ordererTel && form.append("orderer_tel", ordererTel);
    nftState && form.append("nft_req_state", nftState);
    form.append("request_route", NFT_REQUEST_ROUTE.NAVER);

    const { data } = await this.httpAgent.post<{
      data: {
        nft_req_idx: number;
        nft_req_state: number;
      };
    }>("/admin/nft", form, {
      headers: {
        Authorization: `Bearer ${token}`,
        ...form.getHeaders(),
        token,
      } as unknown as AxiosHeaders,
    });
    return data.data;
  }
}

export class Partnership {
  idx: number;
  parentIdx: number;
  adminType: string;
  name: string;
  email: string;
  phoneNum: string;
  companyName: string;
  businessNum: string;
  businessPaperImage: string | null;
  b2bType: "brand";
  corporationNum: null;
  zipcode: null;
  bizAddr1: null;
  bizAddr2: null;
  expireDate: null;
  payPlan: null;
  profileImage: null;
  authInfo: "Auth ....... Info";
  klipWalletAddress: null;
  leaved: null;
  authKey: null;
  mainYN: "N";
  category: number[];
  useUnipass: "N";
  useInspect: "Y";
  useRepair: "Y";
  viewFieldBrandName: "Y";
  viewFieldPrice: "Y";
  useFieldModelNum: "Y";
  useFieldMaterial: "N";
  useFieldSize: "N";
  useFieldWeight: "Y";
  nftCardName: "디지털 보증서";
  nftGroupName: null;
  nftBackgroundImg: null;
  nftBackgroundColor: null;
  nftLogoImg: null;
  nftCustomField: null;
  useNftLogo: "Y";
  useNftProdImage: "Y";
  useAlimTalk: "Y";
  nftProductionImgX: "50%";
  nftProductionImgY: "50%";
  nftProductionImgW: 700;
  nftProductionImgH: 700;
  useDirectMint: "Y";
  excInspectorIdx: null;
  excRepairerIdx: null;
  warrantyDate: "구입일로부터 n";
  blockchainPlatform: "klaytn-kas";
  brand: {
    idx: number;
    name: string;
    englishName: string;
    summary: string;
    mainImage: string | null;
    detailImage: string | null;
    viewExposure: "Y" | "N";
    mainExposure: "Y" | "N";
    useInspect: "Y" | "N";
    useRepair: "Y" | "N";
  } | null;
}

export class ReqGuaranteePayload {
  image: string;
  category: string;
  brandIdx?: number;
  productName: string;
  modelNum?: string;
  material?: string;
  size?: string;
  weight?: string;
  price: number;
  warranty: string;
  platformName: string;
  orderedAt: string;
  orderId: string;
  ordererName: string;
  ordererTel: string;
  nftState: NFT_STATUS;
}

export enum NFT_STATUS {
  READY = "1",
  REQUESTED = "2",
  CONFIRMED = "3",
  COMPLETED = "4",
  WAITING_SEND = "5",
  WAITING_RECEIVE = "6",
  CANCELED = "9",
}
