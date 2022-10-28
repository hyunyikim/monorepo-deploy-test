import {Exclude, Type} from 'class-transformer';
import {
	IsArray,
	IsBoolean,
	IsDateString,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import {AccessToken, Category, Store} from '../cafe24Api';

export type IssueTiming = 'AFTER_SHIPPING' | 'AFTER_DELIVERED';

export interface IssueCategory {
	idx: number;
	depth: number;
	name: string;
	fullName: string[];
	fullNo: number[];
}
export class IssueSetting {
	@IsBoolean()
	manually: boolean;

	@IsString()
	issueTiming: IssueTiming;

	@IsBoolean()
	issueAll: boolean;

	@IsArray()
	issueCategories: IssueCategory[];

	@IsBoolean()
	issueIntro?: boolean = true;
}

export class Cafe24Interwork {
	@IsNumber()
	partnerIdx: number;

	@IsString()
	mallId: string;

	/** 최근 사용된 Auth Code */
	@Exclude({toPlainOnly: true})
	@IsString()
	authCode: string;

	@IsObject()
	partnerInfo?: Partnership;

	@Exclude({toPlainOnly: true})
	@IsObject()
	@ValidateNested()
	@Type(() => AccessToken)
	accessToken: AccessToken;

	@IsObject()
	@ValidateNested()
	@Type(() => Store)
	store: Store;

	@IsObject()
	@ValidateNested()
	@Type(() => IssueSetting)
	issueSetting: IssueSetting;

	@IsDateString()
	joinedAt: string;

	@IsDateString()
	confirmedAt?: string;

	@Exclude({toPlainOnly: true})
	@IsString()
	coreApiToken?: string;

	@IsDateString()
	updatedAt: string;

	@Exclude({toPlainOnly: true})
	@IsOptional()
	@IsDateString()
	leavedAt?: string;

	@Exclude({toPlainOnly: true})
	@IsOptional()
	@IsString()
	reasonForLeave?: string;
}

export interface Partnership {
	idx: number;
	parentIdx: number;
	adminType: string;
	name: string;
	email: string;
	phoneNum: string;
	companyName: string;
	businessNum: string;
	businessPaperImage: string | null;
	b2bType: 'brand';
	corporationNum: null;
	zipcode: null;
	bizAddr1: null;
	bizAddr2: null;
	expireDate: null;
	payPlan: null;
	profileImage: null;
	authInfo: 'Auth ....... Info';
	klipWalletAddress: null;
	leaved: null;
	authKey: null;
	mainYN: 'N';
	category: number[];
	useUnipass: 'N';
	useInspect: 'Y';
	useRepair: 'Y';
	viewFieldBrandName: 'Y';
	viewFieldPrice: 'Y';
	useFieldModelNum: 'Y';
	useFieldMaterial: 'N';
	useFieldSize: 'N';
	useFieldWeight: 'Y';
	nftCardName: '디지털 보증서';
	nftGroupName: null;
	nftBackgroundImg: null;
	nftBackgroundColor: null;
	nftLogoImg: null;
	nftCustomField: null;
	useNftLogo: 'Y';
	useNftProdImage: 'Y';
	useAlimTalk: 'Y';
	nftProductionImgX: '50%';
	nftProductionImgY: '50%';
	nftProductionImgW: 700;
	nftProductionImgH: 700;
	useDirectMint: 'Y';
	excInspectorIdx: null;
	excRepairerIdx: null;
	warrantyDate: '구입일로부터 n';
	blockchainPlatform: 'klaytn-kas';
	brand: {
		idx: number;
		name: string;
		englishName: string;
		summary: string;
		mainImage: string | null;
		detailImage: string | null;
		viewExposure: 'Y' | 'N';
		mainExposure: 'Y' | 'N';
		useInspect: 'Y' | 'N';
		useRepair: 'Y' | 'N';
	} | null;
}
