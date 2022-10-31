import {YNType} from '@/@types';

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
	b2bType: string;
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
	leaved: string | null;
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
	useAutoIncrementOrderNumber: YNType;
	excInspectorIdx: number;
	excRepairerIdx: number;
	warrantyDate: string;
	blockchainPlatform: string;
	brand: string | null;
}

export interface PartnershipViewMenuYN {
	useUnipass: YNType;
	useInspect: YNType;
	useRepair: YNType;
}
