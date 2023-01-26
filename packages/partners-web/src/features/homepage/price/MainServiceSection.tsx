import React from 'react';
import styled from '@emotion/styled';
import {css, keyframes} from '@emotion/react';
import {
	mainService1,
	mainService2,
	mainService3,
	mainService4,
} from '@/assets/images/index';

const MainServiceContainer = styled('section')`
	padding: 120px 0px 60px;
	background: #f7f8fe;

	@media (max-width: 1200px) {
		padding: 120px 80px 60px;
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
	/* align-items: center; */
`;
const TitleStyle = styled('h1')`
	font-weight: 700;
	font-size: 46px;
	line-height: 55px;
	color: #222227;
	margin: 0;
	margin-bottom: 24px;

	@media (max-width: 820px) {
		font-size: 36px;
		line-height: 43px;
	}

	@media (max-width: 480px) {
		margin-bottom: 16px;
		font-size: 21px;
		line-height: 25px;
	}
`;

const SubtitleBoxStyle = styled('div')`
	display: flex;
	flex-direction: row;
	margin-bottom: 64px;

	@media (max-width: 820px) {
		flex-direction: column;
	}
	@media (max-width: 480px) {
		margin-bottom: 20px;
	}
`;

const SubtitleStyle = styled('span')`
	font-weight: 500;
	font-size: 24px;
	line-height: 29px;
	color: #222227;
	margin: 0;
	margin-bottom: 0px;
	/* display: inline; */

	@media (max-width: 820px) {
		font-size: 18px;
		line-height: 22px;
		margin-bottom: 0px;
		display: block;
	}

	@media (max-width: 480px) {
		margin-bottom: 0px;
		font-size: 13px;
		line-height: 16px;
	}
`;

const MainServiceCardBoxStyle = styled('div')`
	display: flex;
	flex-wrap: wrap;
	gap: 40px;
	/* flex-direction: column; */
	/* align-items: center; */

	@media (max-width: 1200px) {
		justify-content: center;
	}
	@media (max-width: 820px) {
	}
	/* @media (max-width: 480px) {
		padding: 60px 24px;
	} */
`;
const MainServiceCardStyle = styled('div')`
	flex: 1 1 auto;
	max-width: 580px;
	max-height: 545px;
	width: 100%;
	height: 100%;
	margin-bottom: 100px;

	display: flex;
	flex-direction: column;

	img {
		margin-bottom: 24px;
	}

	h3 {
		font-weight: 700;
		font-size: 36px;
		line-height: 43px;
		color: #222227;
		margin: 0;
		margin-bottom: 20px;
	}
	h6 {
		font-weight: 500;
		font-size: 24px;
		line-height: 29px;

		color: #5c5c65;
		margin: 0;
	}

	@media (max-width: 1200px) {
		flex: 0.5 0.5 auto;
		max-width: 480px;

		img {
		}

		h3 {
			font-size: 30px;
			line-height: 36px;
		}
		h6 {
			font-size: 20px;
			line-height: 25px;
		}
	}

	@media (max-width: 820px) {
		margin-bottom: 50px;
	}

	@media (max-width: 480px) {
		margin-bottom: 0px;
		max-width: none;

		img {
			margin-bottom: 16px;
		}

		h3 {
			font-size: 18px;
			line-height: 22px;
			margin-bottom: 12px;
		}
		h6 {
			margin-bottom: 0px;
			font-size: 14px;
			line-height: 17px;
		}
	}
`;

function MainServiceSection() {
	const mainServiceCardList = [
		{
			title: '나만의 개런티 디자인',
			desc: '나만의 브랜드의 정체성이 담긴 이미지나 동영상 등을 통해 고객에게 브랜드를 각인시킬 수 있습니다.',
			img: mainService1,
		},
		{
			title: '기존에 사용하던 툴과 쉬운 연동',
			desc: '카페24, 카카오톡 플러스 친구, 채널 등 다양한 툴과의 연동을 통해 더 쉽게 버클을 사용할 수 있습니다.',
			img: mainService2,
		},
		{
			title: '흩어진 데이터를 한곳에서 관리',
			desc: '디지털 개런티를 발급받은 고객들의 데이터를 고객별/상품별로 분류하여 관리 할 수 있습니다.',
			img: mainService3,
		},
		{
			title: '기술안내 문서 제공',
			desc: 'API,모바일앱 SDK 등 자사 개발자를 위한 기술안내 문서를 제공합니다.',
			img: mainService4,
		},
	];
	return (
		<MainServiceContainer>
			<ContainerInnerStyle>
				<TitleStyle>핵심 서비스</TitleStyle>

				<SubtitleBoxStyle>
					<SubtitleStyle>
						고객관리부터 사후관리/멤버십을&nbsp;
					</SubtitleStyle>
					<SubtitleStyle>
						통해 유저와의 점접 만들기까지 지금 바로 이용하세요!
					</SubtitleStyle>
				</SubtitleBoxStyle>

				<MainServiceCardBoxStyle>
					{mainServiceCardList.map(({title, desc, img}, idx) => (
						<MainServiceCardStyle>
							<img src={img} alt={`service${idx + 1}`} />
							<h3>{title}</h3>
							<h6>{desc}</h6>
						</MainServiceCardStyle>
					))}
				</MainServiceCardBoxStyle>
			</ContainerInnerStyle>
		</MainServiceContainer>
	);
}

export default MainServiceSection;
