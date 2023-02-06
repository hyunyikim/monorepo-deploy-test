import {AxiosInstance} from 'axios';
import {join} from 'path';
import {Resource} from './resource';
import {
	Billing,
	Payment,
	RequestBillingApproveBody,
	RequestBillingAuthByCustomerKey,
} from './type';

export class BillingResource implements Resource {
	readonly path = 'billing';
	constructor(private httpClient: AxiosInstance) {}

	get authorizations() {
		return {
			customerKey: this.requestBillingKeyByCustomerKey.bind(this),
			authKey: this.requestBillingKeyByAuthKey.bind(this),
		};
	}

	/**
	 * 고객을 특정하는 customerKey와 연결할 빌링키 발급을 요청합니다.
	 *
	 * [에러코드]
	 *    - 400 INVALID_CARD_NUMBER: 카드번호를 다시 확인해주세요.
	 *    - 400 NOT_SUPPORTED_CARD_TYPE: 지원되지 않는 카드 종류입니다.
	 *    - 400 INVALID_CARD_PASSWORD: 카드 정보를 다시 확인해주세요. (비밀번호)
	 *    - 400 INVALID_CARD_EXPIRATION: 카드 정보를 다시 확인해주세요. (유효기간)
	 *    - 400 INVALID_CARD_IDENTITY: 입력하신 주민번호/사업자번호가 카드 소유주 정보와 일치하지 않습니다.
	 *    - 400 INVALID_REJECT_CARD: 카드 사용이 거절되었습니다. 카드사 문의가 필요합니다.
	 *    - 400 INVALID_STOPPED_CARD: 정지된 카드 입니다.
	 *    - 400 INVALID_BIRTH_DAY_FORMAT: 생년월일 정보는 6자리의 `yyMMdd` 형식이어야 합니다. 사업자등록번호는 10자리의 숫자여야 합니다.
	 *    - 400 NOT_REGISTERED_CARD_COMPANY: 카드를 사용 등록 후 이용해주세요.
	 *    - 400 INVALID_EMAIL: 유효하지 않은 이메일 주소 형식입니다.
	 *    - 400 NOT_SUPPORTED_METHOD: 지원되지 않는 결제 수단입니다.
	 *    - 400 INVALID_REQUEST: 잘못된 요청입니다.
	 *    - 403 EXCEED_MAX_AUTH_COUNT: 최대 인증 횟수를 초과했습니다. 카드사로 문의해주세요.
	 *    - 403 REJECT_CARD_COMPANY: 결제 승인이 거절되었습니다.
	 *    - 403 REJECT_ACCOUNT_PAYMENT: 잔액부족으로 결제에 실패했습니다.
	 *    - 500	COMMON_ERROR: 일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
	 *
	 * @param paymentKey 결제 건에 대한 고유한 키값입니다.
	 * {@link https://docs.tosspayments.com/reference#customerkey%EB%A1%9C-%EC%B9%B4%EB%93%9C-%EC%9E%90%EB%8F%99-%EA%B2%B0%EC%A0%9C-%EB%B9%8C%EB%A7%81%ED%82%A4-%EB%B0%9C%EA%B8%89-%EC%9A%94%EC%B2%AD}
	 * @param body Request Body Parameters
	 * @returns customerKey로 카드 자동 결제 요청에 성공했다면 Billing 객체가 돌아옵니다.
	 */
	private async requestBillingKeyByCustomerKey(
		body: RequestBillingAuthByCustomerKey
	) {
		const url = join(this.path, 'authorizations', 'card');
		const {data: billing} = await this.httpClient.post<Billing>(url, body);

		return billing;
	}

	/**
	 * requestBillingAuth 호출 후 쿼리 파라미터로 돌아오는 authKey로 빌링키 발급을 요청합니다.
	 * {@link https://docs.tosspayments.com/reference#authkey%EB%A1%9C-%EC%B9%B4%EB%93%9C-%EC%9E%90%EB%8F%99-%EA%B2%B0%EC%A0%9C-%EB%B9%8C%EB%A7%81%ED%82%A4-%EB%B0%9C%EA%B8%89-%EC%9A%94%EC%B2%AD}
	 * @param authKey 자동 결제 등록창 호출이 성공하면 리다이렉트 URL에 쿼리 파라미터(Query Parameter)로 포함되어 돌아오는 인증 키 값입니다.
	 * @param customerKey 상점에서 고객을 구분하기 위해 발급한 고객의 고유 ID입니다. 이 값에 빌링키가 연결됩니다. 영문 대소문자, 숫자, 특수문자 -, _, =, ., @ 로 최소 2자 이상 최대 255자 이하여야 합니다.
	 * @returns authKey로 카드 자동 결제 빌링키 발급 요청에 성공했다면 Billing 객체가 돌아옵니다.
	 */
	private async requestBillingKeyByAuthKey(
		authKey: string,
		customerKey: string
	) {
		const url = join(this.path, 'authorizations', 'issue');
		const {data: billing} = await this.httpClient.post<Billing>(url, {
			authKey,
			customerKey,
		});

		return billing;
	}

	/**
	 * 발급받은 billingKey로 카드 자동 결제 승인을 요청합니다.
	 *
	 * [에러코드]
	 *    - 400 INVALID_STOPPED_CARD: 정지된 카드 입니다.
	 *    - 400 INVALID_REJECT_CARD: 카드 사용이 거절되었습니다. 카드사 문의가 필요합니다.
	 *    - 400 INVALID_CARD_EXPIRATION: 카드 정보를 다시 확인해주세요. (유효기간)
	 *    - 400 INVALID_CARD_NUMBER: 카드번호를 다시 확인해주세요.
	 *    - 400 INVALID_BILL_KEY_REQUEST: 빌링키 인증이 완료되지 않았거나 유효하지 않은 빌링 거래 건입니다.
	 *    - 400 NOT_SUPPORTED_CARD_TYPE: 지원되지 않는 카드 종류입니다.
	 *    - 400 DUPLICATED_ORDER_ID: 이미 승인 및 취소가 진행된 중복된 주문번호 입니다. 다른 주문번호로
	 *    - 400 NOT_SUPPORTED_INSTALLMENT_PLAN_CARD_OR_MERCHANT: 할부가 지원되지 않는 카드 또는 가맹점 입니다.
	 *    - 400 INVALID_CARD_INSTALLMENT_PLAN: 할부 개월 정보가 잘못되었습니다.
	 *    - 400 NOT_MATCHES_CUSTOMER_KEY: 빌링 인증 고객키와 결제 요청 고객키가 일치하지 않습니다.
	 *    - 400 INVALID_REQUEST: 잘못된 요청입니다.
	 *    - 400 BELOW_MINIMUM_AMOUNT: 신용카드는 결제금액이 100원 이상, 계좌는 200원이상부터 결제가 가능합니다.
	 *    - 400 NOT_REGISTERED_CARD_COMPANY: 카드를 사용 등록 후 이용해주세요.
	 *    - 400 NOT_SUPPORTED_MONTHLY_INSTALLMENT_PLAN: 할부가 지원되지 않는 카드입니다.
	 *    - 400 UNAUTHORIZED_KEY: 인증되지 않은 시크릿 키 혹은 클라이언트 키 입니다.
	 *    - 401 REJECT_CARD_PAYMENT: 한도초과 혹은 잔액부족으로 결제에 실패했습니다.
	 *    - 403 REJECT_ACCOUNT_PAYMENT: 잔액부족으로 결제에 실패했습니다.
	 *    - 403 REJECT_CARD_COMPANY: 결제 승인이 거절되었습니다.
	 *    - 403 EXCEED_MAX_AUTH_COUNT: 최대 인증 횟수를 초과했습니다. 카드사로 문의해주세요.
	 *    - 500 FAILED_INTERNAL_SYSTEM_PROCESSING: 내부 시스템 처리 작업이 실패했습니다. 잠시 후 다시 시도해주세요.
	 *    - 500 FAILED_DB_PROCESSING: 잘못된 요청 값으로 처리 중 DB 에러가 발생했습니다.
	 *    - 500 FAILED_CARD_COMPANY_RESPONSE: 카드사에서 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.
	 *
	 * {@link https://docs.tosspayments.com/reference#%EC%B9%B4%EB%93%9C-%EC%9E%90%EB%8F%99-%EA%B2%B0%EC%A0%9C-%EC%8A%B9%EC%9D%B8-%EC%9A%94%EC%B2%AD}
	 * @param billingKey 발급된 빌링키 정보입니다. 고객의 결제 정보로 사용됩니다.
	 * @param body Request Body 파라미터
	 */
	async requestApprove(billingKey: string, body: RequestBillingApproveBody) {
		const url = join(this.path, billingKey);
		const {data: payment} = await this.httpClient.post<Payment>(url, {
			...body,
		});

		return payment;
	}
}
