import {Exclude, Expose, Transform, Type} from 'class-transformer';
import {DateTime} from 'luxon';

export class DeliveryCompanies {
	@Expose({name: 'companyList', toPlainOnly: true})
	@Type(() => DeliveryCompany)
	Company: DeliveryCompany[];
}

export class RecommendCompanies {
	@Expose({name: 'recommendList', toPlainOnly: true})
	@Type(() => DeliveryCompany)
	Recommend: DeliveryCompany[];
}

export class DeliveryCompany {
	/** International */
	@Transform(({value}) => value === 'true', {toPlainOnly: true})
	@Expose({name: 'international', toPlainOnly: true})
	International: 'true' | 'false';
	/** 회사 이름 */
	@Expose({name: 'name', toPlainOnly: true})
	Name: string;
	/** 회사 코드 */
	@Expose({name: 'code', toPlainOnly: true})
	Code: string;
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

export class TrackingDetail {
	/** 진행시간 (number) */
	@Transform(
		({value}) => {
			const millis = value as number;
			return DateTime.fromMillis(millis).toISO();
		},
		{toPlainOnly: true}
	)
	time: number;

	/** 진행시간 (string) */
	@Exclude()
	timeString: string;
	/** 배송 상태 코드 */
	code: string | null;
	/** 현제 위치 */
	where: string;
	/** 진행 상태 */
	@Expose({name: 'status', toPlainOnly: true})
	kind: string;
	/** 배송 지점 전화번호 */
	@Expose({name: 'deliveryBranchTelNo', toPlainOnly: true})
	telno: string;
	/** 배송기사 전화번호 */
	@Expose({name: 'delivererTelNo', toPlainOnly: true})
	telno2: string;

	/** 비고 */
	@Exclude()
	remark: string | null;
	/** 진행단계 */
	@Expose({name: 'trackingStep', toPlainOnly: true})
	level: TrackingStep;
	/** 배송기사 이름 */
	@Expose({name: 'delivererName', toPlainOnly: true})
	manName: string;
	/** 배송기사 전화번호 */
	@Exclude()
	manPic: string;
}

export class TrackingInfo {
	/** 죄회 결과 */
	result: 'Y' | 'N';
	/** 발송인 이름 */
	senderName: string;
	/** 수취인 이름 */
	receiverName: string;
	/** 상품 이름 */
	itemName: string;
	/** 운소장 번호 */
	@Expose({name: 'trackingNo', toPlainOnly: true})
	invoiceNo: string;
	/** 배송지 주소 */
	receiverAddr: string;
	/** 주문 번호 */
	orderNumber: number | null;

	/** 택배사에서 광고용으로 사용하는 주소 */
	@Exclude()
	adUrl: string | null;

	/** 배송 예정 시간 */
	@Exclude()
	estimate: string | null;

	/** 진행단계 [level 1: 배송준비중, 2: 집화완료, 3: 배송중, 4: 지점 도착, 5: 배송출발, 6:배송 완료] */
	@Expose({name: 'trackingStep', toPlainOnly: true})
	level: TrackingStep;

	/** 배송 완료 여부(true or false) */
	complete: boolean;
	/** 수취인 */
	recipient: string;

	/** 상품 이미지 */
	@Exclude()
	itemImage: string | null;

	/** 상품 정보 */
	@Exclude()
	productInfo: string | null;

	/** 우편 번호 */
	zipCode: string | null;

	/** 배송 완료 여부 (Y,N) */
	completeYN: 'Y' | 'N';

	@Exclude()
	firstDetail: TrackingDetail;

	@Exclude()
	lastDetail: TrackingDetail;

	@Exclude()
	lastStateDetail: TrackingDetail;

	@Type(() => TrackingDetail)
	trackingDetails: TrackingDetail[];
}
