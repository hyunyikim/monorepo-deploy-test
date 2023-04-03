export type GuaranteeStatus = 'READY' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';

export type GuaranteeRequestState = '1' | '2' | '3' | '4' | '9';

export enum BLOCKCHAIN_PLATFORM {
	KLAYTN_KLIP = 'klaytn-klip',
	KLAYTN_KAS = 'klaytn-kas',
}

export type GuaranteeListRequestSearchType =
	| 'all'
	| 'nftNumber'
	| 'name'
	| 'ordererName';

export type GroupingGuaranteeListStatus =
	| ''
	| 'ready'
	| 'pending,complete'
	| 'cancel';

export interface GuaranteeListRequestParam {
	nftStatus: GroupingGuaranteeListStatus;
	storeIdx: number | '';
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
	storeName: string;
	registeredAt: string;
}

export interface GuaranteeDetail extends GuaranteeSummary {
	brandIdx: number;
	categoryCode: string;
	categoryName: string;
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
	storeIdx: number | null;
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

export type RegisterGuaranteeStatusType = 'ready' | 'request'; // ready: 임시저장, request:발급신청

export type RegisterGuaranteeRequestRouteType =
	| 'vircle' // 파트너스에서 발급시
	| 'api'
	| 'cafe24'
	| 'naver';

export interface RegisterGuaranteeRequest {
	idx?: number;
	nftStatus: RegisterGuaranteeStatusType;
	ordererName: string;
	ordererTel: string; // 010-0000-0000

	// 옵셔널 필드
	orderedAt?: string; // 2023-01-13
	storeName?: string; // 판매처		// storeName or storeIdx
	storeIdx?: number | ''; // 판매처
	refOrderId?: string; // 주문번호
	requestRoute?: RegisterGuaranteeRequestRouteType;
}

// 개런티 입력시 함께 입력하는 상품 정보
export interface RegisterGuaranteeProductRequest {
	brandIdx: number | '';
	productName?: string; // productName, productImage or partnersProductIdx
	productImage?: string;
	productImages?: string[];
	partnersProductIdx?: number | '';
	warrantyDate: string;
	price?: string;
	customField?: Record<string, string>;
	categoryCode?: string; // 병행업체일 경우, 반드시 필요
	modelNumber?: string;
	material?: string;
	size?: string;
	weight?: string;
}

// 최종 요청 데이터
export interface RegisterGuaranteeRequestFormData
	extends RegisterGuaranteeRequest,
		RegisterGuaranteeProductRequest {}

export type RegisterGuaranteeRequestExcelFormData = Omit<
	RegisterGuaranteeRequestFormData,
	'nftStatus'
>;
