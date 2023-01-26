import React, {useState} from 'react';
import styled from '@emotion/styled';
import {css, keyframes} from '@emotion/react';
import {
	greyArrow2x,
	greyArrow,
	imgEndingBg2x,
	imgMobileEndingBg2x,
	imgEndingTitle,
	imgEndingTitle2x,
} from '@/assets/images/index';
import {sendAmplitudeLog, goToParentUrl} from '@/utils';

type IsOpenProps = {
	isOpen: boolean;
};

const FAQServiceContainerStyle = styled('section')`
	padding: 0 0 150px;

	@media (max-width: 1200px) {
		padding: 0px 80px 150px;
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
	flex-direction: column;
	align-items: center;
	gap: 12px;
	margin-bottom: 71px;

	h1 {
		font-weight: 700;
		font-size: 50px;
		line-height: 60px;
		text-align: center;
		margin: 0;
		color: #222227;
	}
	h6 {
		font-weight: 700;
		font-size: 24px;
		line-height: 29px;
		color: #526eff;
		margin: 0;
	}

	@media (max-width: 820px) {
		margin-bottom: 50px;
		gap: 14px;

		h1 {
			font-size: 36px;
			line-height: 43px;
		}
		h6 {
			font-size: 20px;
			line-height: 25px;
		}
	}

	@media (max-width: 480px) {
		margin-bottom: 20px;

		h1 {
			font-size: 26px;
			line-height: 31px;
		}
		h6 {
			font-size: 14px;
			line-height: 17px;
		}
	}
`;

const FAQListContainerStyle = styled('div')`
	border-top: 1px solid #e2e2e9;
	margin-bottom: 60px;

	@media (max-width: 820px) {
		margin-bottom: 22px;
	}
	@media (max-width: 480px) {
		border-top: 0;
	}
`;

const FAQListBoxStyle = styled('div')`
	/* border-bottom: 1px solid #e2e2e9; */
	/* height: 142px;
	padding: 50px 0; */
`;

const FAQListTitleBoxStyle = styled('div')`
	border-bottom: 1px solid #e2e2e9;
	height: 142px;
	padding: 50px 0;

	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;

	h2 {
		font-weight: 700;
		font-size: 34px;
		line-height: 41px;
		color: #222227;
		margin: 0;
		pointer-events: none;
	}

	@media (max-width: 820px) {
		max-height: 76px;
		height: 100%;
		padding: 30px 0;

		h2 {
			font-size: 16px;
			line-height: 20px;
		}
	}

	@media (max-width: 480px) {
		h2 {
			max-width: 260px;
		}
	}
`;

const GreyArrowStyle = styled('img')<IsOpenProps>`
	transition: all 250ms ease-in-out;
	transform: ${({isOpen}) => (isOpen ? 'rotate(0deg)' : 'rotate(180deg)')};

	@media (max-width: 820px) {
		width: 20px;
		height: 20px;
	}
`;

const FAQListContentBoxStyle = styled('div')<IsOpenProps>`
	border-bottom: 1px solid #e2e2e9;
	background: #f7f8fe;
	font-weight: 500;
	font-size: 24px;
	line-height: 28px;
	color: #7b7b86;
	height: '0px',
		${({isOpen}) => ({
			transition: 'all 250ms ease-in-out',
			height: isOpen ? 'auto' : '0px',
			padding: isOpen ? '46px 40px 56px' : '0px 40px 0px',
			opacity: isOpen ? 1 : 0,
		})};

	@media (max-width: 820px) {
		font-size: 14px;
		line-height: 22px;

		height: '0px';
		${({isOpen}) => ({
			padding: isOpen ? '20px 16px' : '0px 16px',
			transition: 'all 250ms ease-in-out',
			height: isOpen ? 'auto' : '0px',
			opacity: isOpen ? 1 : 0,
		})};
	}
`;

const GuideDocsTextStyle = styled('div')`
	font-weight: 700;
	font-size: 24px;
	line-height: 20px;
	color: #5c5c65;
	text-align: center;
	margin-bottom: 150px;

	a {
		font-weight: 700;
		font-size: 24px;
		line-height: 20px;

		text-decoration-line: underline;
		color: #526eff;
	}

	@media (max-width: 820px) {
		font-size: 14px;
		line-height: 20px;
		margin-bottom: 100px;

		a {
			font-size: 14px;
			line-height: 20px;
		}
	}
`;

const TextWithCommaStyle = styled('p')`
	font-weight: 700;
	font-size: 24px;
	line-height: 20px;
	color: #5c5c65;
	text-align: center;
	display: inline;
	margin: 0;

	@media (max-width: 820px) {
		display: block;
		font-size: 14px;
		line-height: 20px;
	}
`;

const EndingSignupBoxStyle = styled('div')`
	height: 500px;
	max-width: 1200px;
	position: relative;

	@media (max-width: 820px) {
		height: 340px;
		border-radius: 16px;
	}
`;

const EndingBgImg = styled('div')`
	background: url(${imgEndingBg2x}) no-repeat center;
	background-size: contain;
	width: 100%;
	height: 100%;
	border-radius: 30px;

	@media (max-width: 480px) {
		border-radius: 16px;
		background: url(${imgMobileEndingBg2x}) no-repeat center;
		background-size: contain;
	}
`;

const EndingSignupTitleBoxStyle = styled('div')`
	position: absolute;
	left: 0;
	right: 0;
	top: 142px;
	margin: 0 auto;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 60px;

	> img {
		max-width: 476px;
		max-height: 144px;
		width: 100%;
		height: 100%;
	}

	button {
		width: 225px;
		height: 60px;
		background: #ffffff;
		border-radius: 64px;
		font-weight: 700;
		font-size: 21px;
		line-height: 60px;
		text-align: center;
		color: #526eff;
		border: 0;
		cursor: pointer;
	}

	@media (max-width: 820px) {
		top: 96px;
		gap: 54px;

		> img {
			max-width: 238px;
			max-height: 74px;
		}

		button {
			width: 225px;
			height: 56px;
			font-size: 18px;
			line-height: 22px;
			line-height: 56px;
		}
	}
`;

function PriceFAQSection() {
	const [faqState, setFaqState] = useState<string>('0');
	const faqList = [
		{
			title: '무료체험은 사용기간이 있나요?',
			content:
				'버클에서 제공하는 무료체험기간은 30일동안 제공되며, 개런티 발급에 제공되는 핵심기능들을 무료로 이용해 보실 수 있습니다. 30일이 경과 후에는 기능이 제한됩니다.',
			key: 'whyNft',
		},
		{
			title: '구독 중인 플랜을 변경할 수 있나요?',
			content:
				'구독중인 플랜은 자유롭게 변경이 가능합니다. 단, 연결제중 플랜 다운그레이드시에는 위약금이 발생하며 고객센터로 문의를 주셔야 플랜 변경이 진행됩니다.',
			key: 'howToIssue',
		},
		{
			title: '월간/연간 플랜의 요금제 비용은 어떻게 청구되나요?',
			content:
				'월간/연간 요금제 정기결제 비용은 다음 이용 시작일에 자동으로 결제됩니다. 더 이상 요금제를 이용하지 않으려면, 다음 결제일 전에 정기 결제를 중단해주세요.',
			key: 'howUserGet',
		},
		{
			title: '환불정책은 어떻게 되나요?',
			content:
				'사용량을 산출, 선결제한 월 요금에서 제하여 환불해 드립니다. 연 결제의 경우 위약금이 발생합니다. 자세한 사항은 구독 가이드 문서를 확인해주세요.',
			key: 'howMuch',
		},
	];

	const screenWidth = window.innerWidth;
	const goToSignup = () => {
		sendAmplitudeLog(`homepage_price_signupbottom_click`, {
			button_title: `무료로 시작하기`,
		});

		goToParentUrl(`/auth/signup`);
	};

	const openContent = (e: React.MouseEvent<HTMLElement>) => {
		// const targetElement = e.target;
		const targetIdx = e.target.dataset.idx;

		if (typeof targetIdx === 'string') {
			if (targetIdx === faqState) {
				setFaqState('0');
			} else {
				setFaqState(targetIdx);
			}
		}
	};

	return (
		<FAQServiceContainerStyle>
			<ContainerInnerStyle>
				<TitleSectionStyle>
					<h6>FAQ</h6>
					<h1> 자주 묻는 질문</h1>
				</TitleSectionStyle>

				<FAQListContainerStyle>
					{faqList.map(({title, content, key}, idx) => (
						<FAQListBoxStyle key={`faq-price-list-${idx}`}>
							<FAQListTitleBoxStyle
								data-idx={idx + 1}
								onClick={openContent}>
								<h2>{title}</h2>
								<GreyArrowStyle
									isOpen={Number(faqState) === idx + 1}
									src={greyArrow}
									srcSet={`${greyArrow} 1x, ${greyArrow2x} 2x`}
									alt="arrow"
								/>
							</FAQListTitleBoxStyle>

							<FAQListContentBoxStyle
								isOpen={
									Number(faqState) === idx + 1 ? true : false
								}>
								{content}
							</FAQListContentBoxStyle>
						</FAQListBoxStyle>
					))}
				</FAQListContainerStyle>

				<GuideDocsTextStyle>
					<TextWithCommaStyle>
						다른 궁금한 점이 있는 경우,{' '}
					</TextWithCommaStyle>
					<a
						href="https://mation.notion.site/7a397a6aac6f4955b0be326c4f162f54"
						target="_blank"
						rel="noreferrer">
						가이드 문서
					</a>
					를 확인하시거나 채팅으로 문의해주세요.
				</GuideDocsTextStyle>

				<EndingSignupBoxStyle>
					<EndingBgImg />

					<EndingSignupTitleBoxStyle>
						<img
							src={imgEndingTitle}
							srcSet={`${imgEndingTitle} 1x, ${imgEndingTitle2x} 2x`}
							alt="ending-bg"
							className={'ending_title'}
						/>
						<button className="ending_btn" onClick={goToSignup}>
							무료로 시작하기
						</button>
					</EndingSignupTitleBoxStyle>
				</EndingSignupBoxStyle>
			</ContainerInnerStyle>
		</FAQServiceContainerStyle>
	);
}

export default PriceFAQSection;
