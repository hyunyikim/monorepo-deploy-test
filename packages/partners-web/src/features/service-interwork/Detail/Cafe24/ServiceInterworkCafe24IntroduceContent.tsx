import {Typography} from '@mui/material';

import {
	ImgServiceInterworkCafe24Sample1,
	ImgServiceInterworkCafe24Sample2,
} from '@/assets/images';

import ServiceInterworkDetailContent from '@/features/service-interwork/Detail/common/ServiceInterworkDetailContent';

function ServiceInterworkCafe24IntroduceContent() {
	return (
		<ServiceInterworkDetailContent
			imgSrcList={[
				[
					ImgServiceInterworkCafe24Sample1,
					ImgServiceInterworkCafe24Sample1,
				],
				[
					ImgServiceInterworkCafe24Sample2,
					ImgServiceInterworkCafe24Sample2,
				],
			]}>
			<>
				<Typography variant="h3">
					쇼핑몰에서 판매하면 자동으로 발급되는 디지털 개런티
				</Typography>
				<Typography>
					카페24 쇼핑몰을 사용 중이신가요?
					<br />
					주문 연동하고 간편하게 개런티를 자동 발급해 보세요.
				</Typography>
				<Typography>
					카페24 어드민에서 주문을 배송완료 처리하면 고객에게 개런티가
					자동 발급됩니다.
					<br />
					개런티는 주문자명, 휴대전화 기준으로 카카오 알림톡이
					발송됩니다. <br />
					고객은 알림톡 링크를 클릭하고 Klip을 가입하면 개런티를
					확인할 수 있습니다.
					<br />
				</Typography>
				<Typography>
					최초 카페24 연동 시, ‘배송완료’ 시점에 ‘전체상품’에 대해서
					개런티가 발급됩니다.
					<br />
					개런티 발급 시점, 발급 상품, 알림톡 발송 설정을 모두 변경할
					수 있습니다.
					<br />
				</Typography>
				<Typography variant="h4">서비스 사용방법</Typography>
				<Typography>
					1. 카페24 주문연동 “연동하기" 버튼을 클릭하세요.
					<br />
					2. 카페24 앱스토어에서 ‘버클파트너스'를 설치하세요.
					<br />
					3. 연동이 완료되면, 신규 주문 건에 대해서 배송완료 처리하면
					자동으로 개런티가 고객에게 발급됩니다.
				</Typography>
				<Typography variant="h4">개런티 발급 시점</Typography>
				<Typography>
					[배송완료] <span className="arrow">→</span>
					카페24 관리자 페이지에서 배송완료 처리 시, 자동으로 개런티
					발급 (알림톡 발송)
					<br />
					[수동발급] <span className="arrow">→</span> 카페24 관리자
					페이지에서 배송완료 처리 시, 버클 파트너스 개런티 목록에
					“신청대기” 상태로 저장
					<br />
					개런티 목록에서 신청대기건을 선택해서 발급이 가능합니다.
				</Typography>
				<Typography variant="h4">개런티 발급상품</Typography>
				<Typography>
					[전체상품] <span className="arrow">→</span> 카페24에 등록된
					모든 상품에 대해서 개런티 발급
					<br />
					[카테고리] <span className="arrow">→</span> 카페24에 등록된
					카테고리 중에서 선택한 카테고리 상품만 개런티 발급
				</Typography>
				{/* <Typography variant="h4">개런티 소개 알림톡 발송</Typography>
				<Typography>
					[발송함] <span className="arrow">→</span> 신규 주문완료 시,
					자동으로 고객에게 알림톡 발송
					<br />
					[발송안함] <span className="arrow">→</span> 신규 주문완료
					시, 알림톡 미발송
				</Typography> */}
			</>
		</ServiceInterworkDetailContent>
	);
}

export default ServiceInterworkCafe24IntroduceContent;
