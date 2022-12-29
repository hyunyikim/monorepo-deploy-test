import {OrderDirectionType, GuaranteeStatus, ListRequestParam} from '@/@types';

export type NftCustomerListRequestSearchType = 'all' | 'name' | 'phone';
export type WalletLinkType = 'ALL' | 'LINKED' | 'NONE';
export type CustomerOrderByType =
	| 'NAME'
	| 'NO_OF_GUARANTEE'
	| 'LATEST_ISSUED'
	| 'TOTAL_PRICE';

export type NftCustomerGuaranteeStatus =
	| 'ALL'
	| 'READY'
	| 'CONFIRMED,COMPLETED'
	| 'CANCELED';
export type NftCustomerGuaranteeOrderByType = 'REQUESTED';

export interface NftCustomerListRequestParam {
	wallet: WalletLinkType;
	orderBy: CustomerOrderByType;
	orderDirection: OrderDirectionType;
}

export interface NftCustomerListResponse {
	list: NftCustomer[];
	totalNo: number;
}

export interface NftCustomer {
	customerName: string;
	phone: string;
	amount: number;
	latestIssuedAt: string;
	totalPrice: number;
	walletLinked: boolean;
}

export interface NftCustomerDetail extends NftCustomer {
	walletAddress: string;
}

export interface NftCustomerGuaranteeRequestParam
	extends Pick<ListRequestParam, 'currentPage' | 'pageMaxNum'> {
	status: NftCustomerGuaranteeStatus;
	orderBy: NftCustomerGuaranteeOrderByType;
	orderDirection: OrderDirectionType;
}

export interface NftCustomerGuaranteeListResponse {
	list: NftCustomerGuarantee[];
	totalNo: number;
}

export interface NftCustomerGuarantee {
	idx: number;
	serialNo: string;
	price: number;
	product: CustomerGuaranteeProduct;
	brand: CustomerBrand;
	status: GuaranteeStatus;
	requestedAt: string;
}

export interface CustomerGuaranteeProduct {
	idx: number;
	name: string;
	imagePath: string;
}

export interface CustomerBrand {
	idx: number;
	name: string;
	nameEN: string;
}
