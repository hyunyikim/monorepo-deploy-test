import {Axios} from 'axios';

interface DeliveryCompany {
	Name: string;
	Code: string;
}

interface TrackingDetail {
	time: number;
	timeString: string; // ex)'2022-06-08 12:31:00';
	code: string; // 배송상태 코드
	where: string; // 진행위치지점
	kind: string; // 진행상태
	telno: string; // 진행위치 지점 전화번호
	telno2: string; // 배송기사 전화번호
	remark: string; // 비고
	level: number;
	manName: string; //배송기사 이름
	manPic: string; //배송기사 전화번호
}

interface TrackingInfo {
	result: string; // 조회 결과
	senderName: string;
	receiverName: string;
	itemName: string; // 상품 이름
	invoiceNo: string; // 운송장 번호
	receiverAddr: string;
	orderNumber: string; // 주문번호
	adUrl: string;
	estimate: string; // 배송 예정 시간
	level: number; // 진행단계 [level 1: 배송준비중, 2: 집화완료, 3: 배송중, 4: 지점 도착, 5: 배송출발, 6:배송 완료]
	complete: true;
	recipient: string;
	itemImage: string; // 상품이미지 url
	trackingDetails: TrackingDetail[];
	productInfo: string; // 상품 정보
	zipCode: string;
	lastDetail: TrackingDetail; // 배송 완료후 정보
	lastStateDetail: TrackingDetail; // 배송 완료후 정보
	firstDetail: TrackingDetail;
	completeYN: 'Y' | 'N';
}

export class SweetTrackerAPI {
	axiosInstance: Axios;

	constructor(
		private key: string,
		private endpoint: string = 'http://info.sweettracker.co.kr'
	) {
		this.axiosInstance = new Axios();
	}

	async getCompanies() {
		const path = 'v1/companylist';
		const queryParma = {t_key: this.key};
		const res = await this.axiosInstance.get<{
			Company: DeliveryCompany[];
		}>(`${this.endpoint}/${path}`, {
			params: queryParma,
		});
		return res.data.Company;
	}

	async getRecommend(invoice: string) {
		const path = 'v1/recommend';
		const queryParma = {t_key: this.key, t_invoice: invoice};
		const res = await this.axiosInstance.get<{
			Recommend: DeliveryCompany[];
		}>(`${this.endpoint}/${path}`, {
			params: queryParma,
		});
		return res.data.Recommend;
	}

	async getTrackingInfo(invoice: string, companyCode: string) {
		const path = 'v1/trackinginfo';
		const queryParma = {
			t_key: this.key,
			t_invoice: invoice,
			t_code: companyCode,
		};
		const res = await this.axiosInstance.get<TrackingInfo>(
			`${this.endpoint}/${path}`,
			{
				params: queryParma,
			}
		);
		return res.data;
	}
}
