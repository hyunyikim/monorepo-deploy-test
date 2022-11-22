import React, {useState} from 'react';
import styled from '@emotion/styled';
import {
	Box,
	Typography,
	Grid,
	useTheme,
	// Button,
	Input,
	InputLabel,
	Divider,
} from '@mui/material';

import smallPhoneFrame from '@/assets/images/img_small_phone_frame.png';
import smallPhoneFrame2x from '@/assets/images/img_small_phone_frame@2x.png';
import massadoptionBrandCard from '@/assets/images/img_massadoption_brand_card.png';
import massadoptionBrandCard2x from '@/assets/images/img_massadoption_brand_card@2x.png';

import greyArrowButton from '@/assets/icon/icon_grey_up_arrow_button_18@2x.png';
import Tab from '../atoms/Tab';

type LogoProps = {
	logo: string | undefined;
};

const PreviewContainerStyle = styled.div`
	position: relative;
	max-width: 296px;
	max-height: 610px;
	min-width: 296px;
	min-height: 610px;
`;

const PhoneFrameStyle = styled.img`
	filter: drop-shadow(0px 16.3531px 13.0825px rgba(0, 0, 0, 0.0655718))
		drop-shadow(0px 9.16744px 7.33395px rgba(0, 0, 0, 0.055))
		drop-shadow(0px 4.86876px 3.89501px rgba(0, 0, 0, 0.0444282))
		drop-shadow(0px 2.026px 1.6208px rgba(0, 0, 0, 0.030926));
	width: 100%;
	height: 100%;
`;

const PreviewBoxStyle = styled.div`
	position: absolute;
	top: 40px;
	left: 0;
	right: 0;
	margin: auto;
	width: calc(100% - 20px);
	height: calc(100% - 40px);
	background: #000000;
	border-radius: 0 0 44px 44px;
	overflow: scroll;
	scrollbar-width: none;
	&::-webkit-scrollbar {
		display: none;
	}
	padding-bottom: 8px;
`;

const PreviewInnerStyle = styled.div`
	padding: 0 17px 20px;
`;

const BrandCardBoxStyle = styled.div`
	position: relative;
	width: 100%;
	height: auto;
	display: flex;
	justify-content: center;
	margin: 58px 0 40px;
`;

const BrandCardStyle = styled.img`
	max-width: 166px;
	max-height: 257px;
	min-width: 166px;
	min-height: 257px;
	border-radius: 10px;
`;

const TabBoxStyle = styled.ul`
	list-style: none;
	margin: 0 0 29px;
	padding: 0;
	border-bottom: solid 1px #3339;
`;

const TabStyle = styled.li`
	display: inline-block;
	margin-bottom: -1px;
	padding-bottom: 6px;
	border-bottom: solid 2px #fff;
	display: inline-block;
	font-weight: 700;
	font-size: 16px;
	line-height: 28px;
	color: white;
`;

const LogoImgStyle = styled.div<LogoProps>`
	min-width: 27px;
	min-height: 27px;
	max-width: 27px;
	max-height: 27px;
	border-radius: 50%;
	background: ${(props) =>
		props.logo ? `url(${props.logo}) no-repeat center` : '#f2f2f2'};
	background-size: cover;
`;

const GreyInfoBoxStyle = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 16px;
	background: #222227;
	border-radius: 5px;
`;

const TitleTextStyle = styled.h4`
	margin: 0;
	font-weight: 700;
	font-size: 14px;
	line-height: 19px;
	color: #ffffff;
`;

const DescTextStyle = styled.h4`
	margin: 0;
	font-weight: 500;
	font-size: 12px;
	line-height: 14px;
	color: #aeaeba;
`;

const UnRollButtonStyle = styled.img`
	max-width: 18px;
	maxheight: 18px;
	min-width: 18px;
	minheight: 18px;
	margin: 0;
	transform: rotate(180deg);
`;

const HiddenBoxStyle = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 0;
	background: #222227;
	border-radius: 5px;
`;

const ServiceCenterButtonStyle = styled.div`
	height: 40px;
	font-weight: 700;
	font-size: 14px;
	line-height: 40px;
	text-align: center;
	color: #ffffff;

	padding: 0;
	border: 1px solid #5c5c65;
	border-radius: 8px;
	cursor: pointer;
	margin: 40px 0 20px;
`;

type ValueTypes = {
	brandName?: string;
	brandNameEN?: string;
	warrantyDate?: string;
	nftCustomField?: string[] | [];
	afterServiceInfo?: string;
	authInfo?: string;
	customerCenterUrl?: string;
	'newCustomField-6'?: string;
	'newCustomField-7'?: string;
	nftBackgroundImage?: string | ArrayBuffer | null;
	profileImage?: string | ArrayBuffer | null;
	returnInfo?: string;
};

interface GreyBoxProps {
	title: string;
	desc: string;
	key: string;
}

interface PreviewProps {
	values: ValueTypes;
	serviceCenterHandler: () => void;
}

function GreyBoxComponent({title, desc, key}: GreyBoxProps) {
	return (
		<GreyInfoBoxStyle>
			<Grid
				container
				justifyContent="space-between" /* onClick={certificationBoxHandler} */
			>
				<TitleTextStyle>{title}</TitleTextStyle>

				<UnRollButtonStyle src={greyArrowButton} />
			</Grid>

			<HiddenBoxStyle>
				<DescTextStyle>{desc}</DescTextStyle>
			</HiddenBoxStyle>
		</GreyInfoBoxStyle>
	);
}

function PreviewGuarantee({values, serviceCenterHandler}: PreviewProps) {
	return (
		<PreviewContainerStyle>
			<PhoneFrameStyle
				src={smallPhoneFrame}
				srcSet={`${smallPhoneFrame} 1x, ${smallPhoneFrame2x} 2x`}
				alt="phone frame"
			/>

			<PreviewBoxStyle>
				<PreviewInnerStyle>
					<BrandCardBoxStyle>
						{values.nftBackgroundImage ? (
							<BrandCardStyle
								src={values.nftBackgroundImage as string}
								srcSet={`${
									values.nftBackgroundImage as string
								} 1x, ${
									values.nftBackgroundImage as string
								} 2x`}
								alt="brand card"
							/>
						) : (
							<BrandCardStyle
								src={massadoptionBrandCard}
								srcSet={`${massadoptionBrandCard} 1x, ${massadoptionBrandCard2x} 2x`}
								alt="brand card"
							/>
						)}
					</BrandCardBoxStyle>

					<Typography
						variant="h6"
						fontSize={'10px'}
						color="grey.500"
						fontWeight={700}
						lineHeight={'17px'}
						mb="5.5px">
						{values.brandNameEN || '브랜드명'}
					</Typography>
					<Typography
						variant="h4"
						fontSize={'16px'}
						color="white"
						fontWeight={700}
						lineHeight={'21px'}
						mb="8.5px">
						{'상품명'}
					</Typography>
					<Typography
						variant="h6"
						fontSize={'14px'}
						color="white"
						fontWeight={700}
						lineHeight={'17px'}
						mb="26px">
						{'0,000,000원'}
					</Typography>

					<TabBoxStyle className="tabs">
						<TabStyle>보증정보</TabStyle>
					</TabBoxStyle>

					<Grid container flexDirection="column" gap="20px">
						<GreyInfoBoxStyle key={'afterServiceInfo'}>
							<Grid container flexWrap={'nowrap'} gap="10px">
								{/* 로고, 날짜 */}
								<LogoImgStyle
									logo={
										values?.profileImage &&
										(values?.profileImage as string)
									}
								/>
								<Grid container flexDirection={'column'}>
									<Typography
										variant="h6"
										fontSize={'12px'}
										color="white"
										fontWeight={700}
										lineHeight={'15px'}
										mb="3.5px">
										{values?.brandNameEN || '브랜드명'}
									</Typography>
									<Typography
										variant="h6"
										fontSize={'8px'}
										color="grey.400"
										fontWeight={500}
										lineHeight={'10px'}>
										{new Date()
											.toLocaleDateString()
											.replace(/\ /g, '')}
									</Typography>
								</Grid>
							</Grid>

							<Grid
								container
								flexDirection="column"
								gap="11px"
								sx={{
									padding: '14px 16px 14px 18px',
									backgroundColor: 'grey.700',
									borderRadius: '8px',
								}}>
								<TitleTextStyle>보증기간</TitleTextStyle>

								<DescTextStyle>
									{values?.warrantyDate ||
										'예시) 제품 구매 후 3년간 보증됩니다.'}
								</DescTextStyle>
							</Grid>
						</GreyInfoBoxStyle>

						<GreyBoxComponent
							title={'교환 및 반품 안내'}
							desc={
								values?.returnInfo
									? values?.returnInfo
									: '예시 : 교환/환불이 불가능한 경우 개별 주문 제작의 경우, 주문 취소 및 환불이 불가합니다. 사전에 안내된 생산완료 예정일 기준 3주전에는 모델 및 색상변경이 불가합니다. 본 제품의 하자가 아닌 가구 소재의 특성에 대한 변심은 교환/환불이 불가합니다.'
							}
							key={'returnInfo'}
						/>
						<GreyBoxComponent
							title={'A/S 주의사항'}
							desc={
								values?.afterServiceInfo
									? values?.afterServiceInfo
									: '제품 하자 관련 무상 A/S 기간은 제품별로 상이합니다.'
							}
							key={'afterServiceInfo'}
						/>

						{values?.nftCustomField.map((el: string) => (
							<Grid
								container
								justifyContent={'space-between'}
								alignItems="center">
								<DescTextStyle>{el}</DescTextStyle>
								<TitleTextStyle>{'-'}</TitleTextStyle>
							</Grid>
						))}

						<ServiceCenterButtonStyle
							onClick={serviceCenterHandler}>
							고객센터
						</ServiceCenterButtonStyle>
					</Grid>
				</PreviewInnerStyle>

				<Grid
					container
					flexDirection={'column'}
					sx={{
						backgroundColor: 'grey.900',
						padding: '32px 24px 60px',
						borderRadius: '0 0 32px 32px',
					}}>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '14px',
							lineHeight: '24px',
							color: '#898989',
						}}>
						유의사항
					</Typography>
					<DescTextStyle>
						타인에게 보증서와 제품을 양도할 시, 반드시 수령한 제품과
						함께 양도해 주세요. 버클은 관련 분쟁 발생 시 법적 책임이
						없음을 안내 드립니다.
					</DescTextStyle>
				</Grid>
			</PreviewBoxStyle>
		</PreviewContainerStyle>
	);
}

const ExampleImgStyle = styled.img`
	position: absolute;
	top: -26px;
	left: 0;
	right: 0;
	margin: auto;
	width: 100%;
	padding-bottom: 8px;
`;

const guaranteeSample = [
	{
		name: '명품/플랫폼',
		src: 'img_guarantee_card_sample_platform.png',
	},
	{
		name: '쥬얼리',
		src: 'img_guarantee_card_sample_jewellery.png',
	},
	{
		name: '패션의류',
		src: 'img_guarantee_card_sample_fashion.png',
	},
	{
		name: '패선잡화',
		src: 'img_guarantee_card_sample_accessory.png',
	},
];

export function ExamplePreviewGuarantee() {
	const [exampleIdx, setExampleIdx] = useState<number>(0);

	const changeExample = (e: React.ChangeEvent<HTMLInputElement>) => {
		const targetIdx = e.target.dataset.tabidx;
		setExampleIdx(Number(targetIdx));
	};

	return (
		<>
			<Grid container gap="10px" mb="44px">
				{guaranteeSample.map((el, idx) => (
					<Tab
						text={el.name}
						isActive={idx === exampleIdx}
						idx={idx}
						activeHandler={changeExample}
					/>
				))}
			</Grid>

			<PreviewContainerStyle>
				<PhoneFrameStyle
					src={smallPhoneFrame}
					srcSet={`${smallPhoneFrame} 1x, ${smallPhoneFrame2x} 2x`}
					alt="phone frame"
				/>

				<PreviewBoxStyle>
					<ExampleImgStyle
						src={`${STATIC_URL}/files/img/${guaranteeSample[exampleIdx]?.src}`}
						alt={`example-${exampleIdx}`}
					/>
				</PreviewBoxStyle>
			</PreviewContainerStyle>
		</>
	);
}

export default PreviewGuarantee;
