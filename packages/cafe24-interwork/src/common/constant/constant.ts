export enum CAFE24_ORDER_STATUS {
	'N00' = 'N00', // 입금전
	'N10' = 'N10', // 상품준비중
	'N20' = 'N20', // 배송준비중
	'N21' = 'N21', // 배송대기
	'N22' = 'N22', // 배송보류
	'N30' = 'N30', // 배송중
	'DELIVERED' = 'N40', // 배송완료
	'CONFIRMED' = 'N50', // 구매확정
	'N50' = 'N50', // 구매확정
	'C00' = 'C00', // 취소신청
	'C10' = 'C10', // 취소접수 - 관리자
	'C34' = 'C34', // 취소처리중 - 환불전
	'C36' = 'C36', // 취소처리중 - 환불보류
	'C40' = 'C40', // 취소완료
	'C47' = 'C47', // 입금전취소 - 구매자
	'C48' = 'C48', // 입금전취소 - 자동취소
	'C49' = 'C49', // 입금전취소 - 관리자
	'R00' = 'R00', // 반품신청
	'R10' = 'R10', // 반품접수
	'R12' = 'R12', // 반품보류
	'R13' = 'R13', // 반품접수 - 수거완료(자동)
	'R30' = 'R30', // 반품처리중 - 수거전
	'R34' = 'R34', // 반품처리중 - 환불전
	'R36' = 'R36', // 반품처리중 - 환불보류
	'REFUNDED' = 'R40', // 반품완료 - 환불완료
	'E00' = 'E00', // 교환신청
	'E10' = 'E10', // 교환접수
	'N01' = 'N01', // 교환접수 - 교환상품
	'E12' = 'E12', // 교환보류
	'E13' = 'E13', // 교환접수 - 수거완료(자동)
	'E20' = 'E20', // 교환준비
	'E30' = 'E30', // 교환처리중 - 수거전
	'E32' = 'E32', // 교환처리중 - 입금전
	'E34' = 'E34', // 교환처리중 - 환불전
	'E36' = 'E36', // 교환처리중 - 환불보류
	'EXCHANGED' = 'E40', // 교환완료
}

/**
 * TODO:
 * 액션이 어떤 역할인지 의미가 모호함.
 * 다른 곳에서 쓰이지 않는다면 네이밍 또는 접근 방식에 대한 개선이 필요해보임
 */
export enum WEBHOOK_ACTION {
	'ISSUE' = 'issue',
	'CANCEL' = 'cancel',
	'PASS' = 'pass',
	'REISSUE' = 'reissue',
}

export const orderStatus2Action = (
	order: CAFE24_ORDER_STATUS,
	isIssued: boolean
) => {
	switch (order) {
		case CAFE24_ORDER_STATUS.DELIVERED:
		case CAFE24_ORDER_STATUS.CONFIRMED:
			return isIssued ? WEBHOOK_ACTION.PASS : WEBHOOK_ACTION.ISSUE;
		case CAFE24_ORDER_STATUS.REFUNDED:
			return WEBHOOK_ACTION.CANCEL;
		case CAFE24_ORDER_STATUS.EXCHANGED:
			return isIssued ? WEBHOOK_ACTION.REISSUE : WEBHOOK_ACTION.ISSUE;
		default:
			return WEBHOOK_ACTION.PASS;
	}
};

export enum INTERWORK_STATUS {
	OK = 'OK',
	FAIL = 'FAIL',
	LINKED_OTHER_PARTNERS = 'LINKED_OTHER_PARTNERS',
}
