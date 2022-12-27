import {GuaranteeDetail} from '@/@types';

export type RepairStatus = 'ready' | 'request' | 'complete' | 'cancel';
export interface RepairListRequestParam {
	status: RepairStatus | '';
}

export type RepairListRequestSearchType =
	| 'all'
	| 'productName'
	| 'repairNum'
	| 'userName'
	| 'userPhone';

export interface RepairSummary {
	idx: number;
	repairNum: string;
	repairStatus: string;
	repairStatusCode: RepairStatus;
	productName: string;
	brandName: string;
	brandNameEn: string;
	ordererName: string;
	ordererTel: string;
	registeredAt: string;
}
export interface RepairDetail extends RepairSummary {
	requestMessage: string;
	completedAt: string | null;
	canceledAt: string | null;
	images: string[];
	nft: GuaranteeDetail;
	history: {
		repairStatus: string;
		repairStatusCode: string;
		registeredAt: string;
	}[];
}
