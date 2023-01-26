import React from 'react';
import styled from '@emotion/styled';
import {css, keyframes} from '@emotion/react';
import {imgBeta, imgScissorsInGreenBox} from '@/assets/images/index';
import {goToParentUrl} from '@/utils';

const AdditionalServiceContainer = styled('section')`
	padding: 160px 0px;

	@media (max-width: 1200px) {
		padding: 160px 80px;
	}
	@media (max-width: 820px) {
		padding: 60px 24px;
	}
`;

const ContainerInnerStyle = styled('div')`
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	margin: 0 auto;
`;

const TitleSectionStyle = styled('div')`
	display: flex;
	gap: 16px;
	align-items: center;
	margin-bottom: 40px;

	h2 {
		font-weight: 700;
		font-size: 46px;
		line-height: 55px;
		color: #222227;
		margin: 0;
	}
	img {
		width: 62px;
		height: 28px;
	}

	@media (max-width: 820px) {
		gap: 13px;
		margin-bottom: 30px;

		h2 {
			font-size: 36px;
			line-height: 43px;
		}
		img {
			width: 52px;
			height: 23px;
		}
	}

	@media (max-width: 480px) {
		gap: 13px;
		margin-bottom: 30px;

		h2 {
			font-size: 21px;
			line-height: 25px;
		}
		img {
			width: 32px;
			height: 15px;
		}
	}
`;

const GreenBoxStyle = styled('div')`
	max-height: 194px;
	height: auto;
	width: 100%;
	background: #edf9f7;
	border: 1px solid #00c29f;
	border-radius: 16px;
	padding: 35px 40px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	img {
		width: 124px;
		height: 124px;
		margin-right: 30px;
	}

	> div {
		width: 100%;
		display: flex;
		/* flex-direction: column; */
		align-items: center;

		h6 {
			font-weight: 700;
			font-size: 34px;
			line-height: 145%;
			color: #222227;
			margin: 0;
			margin-bottom: 8px;
		}
		p {
			font-weight: 500;
			font-size: 18px;
			line-height: 18px;
			color: #47474f;
			margin: 0;
		}
	}

	button {
		font-weight: 700;
		font-size: 21px;
		line-height: 60px;
		color: #ffffff;
		width: 193px;
		height: 60px;
		background: #222227;
		border-radius: 10px;
		border: 0;
		cursor: pointer;
	}

	@media (max-width: 820px) {
		border-radius: 12px;
		padding: 20px;
		gap: 24px;

		img {
		}

		> div {
			h6 {
				font-size: 28px;
				line-height: 29px;
				margin-bottom: 5px;
			}
			p {
				font-size: 16px;
				line-height: 16px;
			}
		}

		button {
			font-size: 18px;
		}
	}

	@media (max-width: 480px) {
		flex-direction: column;
		gap: 20px;
		padding: 20px;
		padding-right: 18px;

		img {
			width: 78px;
			height: 78px;
			border-radius: 12px;
			margin-right: 12px;
		}

		> div {
			h6 {
				font-size: 18px;
				line-height: 26px;
			}
			p {
				font-size: 13px;
				line-height: 16px;
			}
		}

		button {
			font-size: 16px;
			width: 100%;
			height: 40px;
			line-height: 40px;
			border-radius: 6px;
		}
	}
`;

const TestBox = styled('div')``;
const TextGridStyle = styled('div')`
	display: flex;
	flex-direction: row;

	@media (max-width: 480px) {
		flex-direction: column;
	}
`;

function AdditionalServiceSection() {
	const goToSignup = () => {
		goToParentUrl('/auth/signup');
	};
	return (
		<AdditionalServiceContainer>
			<ContainerInnerStyle>
				<TitleSectionStyle>
					<h2>부가 서비스</h2>
					<img src={imgBeta} alt="beta" />
				</TitleSectionStyle>

				<GreenBoxStyle>
					<div>
						<img src={imgScissorsInGreenBox} alt="sicssors" />
						<div>
							<h6>수선신청 관리</h6>
							<TextGridStyle>
								<p>고객이 간편하게 수선신청하고,&nbsp;</p>
								<p>신청 내역을 한곳에서 관리하세요.</p>
							</TextGridStyle>
						</div>
					</div>

					<button onClick={goToSignup}>무료로 시작하기</button>
				</GreenBoxStyle>
			</ContainerInnerStyle>
		</AdditionalServiceContainer>
	);
}

export default AdditionalServiceSection;
