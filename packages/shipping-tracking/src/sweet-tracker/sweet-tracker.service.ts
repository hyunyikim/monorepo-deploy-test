import {Injectable} from '@nestjs/common';
import Axios, {AxiosInstance} from 'axios';
import {join} from 'path';

/** 테바 */
export enum THEME {
	TROPICLA = 1,
	SKY,
	CYAN,
	PINK,
	GRAY,
}

/** 배송 진행 단계 */
export enum TrackingStep {
	/** 배송준비중 */
	READY = 1,
	/** 집하완료 */
	PICK_UP,
	/** 간선 배송중 */
	SHIPPING_TRUNK_LINE,
	/** 지점 경유중 */
	STOPOVER,
	/** 지선 배송중 */
	SHIPPING_BRANCH_LINE,
	/** 배송 완료 */
	COMPLETE,
}

export interface TrackingInfo {
	/** 죄회 결과 */
	result: 'Y' | 'N';
	/** 발송인 이름 */
	senderName: string;
	/** 수취인 이름 */
	receiverName: string;
	/** 상품 이름 */
	itemName: string;
	/** 운소장 번호 */
	invoiceNo: string;
	/** 배송지 주소 */
	receiverAddr: string;
	/** 주문 번호 */
	orderNumber: number | null;
	/** 택배사에서 광고용으로 사용하는 주소 */
	adUrl: string | null;
	/** 배송 예정 시간 */
	estimate: string | null;
	/** 진행단계 [level 1: 배송준비중, 2: 집화완료, 3: 배송중, 4: 지점 도착, 5: 배송출발, 6:배송 완료] */
	level: TrackingStep;
	/** 배송 완료 여부(true or false) */
	complete: boolean;
	/** 수취인 */
	recipient: string;
	/** 상품 이미지 */
	itemImage: string | null;
	/** 상품 정보 */
	productInfo: string | null;
	/** 우편 번호 */
	zipCode: string | null;
	/** 배송 완료 여부 (Y,N) */
	completeYN: 'Y' | 'N';

	firstDetail: TrackingDetail;

	lastDetail: TrackingDetail;

	trackingDetails: TrackingDetail[];
}

export interface TrackingDetail {
	/** 진행시간 (number) */
	time: number;
	/** 진행시간 (string) */
	timeString: string;
	/** 배송 상태 코드 */
	code: string | null;
	/** 현제 위치 */
	where: string;
	/** 진행 상태 */
	kind: string;
	/** 배송 지점 전화번호 */
	telno: string;
	/** 배송기사 전화번호 */
	telno2: string;
	/** 비고 */
	remark: string | null;
	/** 진행단계 */
	level: TrackingStep;
	/** 배송기사 이름 */
	manName: string;
	/** 배송기사 전화번호 */
	manPic: string;
}

export interface DeliveryCompanies {
	Company: DeliveryCompany[];
}

export interface DeliveryCompany {
	/** 회사 이름 */
	Name: string;
	/** 회사 코드 */
	Code: string;
}

@Injectable()
export class SweetTrackerService {
	private httpClient: AxiosInstance;
	readonly baseURL = 'http://info.sweettracker.co.kr';
	constructor(private apiKey: string) {
		this.httpClient = Axios.create({
			baseURL: this.baseURL,
		});
	}

	async getDeliveryCompanies() {
		const url = join('api/v1', 'companylist');

		const query = {
			t_key: this.apiKey,
		};
		const {data: companylist} =
			await this.httpClient.get<DeliveryCompanies>(url, {
				params: query,
			});
		return companylist;
	}

	async getRecommendCompanies(trackingNum: string) {
		const url = join('api/v1', 'recommend');
		const query = {
			t_key: this.apiKey,
			t_invoice: trackingNum,
		};
		const {data: companylist} =
			await this.httpClient.get<DeliveryCompanies>(url, {params: query});
		return companylist;
	}

	async getTrackingInfo(trackingNum: string, companyCode: string) {
		const url = join('api/v1', 'trackingInfo');
		const query = {
			t_key: this.apiKey,
			t_invoice: trackingNum,
			t_code: companyCode,
		};
		const {data: tarckingInfo} = await this.httpClient.get<TrackingInfo>(
			url,
			{
				params: query,
			}
		);
		return tarckingInfo;
	}

	async getTrackingInfoHTML(
		trackingNum: string,
		companyCode: string,
		theme: THEME = THEME.TROPICLA
	) {
		try {
			const url = join('tracking', String(theme));

			const params = new URLSearchParams();
			params.append('t_key', this.apiKey);
			params.append('t_invoice', trackingNum);
			params.append('t_code', companyCode);

			const {data: html} = await this.httpClient.post<string>(
				url,
				params,
				{
					headers: {
						Host: 'info.sweettracker.co.kr',
						Accept: 'text/html',
						Origin: 'http://info.sweettracker.co.kr',
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				}
			);
			return html;
		} catch (error) {
			console.log(error);
		}
	}
}
