import {HttpStatus} from '@nestjs/common';

enum eErrorCode {
	NO_CONFIG_PATH = -1001,
	GET_CONFIG_FAILED = -1002,

	NO_AUTH_FOR_CORE_API = 401,
	NO_AUTH_TOKEN = 401,
	CAN_NOT_ACCESS_TOKEN = 403,
	INTERNAL_SERVER_ERROR = 500, // TODO: 추후 제거

	// interwork 1001 - 1100
	NOT_FOUND_INTERWORK_INFO = 1001,
	NOT_COMPLETE_INTERWORK = 1002,
	CANCELED_INTERWORK = 1003,

	NOT_FOUND_GUARANTEE_REQUEST = 1011,

	// webhook 1101 - 1200
	NOT_DEFAULT_SHOP_NO = 1101,
	NO_GUARANTEE_FOR_CANCEL = 1102,

	// cafe24 api 1201 - 1300
	NOT_FOUND_ORDER_IN_CAFE24 = 1101,
	NOT_FOUND_PRODUCT_IN_CAFE24 = 1102,
}

export const ErrorMetadata = {
	noConfigFile: (path: string) => ({
		name: 'NO_CONFIG_PATH',
		message: 'config 파일이 없습니다.',
		code: eErrorCode.NO_CONFIG_PATH,
		description: 'yaml파일이 있어야됨',
		status: HttpStatus.OK,
		options: {
			filePath: path,
		},
	}),
	getConfigFailed: (httpTarget: string) => ({
		name: 'GET_CONFIG_FAILED',
		message: `${httpTarget} config 파일 로드 실패.`,
		code: eErrorCode.GET_CONFIG_FAILED,
		description: 'config 파일이 정확한지 확인해보세요.',
		status: HttpStatus.OK,
		options: {
			filePath: (path: string) => path,
		},
	}),
	internalServerError: (message: string) => ({
		name: 'INTERNAL_SERVER_ERROR',
		message,
		code: eErrorCode.INTERNAL_SERVER_ERROR,
		description: message,
		status: HttpStatus.INTERNAL_SERVER_ERROR,
	}),
	noAuthForCoreApi: {
		name: 'NO_AUTH_FOR_CORE_API',
		message: 'coreApiToken 없음',
		code: eErrorCode.NO_AUTH_FOR_CORE_API,
		description: 'coreApiToken 값을 확인해주세요.',
		status: HttpStatus.UNAUTHORIZED,
	},
	noAuthToken: {
		name: 'NO_AUTH_TOKEN',
		message: 'token이 없거나 잘못됨',
		code: eErrorCode.NO_AUTH_TOKEN,
		description: 'token을 확인해주세요.',
		status: HttpStatus.UNAUTHORIZED,
	},
	canNotAccessToken: {
		name: 'CAN_NOT_ACCESS_TOKEN',
		message: '해당 토큰으로 접근할 수 없음',
		code: eErrorCode.CAN_NOT_ACCESS_TOKEN,
		description: '잘못된 토큰 값입니다.',
		status: HttpStatus.UNAUTHORIZED,
	},
	notFoundInterworkInfo: {
		name: 'NOT_FOUND_INTERWORK_INFO',
		message: '카페24 연동 정보 없음',
		code: eErrorCode.NOT_FOUND_INTERWORK_INFO,
		description: '카페24 연동 정보를 찾을 수 없습니다.',
		status: HttpStatus.NOT_FOUND,
	},
	notCompleteInterwork: {
		name: 'NOT_COMPLETE_INTERWORK',
		message: '카페24 연동 미완료',
		code: eErrorCode.NOT_COMPLETE_INTERWORK,
		description: '카페24 연동 작업이 완료되지 않았습니다.',
		status: HttpStatus.NOT_FOUND,
	},
	canceledInterwork: {
		name: 'CANCELED_INTERWORK',
		message: '카페24 연동 해제됨',
		code: eErrorCode.CANCELED_INTERWORK,
		description: '해당 몰의 연동이 해제되었습니다.',
		status: HttpStatus.NOT_FOUND,
	},
	notDefaultShopNo: {
		name: 'NOT_DEFAULT_SHOP_NO',
		message: '기본 멀티몰이 아님',
		code: eErrorCode.NOT_DEFAULT_SHOP_NO,
		description: '기본 멀티몰의 주문번호가 아닙니다.',
		status: HttpStatus.OK,
	},
	notFoundOrderInCafe24: {
		name: 'NOT_FOUND_ORDER_IN_CAFE24',
		message: '주문 정보를 찾을 수 없음',
		code: eErrorCode.NOT_FOUND_ORDER_IN_CAFE24,
		description: 'Cafe24에 일치하는 주문 정보가 없습니다.',
		status: HttpStatus.OK,
	},
	notFoundProductInCafe24: {
		name: 'NOT_FOUND_PRODUCT_IN_CAFE24',
		message: '상품 정보를 찾을 수 없음',
		code: eErrorCode.NOT_FOUND_PRODUCT_IN_CAFE24,
		description: 'Cafe24에 일치하는 상품 정보가 없습니다.',
		status: HttpStatus.OK,
	},
	noGuaranteeForCancel: {
		name: 'NO_GUARANTEE_FOR_CANCEL',
		message: '개런티 정보 없음',
		code: eErrorCode.NO_GUARANTEE_FOR_CANCEL,
		description: '취소 대상 개런티가 존재하지 않습니다.',
		status: HttpStatus.OK,
	},
	notFoundGuaranteeRequest: {
		name: 'NOT_FOUND_GUARANTEE_REQUEST',
		message: '개런티 요청 정보 없음',
		code: eErrorCode.NOT_FOUND_GUARANTEE_REQUEST,
		description: '개런티 요청 정보가 존재하지 않습니다.',
		status: HttpStatus.OK,
	},

	anythingElse: (
		desc: string,
		status: number,
		options: Record<string, any>
	) => ({
		name: 'anythingElse',
		message: `anythingElse`,
		code: -2000,
		description: desc,
		status: status,
		options: options,
	}),
} as const;
