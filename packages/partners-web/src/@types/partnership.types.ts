import {YNType} from '@/@types';

export type B2BType = 'brand' | 'cooperator' | 'platform';
export interface PartnershipInfoResponse extends PartnershipViewMenuYN {
	idx: number;
	parentIdx: number;
	adminType: string;
	name: string;
	email: string;
	phoneNum: string;
	companyName: string;
	businessNum: string;
	businessPaperImage: string;
	b2bType: B2BType;
	corporationNum: string;
	zipcode: string;
	bizAddr1: string;
	bizAddr2: string;
	expireDate: string;
	payPlan: string;
	profileImage: string;
	authInfo: string;
	returnInfo: string | null;
	afterServiceInfo: string | null;
	customerCenterUrl: string | null;
	klipWalletAddress: string;
	leavedAt: string | null;
	isLeaved: YNType;
	authKey: string;
	mainYN: YNType;
	category: number[];
	viewFieldBrandName: YNType;
	viewFieldPrice: YNType;
	useFieldModelNum: YNType;
	useFieldMaterial: YNType;
	useFieldSize: YNType;
	useFieldWeight: YNType;
	nftCardName: string;
	nftGroupName: string;
	nftBackgroundImg: string;
	nftMaskingImg: string | null;
	nftBackgroundColor: string;
	nftLogoImg: string;
	nftCustomField: string;
	useNftLogo: YNType;
	useNftProdImage: YNType;
	useNftProdBox: YNType;
	useAlimTalk: YNType;
	nftProductImageX: string;
	nftProductImageY: string;
	nftProductImageW: number;
	nftProductImageH: number;
	nftProductBoxX: string;
	nftProductBoxY: string;
	nftProductBoxW: number;
	nftProductBoxH: number;
	useDirectMint: YNType;
	confirmed: YNType;
	useAlimtalkProfile: YNType;
	alimtalkPlusFriendId: string;
	alimtalkAdminTel: string;
	alimtalkSenderKey: string;
	confirmedAt: string;
	useAutoIncrementOrderNumber: YNType;
	excInspectorIdx: number;
	excRepairerIdx: number;
	warrantyDate: string;
	blockchainPlatform: string;
	lastLoggedIn: string;
	passwordChangedAt: string;
	brand: BrandType | null;
	nftCustomFields: string[] | [];
	/* FIXME: ServiceInterworkRepair.page.tsx에서 result 값때매 추가했는데, 왠지 수정해야할거 같은 느낌!! */
	result?: string;
}

export type BrandType = {
	detailImage?: string | null;
	englishName: string;
	idx: number;
	mainExposure?: YNType;
	mainImage?: string | null;
	name: string;
	registered?: string;
	registrantIdx?: string;
	summary?: string;
	useInspect?: YNType;
	useRepair?: YNType;
	viewExposure?: YNType;
};

export interface PartnershipViewMenuYN {
	useUnipass: YNType;
	useInspect: YNType;
	useRepair: YNType;
}
