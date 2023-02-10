import React from 'react';
import styled from '@emotion/styled';

import {goToParentUrl, sendAmplitudeLog} from '@/utils';

import {
	imgInquiryBg,
	imgInquiryBg2x,
	imgInquiryMainCard,
	imgInquiryMainCard2x,
} from '@/assets/images/homepage/index';

const InquiryContainerStyle = styled('section')`
	padding-top: 102px;

	@media (max-width: 480px) {
		padding-top: 60px;
	}
`;

const InquiryWrapStyle = styled('div')`
	max-width: 1200px;
	margin: auto;
`;

const InquiryBgStyle = styled('div')`
	background: url(${imgInquiryBg}) no-repeat center;
	background-size: cover;
	width: 100%;
	height: 541px;
	position: relative;

	::after {
		content: '';
		display: block;
		background: rgba(10, 10, 10, 0.85);
		mix-blend-mode: normal;
		backdrop-filter: blur(30px);
		height: 541px;

		position: absolute;
		left: 0;
		top: 0;
		right: 0;
	}

	@media (max-width: 480px) {
		height: 642px;
	}
`;

const MainTextAreaStyle = styled('div')`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	position: absolute;
	left: 0;
	right: 0;
	top: 122px;
	/* top: 162px; */
	z-index: 3;
	h3 {
		font-weight: 300;
		font-size: 24px;
		line-height: 145%;
		text-align: center;
		color: #ffffff;
		margin: 0;
		margin-bottom: 8px;
	}
	h2 {
		font-weight: 700;
		font-size: 36px;
		line-height: 125%;
		text-align: center;
		color: #ffffff;
		margin: 0;
		margin-bottom: 230px;
	}
	button {
		font-weight: 700;
		font-size: 20px;
		line-height: 58px;
		text-align: center;
		color: #ffffff;
		width: 286px;
		height: 58px;
		background: linear-gradient(260.19deg, #9e22ff 19.8%, #e3115d 53.77%);
		border-radius: 64px;
		border: 0;
		cursor: pointer;
	}

	@media (max-width: 480px) {
		top: 165px;
		h3 {
			font-size: 20px;
		}
		h2 {
			font-size: 28px;
			margin-bottom: 351px;
		}
		button {
			line-height: 51px;
			width: 250px;
			height: 51px;
			border-radius: 80px;
		}
	}
`;

const VideoWrapStyle = styled('div')`
	display: flex;
	justify-content: center;
	position: absolute;
	left: 0;
	right: 0;
	top: 102px;
	z-index: 2;

	video {
		height: 542px;
	}
	img {
		height: 542px;
	}

	@media (max-width: 480px) {
		top: 60px;
		video {
			height: 642px;
		}
	}
`;

function InquiryIntro() {
	const screenWidth = window.innerWidth;
	const goToInquiry = () => {
		sendAmplitudeLog('inquiry_confirm_top_click', {
			button_title: '도입문의 top 버튼 클릭',
		});
	};

	return (
		<InquiryContainerStyle>
			<InquiryWrapStyle>
				<MainTextAreaStyle>
					<div>
						<h3>종이 보증서의 디지털화,</h3>
						<h2>
							디지털 개런티를 도입하는
							<br />
							가장 빠른 방법, 버클
						</h2>
					</div>

					<a href="#inquiryForm">
						<button onClick={goToInquiry}>도입문의</button>
					</a>
				</MainTextAreaStyle>

				<VideoWrapStyle>
					<video
						playsInline
						controls={false}
						loop
						autoPlay
						muted
						className="brand_card">
						<source
							src={
								screenWidth > 480
									? `${STATIC_URL}/files/video/video_inquiry_main.mp4`
									: `${STATIC_URL}/files/video/video_inquiry_main_mobile.mp4`
							}
							type="video/mp4"
						/>
						<p>
							버클을 도입해서 사용하고 있는 고객사의 디지털
							보증서가 돌아가고 있는 영상
						</p>
					</video>
				</VideoWrapStyle>
			</InquiryWrapStyle>
			<InquiryBgStyle />
		</InquiryContainerStyle>
	);
}

export default InquiryIntro;
