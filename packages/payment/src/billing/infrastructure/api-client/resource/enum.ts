export enum ACQUIRE_STATUS {
	/** 매입 대기 */
	READY = 'READY',

	/** 매입 요청됨 */
	REQUESTED = 'REQUESTED',

	/** 매입 완료 */
	COMPLETED = 'COMPLETED',

	/** 매입 취소 요청됨 */
	CANCEL_REQUESTED = 'CANCEL_REQUESTED',

	/** 매입 취소 완료 */
	CANCELED = 'CANCELED',
}

export enum PayMethod {
	CARD = 'CARD',
	VIRTUAL_ACCOUNT = 'VIRTUAL_ACCOUNT',
	MOBILE_PHONE = 'MOBILE_PHONE',
	TRANSFER = 'TRANSFER',
	CULTURE_GIFT_CERTIFICATE = 'CULTURE_GIFT_CERTIFICATE',
	BOOK_GIFT_CERTIFICATE = 'BOOK_GIFT_CERTIFICATE',
	GAME_GIFT_CERTIFICATE = 'GAME_GIFT_CERTIFICATE',
}

export enum EasyPay {
	TOSSPAY = 'TOSSPAY',
	SAMSUNGPAY = 'SAMSUNGPAY',
	LPAY = 'LPAY',
	KAKAOPAY = 'KAKAOPAY',
	PAYCO = 'PAYCO',
	LGPAY = 'LGPAY',
	SSG = 'SSG',
}

export enum 해외_카드사_코드 {
	다이너스 = '다이너스',
	디스커버 = '디스커버',
	마스터 = '마스터',
	비자 = '비자',
	유니온페이 = '유니온페이',
	JDC = 'JDC',
}

export enum CARD_COMPANY_CODE {
	GWANGJUBANK = 'GWANGJUBANK',
	KOOKMIN = 'KOOKMIN',
	NONGHYEOP = 'NONGHYEOP',
	LOTTE = 'LOTTE',
	KDBBANK = 'KDBBANK',
	SAMSUNG = 'SAMSUNG',
	SAEMAUL = 'SAEMAUL',
	SUHYEOP = 'SUHYEOP',
	SHINHAN = 'SHINHAN',
	SHINHYEOP = 'SHINHYEOP',
	CITI = 'CITI',
	WOORI = 'WOORI',
	POST = 'POST',
	SAVINGBANK = 'SAVINGBANK',
	JEONBUKBANK = 'JEONBUKBANK',
	JEJUBANK = 'JEJUBANK',
	KAKAOBANK = 'KAKAOBANK',
	HANA = 'HANA',
	현대HYUNDAI카드 = 'HYUNDAI',
	BC = 'BC',
}

export enum BankCode {
	KYONGNAMBANK = 'KYONGNAMBANK',
	GWANGJUBANK = 'GWANGJUBANK',
	KOOKMIN = 'KOOKMIN',
	IBK = 'IBK',
	NONGHYEOP = 'NONGHYEOP',
	LOCALNONGHYEOP = 'LOCALNONGHYEOP',
	DAEGUBANK = 'DAEGUBANK',
	BUSANBANK = 'BUSANBANK',
	KDBBANK = 'KDBBANK',
	SAEMAUL = 'SAEMAUL',
	SANLIM = 'SANLIM',
	SUHYEOP = 'SUHYEOP',
	SHINHAN = 'SHINHAN',
	SHINHYEOP = 'SHINHYEOP',
	CITI = 'CITI',
	WOORI = 'WOORI',
	POST = 'POST',
	SAVINGBANK = 'SAVINGBANK',
	JEONBUKBANK = 'JEONBUKBANK',
	JEJUBANK = 'JEJUBANK',
	KAKAOBANK = 'KAKAOBANK',
	KBANK = 'KBANK',
	TOSSBANK = 'TOSSBANK',
	HANA = 'HANA',
	SC = 'SC',
	HSBC = 'HSBC',
}

export enum ACCOUNT_TYPE {
	NORMAL = 'NORMAL',
	FIXED = 'FIXED',
}

export enum CartType {
	CREDIT = 'CREDIT',
	CHECK = 'CHECK',
	GIFT = 'GIFT',
}

export enum CART_TYPE {
	CREDIT = 'CREDIT',
	CHECK = 'CHECK',
	GIFT = 'GIFT',
}

export enum OwnerType {
	PERSONAL = 'PERSONAL',
	CORPORATE = 'CORPORATE',
	UNKNOWN = 'UNKNOWN',
}

export enum PaymentType {
	NORMAL = 'NORMAL',
	BILLING = 'BILLING',
	BRANDPAY = 'BRANDPAY',
}

export enum REFUND_STATUS {
	/** 해당없음 */
	NONE = 'NONE',
	/** 환불실패 */
	FAILED = 'FAILED',
	/** 환불 처리중 */
	PENDING = 'PENDING',
	/** 부분 환불 실패 */
	PARTIAL_FAILED = 'PARTIAL_FAILED',
	/** 환불 여부 */
	COMPLETED = 'COMPLETED',
}

/**
 * 결제 처리 상태입니다. 아래와 같은 상태값을 가질 수 있습니다.
 */
export enum PAYMENT_STATUS {
	/** 준비됨 */
	READY = 'READY',
	/** 진행중 */
	IN_PROGRESS = 'IN_PROGRESS',
	/** 가상계좌 입금 대기 중 */
	WAITING_FOR_DEPOSIT = 'WAITING_FOR_DEPOSIT',
	/** 결제 완료됨 */
	DONE = 'DONE',
	/** 결제가 취소됨  */
	CANCELED = 'CANCELED',
	/** 결제가 부분 취소됨 */
	PARTIAL_CANCELED = 'PARTIAL_CANCELED',
	/** 카드 자동 결제 혹은 키인 결제를 할 때 결제 승인에 실패함  */
	ABORTED = 'ABORTED',
	/** 유효 시간(30분)이 지나 거래가 취소됨 */
	EXPIRED = 'EXPIRED',
	/** 실패 **/
	FAILED = 'FAILED',
}

export enum MOBILE_OPERATOR {
	KT = 'KT',
	LGU = 'LGU',
	SKT = 'SKT',
	HELLO = 'HELLO',
	KCT = 'KCT',
	SK7 = 'SK7',
}

export enum EMAIL_TEMPLATE {
	COMPLETE_PAYMENT = 'COMPLETE_PAYMENT',
	CANCEL_PAYMENT = 'CANCEL_PAYMENT',
	FAIL_PAYMENT = 'FAIL_PAYMENT',
}

export enum PLAN_TYPE {
	YEAR = 'YEAR',
	MONTH = 'MONTH',
	INFINITE = 'INFINITE',
	CUSTOM = 'CUSTOM',
}

export const getCardCompany = (code: string) => {
	return (
		{
			'3K': '기업 BC',
			'46': '광주은행',
			'71': '롯데카드',
			'30': 'KDB산업은행',
			'31': 'BC카드',
			'51': '삼성카드',
			'38': '새마을금고',
			'41': '신한카드',
			'62': '신협',
			'36': '씨티카드',
			'33': '우리BC카드(BC 매입)',
			W1: '우리카드(우리 매입)',
			'37': '우체국예금보험',
			'39': '저축은행중앙회',
			'35': '전북은행',
			'42': '제주은행',
			'15': '카카오뱅크',
			'3': '케이뱅크',
			'24': '토스뱅크',
			'21': '하나카드',
			'61': '현대카드',
			'11': 'KB국민카드',
			'91': 'NH농협카드',
			'34': 'Sh수협은행',
			'6D': '다이너스 클럽',
			'6I': '디스커버',
			'4M': '마스터카드',
			'3C': '유니온페이',
			'7A': '아메리칸 익스프레스',
			'4J': 'JCB',
			'4V': 'VISA',
		}[code] || ''
	);
};
