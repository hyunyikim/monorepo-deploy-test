// api v1 버전에 맞춰진 타입
import {GuaranteeRequestState} from '@/@types';

export enum BLOCKCHAIN_PLATFORM {
	KLAYTN_KLIP = 'klaytn-klip',
	KLAYTN_KAS = 'klaytn-kas',
}

export interface GuaranteeSummary {
	idx: number;
	nftNumber: string;
	nftStatus: string;
	nftStatusCode: GuaranteeRequestState;
	productName: string;
	brandName: string;
	brandNameEn: string;
	ordererName: string;
	ordererTel: string;
	platformName: string;
	registeredAt: string;
}

export interface GuaranteeDetail extends GuaranteeSummary {
	modelNumber: string;
	material: string;
	size: string;
	weight: string;
	price: number;
	warrantyDate: string;
	orderNumber: string;
	issuerName: string;
	issuerInfo: string;
	partnersProductIdx: number;
	tokenId: string;
	externalLink: string;
	transactionHash: string;
	blockchainPlatform: BLOCKCHAIN_PLATFORM;
	nftCardImg: string;
	customField: Record<string, string> | null;
	productImages: string[];
	appliedAt: string | null;
	orderedAt: string | null;
	issuedAt: string | null;
	modifiedAt: string | null;
	remindedAt: string | null;
}

export interface Platform {
	platformIdx: number;
	platformName: string;
}
