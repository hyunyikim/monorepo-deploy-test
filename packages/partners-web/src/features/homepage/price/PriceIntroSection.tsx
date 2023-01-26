import React, {useState, useEffect} from 'react';

import styled from '@emotion/styled';
import {css, keyframes} from '@emotion/react';
import {goToParentUrl} from '@/utils';
import {
	imgBlueCheckTick,
	imgBlueCheckTick2x,
	imgGreenCheckTick,
	imgGreenCheckTick2x,
	imgDefaultCheckTick,
	imgDefaultCheckTick2x,
	imgHeadPhone,
	imgHeadPhone2x,
} from '@/assets/images/index';
import {useModalStore} from '@/stores';
import {getPricePlanList as getPricePlanListData} from '@/api/payment.api';
import {PricePlan} from '@/@types';

type PricePlanCard = {
	mainColor: string;
};

type PricePlanProps = {
	isAnnualPayment: boolean;
};

const IntroContainerSectionStyle = styled('section')`
	padding: 214px 0px 172px;

	@media (max-width: 1200px) {
		padding: 214px 80px 172px;
	}
	@media (max-width: 820px) {
		padding: 127px 24px 58px;
	}
`;
const ContainerInnerStyle = styled('div')`
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;

	@media (max-width: 820px) {
		max-width: 820px;
	}
	@media (max-width: 480px) {
		max-width: 480px;
	}
`;
const TitleArea = styled('div')`
	margin-bottom: 140px;
	@media (max-width: 480px) {
		margin-bottom: 80px;
	}
`;
const TitleStyle = styled('h1')`
	font-weight: 700;
	font-size: 50px;
	line-height: 60px;
	color: #222227;
	margin: 0;
	margin-bottom: 14px;
	text-align: center;

	@media (max-width: 480px) {
		margin-bottom: 11px;
		font-size: 24px;
		line-height: 29px;
	}
`;
const SubtitleStyle = styled('h4')`
	font-weight: 500;
	font-size: 24px;
	line-height: 29px;
	color: #8e8e98;
	margin: 0;
	margin-bottom: 30px;
	text-align: center;

	@media (max-width: 480px) {
		font-size: 13px;
		line-height: 16px;
	}
`;
const ButtonBoxStyle = styled('div')`
	display: flex;
	align-items: center;
	gap: 16px;

	@media (max-width: 480px) {
		flex-direction: column;
	}
`;

const GradientButton = styled('button')`
	height: 60px;
	line-height: 60px;
	border-radius: 64px;
	padding: 0 31px;
	font-size: 21px;
	font-weight: 700;
	color: white;
	border: 0;
	background: linear-gradient(98.38deg, #5d9bf9 43.58%, #5c3ef6 104.42%);
	cursor: pointer;

	@media (max-width: 480px) {
		font-size: 14px;
		height: 49px;
		line-height: 49px;
	}
`;
const CapsuleButton = styled('div')`
	cursor: pointer;
	background: #f3f3f5;
	border: 0;
	padding: 0 46px;
	border-radius: 64px;
	height: 60px;
	font-size: 21px;
	font-weight: 700;
	color: black;
	line-height: 60px;

	display: flex;
	align-items: center;

	::before {
		content: '';
		display: inline-block;
		width: 25px;
		height: 25px;
		margin-right: 7px;
		background: url(${imgHeadPhone2x}) no-repeat center;
		background-size: contain;
	}

	@media (max-width: 480px) {
		height: 18px;
		font-size: 14px;
		line-height: 17px;
		text-decoration: underline;
		background: transparent;
		::before {
			width: 16px;
			height: 16px;
		}
	}
`;

const AboutPriceAreaStyle = styled('div')`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
`;
const PriceTitleBoxStyle = styled('div')`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin-bottom: 45px;

	@media (max-width: 820px) {
		align-items: flex-start;
	}

	@media (max-width: 480px) {
		margin-bottom: 61px;
	}
`;
const PriceTitleLeftBoxStyle = styled('div')`
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: relative;

	@media (max-width: 820px) {
		flex-direction: column;
		align-items: flex-start;

		h2 {
			margin-bottom: 14px;
		}
	}
`;
const PriceTitleStyle = styled('h2')`
	font-weight: 700;
	font-size: 36px;
	line-height: 43px;
	color: #222227;
	margin: 0;
	margin-right: 12px;

	@media (max-width: 480px) {
		font-size: 21px;
		line-height: 25px;
	}
`;
const PriceSubtitleStyle = styled('h4')`
	font-weight: 500;
	font-size: 18px;
	line-height: 22px;
	text-decoration-line: underline;
	color: #aeaeba;
	margin: 0;
	cursor: pointer;

	@media (max-width: 480px) {
		font-size: 14px;
		line-height: 17px;
		width: 210px;

		position: absolute;
		top: 38px;
		left: 0;
	}
`;
const PriceTitleRightBoxStyle = styled('div')`
	display: flex;
	align-items: center;
`;

const GreyTextStyle = styled('span')`
	font-weight: 700;
	font-size: 18px;
	line-height: 22px;
	color: #7b7b86;

	@media (max-width: 480px) {
		font-size: 12px;
		line-height: 14px;
	}
`;
const RedTextStyle = styled('span')`
	font-weight: 700;
	font-size: 18px;
	line-height: 22px;
	color: #f8434e;
	margin-left: 4px;
	@media (max-width: 480px) {
		font-size: 12px;
		line-height: 14px;
	}
`;
const BlackTextStyle = styled('span')`
	font-weight: 700;
	font-size: 18px;
	line-height: 22px;
	color: #222227;
	@media (max-width: 480px) {
		font-size: 12px;
		line-height: 14px;
	}
`;

const ToggleStyle = styled('div')<PricePlanProps>`
	width: 56px;
	height: 32px;
	background: #00c29f;
	border-radius: 39px;
	margin: 0 9px 0 10px;
	position: relative;
	cursor: pointer;

	::after {
		content: '';
		display: block;
		width: 26px;
		height: 26px;
		background: #ffffff;
		border-radius: 50%;

		position: absolute;
		top: 3px;

		/* left: 0px; */
		/* right: 4px; */
	}

	${({isAnnualPayment}) => ({
		background: isAnnualPayment ? '#00c29f' : '#CACAD3',
		'::after': {
			right: isAnnualPayment ? '4px' : '26px',
			transition: 'all 350ms ease-in-out',
		},
	})}

	@media (max-width: 480px) {
		width: 42px;
		height: 24px;
		margin: 0 4px 0 4px;
		::after {
			width: 20px;
			height: 20px;
			top: 2px;
			right: 3px;
		}

		${({isAnnualPayment}) => ({
			background: isAnnualPayment ? '#00c29f' : '#CACAD3',
			'::after': {
				right: isAnnualPayment ? '3px' : '19px',
			},
		})}
	}
`;

const PriceBoxStyle = styled('div')`
	display: flex;
	gap: 12px;
	@media (max-width: 1200px) {
		flex-wrap: wrap;
		justify-content: center;
	}

	@media (max-width: 480px) {
	}
`;

const PriceTaxTextStyle = styled('span')`
	font-weight: 500;
	font-size: 18px;
	line-height: 22px;
	color: #aeaeba;
	margin-top: 30px;
	margin-left: auto;

	@media (max-width: 480px) {
		margin-top: 20px;
		margin-right: auto;
		font-size: 12px;
		line-height: 14px;
	}
`;

const PriceInnerFlexBoxStyle = styled('div')`
	display: flex;
	flex-direction: column;
	align-items: center;
	@media (max-width: 480px) {
		align-items: flex-start;
	}
`;
const PriceInnerPriceFlexBoxStyle = styled('div')`
	@media (max-width: 480px) {
		margin-left: auto;
	}
`;

const PricePlanBoxStyle = styled('div')<PricePlanCard>`
	cursor: pointer;
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius: 10px;
	width: 230px;
	height: 311px;
	padding: 26px 0 14px;
	${(props) => ({
		background:
			props.mainColor === 'grey'
				? '#ffffff'
				: props.mainColor === 'blue'
				? '#EDF0FF'
				: '#222227',
		boxShadow:
			props.mainColor === 'blue'
				? '0px 2px 10px rgba(0, 0, 0, 0.06)'
				: '0px 2px 10px rgba(0, 0, 0, 0.15)',
		border: props.mainColor === 'blue' ? '1px solid #98A8FF' : 0,
	})};

	:hover {
		background: ${(props) => props.mainColor === 'grey' && '#f8f8f8'};
	}

	/* background: ${(props) =>
		props.mainColor === 'grey'
			? '#ffffff'
			: props.mainColor === 'blue'
			? '#EDF0FF'
			: '#222227'};
	box-shadow: ${(props) =>
		props.mainColor === 'blue'
			? '0px 2px 10px rgba(0, 0, 0, 0.06)'
			: '0px 2px 10px rgba(0, 0, 0, 0.15)'};
	border: ${(props) => (props.mainColor === 'blue' ? '1px solid #98A8FF' : 0)}; */

	img {
		width: 34px;
		height: 34px;
		margin-bottom: 25px;
	}

	h4 {
		font-weight: 700;
		font-size: 30px;
		line-height: 36px;
		/* color: #8e8e98; */
		color: ${(props) =>
			props.mainColor === 'grey'
				? '#8e8e98'
				: props.mainColor === 'blue'
				? '#526EFF'
				: '#ffffff'};
		margin: 0;
		margin-bottom: 8px;
	}
	p {
		font-weight: 500;
		font-size: 18px;
		line-height: 22px;
		color: ${(props) =>
			props.mainColor === 'grey'
				? '#8e8e98'
				: props.mainColor === 'blue'
				? '#526EFF'
				: '#ffffff'};
		margin: 0;
		margin-bottom: ${(props) =>
			props.mainColor === 'blue' ? '30px' : '70px'};
	}
	h6 {
		font-weight: 700;
		font-size: 26px;
		line-height: 31px;
		display: inline-block;
		margin: 0;
		margin-right: ${({mainColor}) =>
			mainColor === 'blue' ? ' 0px' : ' 1px'};
		color: ${(props) =>
			props.mainColor === 'grey'
				? '#8e8e98'
				: props.mainColor === 'blue'
				? '#526EFF'
				: '#ffffff'};
	}
	span {
		font-weight: 500;
		font-size: 16px;
		line-height: 19px;
		color: ${(props) =>
			props.mainColor === 'grey'
				? '#AEAEBA'
				: props.mainColor === 'blue'
				? '#526EFF'
				: '#ffffff'};
	}
	button {
		margin-top: 30px;
		background: #526eff;
		border-radius: 10px;
		font-weight: 700;
		font-size: 20px;
		line-height: 57px;
		height: 57px;
		color: #ffffff;
		border: 0;
		padding: 0 66px;
		cursor: pointer;
	}

	@media (max-width: 480px) {
		height: ${({mainColor}) => (mainColor === 'blue' ? '150px' : '88px')};
		width: 100%;
		padding: 20px;
		flex-direction: row;
		align-items: flex-start;
		position: relative;

		img {
			width: 24px;
			height: 24px;
			margin-bottom: 0px;
			margin-right: 12px;
		}

		h4 {
			font-size: 18px;
			line-height: 22px;
			margin: 0;
			margin-bottom: 9px;
		}

		p {
			font-size: 13px;
			line-height: 16px;
			margin: 0;
		}
		h6 {
			font-size: 18px;
			line-height: 22px;
			margin-right: ${({mainColor}) =>
				mainColor === 'blue' ? ' 0px' : ' 4px'};
		}
		span {
			font-size: 14px;
			line-height: 17px;
		}

		button {
			position: absolute;
			bottom: 20px;
			left: 20px;
			width: calc(100% - 40px);
			font-size: 16px;
			line-height: 40px;
			height: 40px;
			border-radius: 6px;
		}
	}
`;

const TopContentBoxStyle = styled('div')`
	margin-top: 5px;
	font-weight: 500;
	font-size: 16px;
	line-height: 23px;
	color: #000000;
	padding-bottom: 30px;
	border-bottom: 1px solid #dfdfdf;
	margin-bottom: 26px;

	@media (max-width: 480px) {
		margin-top: 0px;
		padding-bottom: 16px;
		margin-bottom: 16px;
		font-size: 13px;
		line-height: 19px;
	}
`;
const BottomContentBoxStyle = styled('div')`
	margin-top: 5px;
	font-weight: 500;
	font-size: 16px;
	line-height: 23px;
	color: #000000;
	padding-bottom: 30px;

	display: flex;
	flex-direction: column;
	gap: 27px;

	h6 {
		font-weight: 700;
		font-size: 16px;
		line-height: 24px;
		color: #222227;
		margin: 0;
	}
	p {
		font-weight: 500;
		font-size: 16px;
		line-height: 24px;
		color: #222227;
		margin: 0;
	}
	ol {
		margin: 4px 0;
		padding-inline-start: 24px;
		li {
			font-weight: 400;
			font-size: 16px;
			line-height: 24px;
			color: #222227;
			margin: 0;
		}
	}

	span {
		font-weight: 400;
		font-size: 16px;
		line-height: 24px;
		color: #222227;
		margin: 0;
	}
	strong {
		font-weight: 700;
		font-size: 16px;
		line-height: 24px;
		color: #222227;
		margin: 0;
	}

	@media (max-width: 480px) {
		margin-top: 0px;
		padding-bottom: 0px;
		gap: 16px;

		h6 {
			font-size: 12px;
			line-height: 18px;
		}
		p {
			font-size: 12px;
			line-height: 18px;
		}
		ol {
			padding-inline-start: 18px;
			li {
				font-size: 12px;
				line-height: 17px;
			}
		}

		span {
			font-size: 12px;
			line-height: 18px;
		}
		strong {
			font-size: 12px;
			line-height: 18px;
		}
	}
`;

interface openEmailModalProps {
	openEmailModal(): void;
}
type PricePlanListProps = Pick<
	PricePlan,
	'planName' | 'planLimit' | 'planPrice' | 'displayPrice'
>;

const tempPriceList: PricePlanListProps[] = [
	{
		planName: '엑스 스몰',
		planLimit: 250,
		planPrice: 6,
		displayPrice: 5,
	},
	{
		planName: '스몰',
		planLimit: 500,
		planPrice: 12,
		displayPrice: 10,
	},
	{
		planName: '미디엄',
		planLimit: 750,
		planPrice: 18,
		displayPrice: 15,
	},
	{
		planName: '라지',
		planLimit: 1000,
		planPrice: 24,
		displayPrice: 20,
	},
];

function PriceIntroSection({openEmailModal}: openEmailModalProps) {
	const [isAnnualPayment, setIsAnnualPayment] = useState<boolean>(true);
	const [priceClickState, setPriceClickState] = useState<number>(0);
	const [priceList, setPriceList] = useState<PricePlanListProps[] | []>([]);
	const setModal = useModalStore((state) => state.setModalOption);

	const getPricePlanList = async () => {
		try {
			const pricePlanList = await getPricePlanListData();
			// console.log('pricePlanList', pricePlanList);
			setPriceList([...tempPriceList]);
		} catch (error) {
			console.log('error', error);
		}
	};

	useEffect(() => {
		getPricePlanList();
	}, []);

	const priceToggleHandler = () => {
		setIsAnnualPayment((pre) => !pre);
	};
	const cardClickHandler = (_idx: number) => {
		setPriceClickState(_idx);
	};
	const goToSignup = () => {
		goToParentUrl('/auth/signup');
	};
	const openIntroductionInquiryModal = () => {
		openEmailModal();
	};
	const openPlanInfoModal = () => {
		setModal({
			id: '',
			isOpen: true,
			title: '합리적으로 구독하는 개런티 플랜',
			maxWidth: '800px',
			align: 'left',
			titlePadding: 20,
			children: (
				<div>
					<TopContentBoxStyle>
						버클의 유료플랜은 개런티 발급량에 따라 요금제가
						나뉩니다. 고객이 브랜드(기업)에서 상품을 구매할 경우,
						해당 상품에 대한 디지털 개런티를 고객에게 발급할 수
						있습니다. 발급량은 요금제 별로 디지털 개런티를 발급이
						가능한 수를 의미합니다. 요금제를 선택할때에는
						브랜드(기업)의 평균 판매량을 고려해 선택해 보세요.
						플랜을 정하는데 어려움이 있으시다면, 버클의 무료플랜을
						통해 월 평균 개런티 발급량을 측정해보세요. 무료플랜에
						제공된 발급량을 다 사용하면 브랜드(기업)에 맞는 플랜을
						추천해드립니다.
					</TopContentBoxStyle>

					<BottomContentBoxStyle>
						<div>
							<h6>개런티 발급량이란?</h6>
							<p>
								버클을 이용하는 브랜드(기업)에서 상품을 판매하고
								발급하는 개런티 수를 뜻합니다.
							</p>
						</div>

						<div>
							<h6>유의사항</h6>
							<p>
								버클에서 개런티를 발급 할 때 유의해야 할
								상태값이 존재합니다.
							</p>
							<ol>
								<li>
									발급완료 : 브랜드(기업)에서 고객에게
									개런티를 발급 한 상태
								</li>
								<li>
									연동완료 : 개런티를 발급받은 고객이 카카오
									알림톡을 통해 디지털 지갑으로 개런티를 받은
									상태
								</li>
							</ol>
							<span>버클에서는 </span>
							<strong>
								1. 발급완료 시점에 개런티 발급수를 차감
							</strong>
							<span>합니다.</span>
						</div>
					</BottomContentBoxStyle>
				</div>
			),
		});
	};

	return (
		<IntroContainerSectionStyle>
			<ContainerInnerStyle>
				<TitleArea>
					<TitleStyle>가격안내</TitleStyle>
					<SubtitleStyle>
						우리 브랜드에 맞는 플랜을 자유롭게 선택해보세요.
					</SubtitleStyle>

					<ButtonBoxStyle>
						<GradientButton onClick={goToSignup}>
							30일 무료 체험 시작하기
						</GradientButton>

						<CapsuleButton onClick={openIntroductionInquiryModal}>
							도입 문의하기
						</CapsuleButton>
					</ButtonBoxStyle>
				</TitleArea>

				<AboutPriceAreaStyle>
					<PriceTitleBoxStyle>
						<PriceTitleLeftBoxStyle>
							<PriceTitleStyle>유료 플랜 안내</PriceTitleStyle>
							<PriceSubtitleStyle onClick={openPlanInfoModal}>
								발급량으로 플랜을 어떻게 정해요?
							</PriceSubtitleStyle>
						</PriceTitleLeftBoxStyle>

						<PriceTitleRightBoxStyle>
							<GreyTextStyle>월 결제</GreyTextStyle>
							<RedTextStyle>+20%</RedTextStyle>
							<ToggleStyle
								onClick={priceToggleHandler}
								isAnnualPayment={isAnnualPayment}
							/>
							<BlackTextStyle>연결제</BlackTextStyle>
						</PriceTitleRightBoxStyle>
					</PriceTitleBoxStyle>

					<PriceBoxStyle>
						{priceList.map(
							(
								{planName, planPrice, displayPrice, planLimit},
								idx
							) => (
								<PricePlanBoxStyle
									mainColor={
										idx === priceClickState
											? 'black'
											: 'grey'
									}
									onClick={() => cardClickHandler(idx)}
									key={`price-plan-box-${idx}`}>
									<img
										src={
											idx === priceClickState
												? imgGreenCheckTick
												: imgDefaultCheckTick
										}
										srcSet={
											idx === priceClickState
												? `${imgGreenCheckTick} 1x, ${imgGreenCheckTick2x} 2x`
												: `${imgDefaultCheckTick} 1x, ${imgDefaultCheckTick2x} 2x`
										}
										alt="check tick"
									/>
									<PriceInnerFlexBoxStyle>
										<h4>{planName}</h4>
										<p>발급량 {planLimit}개</p>
									</PriceInnerFlexBoxStyle>
									<PriceInnerPriceFlexBoxStyle>
										<h6>
											{isAnnualPayment
												? displayPrice
												: planPrice}
											만원
										</h6>
										<span>/월</span>
									</PriceInnerPriceFlexBoxStyle>
								</PricePlanBoxStyle>
							)
						)}

						<PricePlanBoxStyle
							mainColor="blue"
							onClick={openIntroductionInquiryModal}>
							<img
								src={imgBlueCheckTick}
								srcSet={`${imgBlueCheckTick} 1x, ${imgBlueCheckTick2x} 2x`}
								alt="check tick"
							/>
							<PriceInnerFlexBoxStyle>
								<h4>엔터프라이즈</h4>
								<p>발급량 1,000개 초과</p>
							</PriceInnerFlexBoxStyle>
							<PriceInnerPriceFlexBoxStyle>
								<h6>별도협의</h6>
							</PriceInnerPriceFlexBoxStyle>

							<button>도입문의</button>
						</PricePlanBoxStyle>
					</PriceBoxStyle>

					<PriceTaxTextStyle>
						모든 이용요금은 VAT(10%) 별도입니다.
					</PriceTaxTextStyle>
				</AboutPriceAreaStyle>
			</ContainerInnerStyle>
		</IntroContainerSectionStyle>
	);
}

export default PriceIntroSection;
