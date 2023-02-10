import React from 'react';
import styled from '@emotion/styled';

import {goToParentUrl, sendAmplitudeLog} from '@/utils';

import {
	iconIndexFinger,
	iconDocs,
	iconLock,
	iconClock,
} from '@/assets/images/homepage/index';

const BenefitContainerStyle = styled('section')`
	padding: 82px 0px 86px;
	background-color: #292929;

	@media (max-width: 820px) {
		padding: 137px 24px 86px;
		background-color: transparent;
	}
	@media (max-width: 480px) {
		padding: 100px 22.5px 25px;
	}
`;

const InquiryWrapStyle = styled('div')`
	max-width: 1200px;
	margin: auto;
	display: flex;
	flex-direction: column;
`;
const MainTextAreaStyle = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	h2 {
		font-weight: 700;
		font-size: 40px;
		line-height: 48px;
		text-align: center;
		color: #ffffff;
		margin: 0;
		margin-bottom: 16px;
	}
	h3 {
		font-weight: 500;
		font-size: 20px;
		line-height: 24px;
		text-align: center;
		color: #ffffff;
		margin: 0;
		margin-bottom: 48px;
	}

	@media (max-width: 480px) {
		h2 {
			font-size: 24px;
			line-height: 29px;
			margin-bottom: 8px;
		}
		h3 {
			font-size: 14px;
			line-height: 17px;
			margin-bottom: 60px;
		}
	}
`;
const ComparisonBoxStyle = styled('div')`
	max-width: 800px;
	width: 100%;
	margin: auto;
	display: flex;
	gap: 72px;

	@media (max-width: 820px) {
		gap: 16px;
	}
	@media (max-width: 480px) {
		gap: 60px;
		flex-direction: column;
	}
`;

const PaperConsBoxStyle = styled('div')`
	max-width: 800px;
	width: 100%;
	margin: auto;
	display: flex;
	flex-direction: column;
	gap: 16px;

	h6 {
		font-weight: 700;
		font-size: 20px;
		line-height: 24px;
		color: #aeaeba;
		margin: 0;
		margin-bottom: 16px;
		text-align: center;
	}

	div {
		max-width: 364px;
		width: 100%;
		height: 68px;
		background: #545454;
		border-radius: 5px;
		padding: 0 10px;

		p {
			font-weight: 700;
			font-size: 20px;
			text-align: center;
			color: #aeaeba;
		}
	}

	@media (max-width: 480px) {
		h6 {
			font-size: 20px;
			line-height: 24px;
		}

		div {
			max-width: 300px;
			height: 60px;
			padding: 0;
			width: 300px;
			margin: auto;

			p {
				font-size: 16px;
			}
		}
	}
`;

const DigitalGuaranteeProsBoxStyle = styled('div')`
	max-width: 800px;
	width: 100%;
	margin: auto;
	display: flex;
	flex-direction: column;
	gap: 16px;

	h6 {
		font-weight: 700;
		font-size: 20px;
		line-height: 24px;
		margin: 0;
		margin-bottom: 16px;
		text-align: center;
		background: linear-gradient(92.04deg, #5d9bf9 22.83%, #5c3ef6 246.6%);
		background-clip: text;
		text-fill-color: transparent;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	div {
		max-width: 364px;
		width: 100%;
		height: 68px;
		background: #ffffff;
		border-radius: 5px;
		padding: 0 10px;
		display: flex;
		align-items: center;
		justify-content: center;

		p {
			font-weight: 700;
			font-size: 20px;
			text-align: center;
			color: #222227;
		}

		img {
			max-width: 24px;
			min-width: 24px;
			max-height: 24px;
			min-height: 24px;
		}
	}

	@media (max-width: 480px) {
		h6 {
			font-size: 20px;
			line-height: 24px;
		}

		div {
			max-width: 300px;
			height: 68px;
			padding: 0;
			width: 300px;
			margin: auto;

			p {
				font-size: 16px;
			}

			img {
				max-width: 20px;
				min-width: 20px;
				max-height: 20px;
				min-height: 20px;
			}
		}
	}
`;

function BenefitOfNFT() {
	const consList = [
		'디자인→주문→인쇄→배송 = 10일',
		'대량 정보→여러장',
		'최소 수량 제한',
		'분실 우려',
	];
	const prosList = [
		'보증서 설정부터 발급까지 단 5분',
		'많은 내용도 하나의 페이지로',
		'한 장 부터 발급 가능',
		'안전한 디지털 지갑에 영구 보관',
	];
	const prosIconList = [iconClock, iconIndexFinger, iconDocs, iconLock];

	return (
		<BenefitContainerStyle>
			<InquiryWrapStyle>
				<MainTextAreaStyle>
					<h2>왜 디지털 보증서를 사용하나요?</h2>
					<h3>
						디지털 보증서는 종이 보증서의 불편함을 해결하고
						있습니다.
					</h3>
				</MainTextAreaStyle>

				<ComparisonBoxStyle>
					<PaperConsBoxStyle>
						<h6>종이 보증서</h6>

						{consList.map((li, idx) => (
							<div key={`cons-list-${idx}`}>
								<p>{li}</p>
							</div>
						))}
					</PaperConsBoxStyle>

					<DigitalGuaranteeProsBoxStyle>
						<h6>디지털 보증서</h6>

						{prosList.map((li, idx) => (
							<div key={`pros-list-${idx}`}>
								<p>{li}</p>
								<img src={prosIconList[idx]} />
							</div>
						))}
					</DigitalGuaranteeProsBoxStyle>
				</ComparisonBoxStyle>
			</InquiryWrapStyle>
		</BenefitContainerStyle>
	);
}

export default BenefitOfNFT;
