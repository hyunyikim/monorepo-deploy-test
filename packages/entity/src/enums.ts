export enum YN {
	YES = 'Y',
	NO = 'N',
}

export enum DELETE_STATE {
	YES = 'Y',
	NO = 'N',
	TEMP = 'T',
}

export enum GENDER {
	MALE = 'M',
	FEMALE = 'F',
}

export enum BLOCKCHAIN_PLATFORM {
	KLAYTN_KLIP = 'klaytn-klip',
	KLAYTN_KAS = 'klaytn-kas',
}

export enum PRODUCT_LABEL {
	BLACK = 'B',
	WHITE = 'W',
	SILVER = 'S',
	GOLD = 'G',
}

export enum REGISTRATION_ROUTE {
	KAKAO = 'K',
	APPLE = 'A',
	ETC = 'E',
}

export enum USER_TYPE {
	USER = 'U',
	STORE = 'S',
	ADMIN = 'A',
}

export enum PRODUCT_QUALITY {
	NEW = 'N',
	S_PLUS = 'S+',
	S = 'S',
	A = 'A',
	B = 'B',
	C = 'C',
	D = 'D',
}

export enum NFC_TYPE {
	INTERNAL = 'I',
	EXTERNAL = 'O',
}

export enum PRODUCT_STATUS {
	'EMPTY_STATUS_1' = '1',
	'EMPTY_STATUS_2' = '2',
	'REGISTERED_DEFAULT' = '3',
	'REGISTERED_SELLING' = '4',
	'INSPECT_OR_REPAIR' = '5',
	'PROVED' = '6',
	'SOLD' = '7',
	'RECEIVED' = '8',
	'VGC_SENDED' = '9',
	'SCANNED' = '10',
}

export enum PRODUCT_PERIOD {
	ONE_YEAR_LESS = '1',
	THREE_YEAR_LESS = '3',
	FIVE_YEAR_LESS = '5',
	TEN_YEAR_LESS = '10',
}

export enum CURRENCY {
	KWR = 'KWR',
}

export enum PAYMENT_METHOD {
	CARD = 1,
	VIRTUAL_ACCOUNT,
	MOBILE_PHONE,
	TRANSFER,
	EASY_PAY,
}

export enum ORDER_STATUS {
	DONE = 1,
	CANCELED,
	WAITING_FOR_CANCEL,
	WAITING_FOR_DEPOSIT,
}

export enum CREDIT_EVENT {
	MINT = 1,
	RECHARGE,
	REFUND,
}

export enum NFT_REQ_TYPE {
	MINT = 'MINT',
	TRANSFER = 'TRANSFER',
	BURN = 'BURN',
}
