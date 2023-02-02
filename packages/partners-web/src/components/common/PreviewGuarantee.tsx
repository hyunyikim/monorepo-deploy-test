import React, {useCallback, useMemo, useState} from 'react';
import styled from '@emotion/styled';
import {Typography, Grid, Box} from '@mui/material';

import smallPhoneFrame from '@/assets/images/img_small_phone_frame.png';
import smallPhoneFrame2x from '@/assets/images/img_small_phone_frame@2x.png';

import greyArrowButton from '@/assets/icon/icon_grey_up_arrow_button_18@2x.png';
import Tab from '../atoms/Tab';

import {useGetPartnershipInfo} from '@/stores';
import {IcWarningTriangle} from '@/assets/icon';
import AtagComponent from '../atoms/AtagComponent';
import {textLineChangeHelper} from '@/utils/common.util';

type LogoProps = {
	logo: string | undefined;
};

const CARD_WIDTH = '166px';
const CARD_HEIGHT = '257px';

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
	max-width: ${CARD_WIDTH};
	max-height: ${CARD_HEIGHT};
	min-width: ${CARD_WIDTH};
	min-height: ${CARD_HEIGHT};
	border-radius: 10px;
`;

const ProductBoxStyle = styled.div`
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 1;
	background: #fff;
	border-radius: 16px;
`;

const ProductCardStyle = styled.img`
	position: absolute;
	width: 100%;
	height: 100%;
	z-index: 2;
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
	max-width: 120px;
`;

const LinkTextStyle = styled.h4`
	margin: 0;
	font-weight: 700;
	font-size: 14px;
	line-height: 19px;
	color: #526eff;
	max-width: 120px;
	text-decoration: underline;
	cursor: pointer;
`;

const DescTextStyle = styled.h4`
	margin: 0;
	font-weight: 500;
	font-size: 12px;
	line-height: 14px;
	color: #aeaeba;
`;

const UnRollButtonStyle = styled.img<{open: boolean}>`
	max-width: 18px;
	max-height: 18px;
	min-width: 18px;
	min-height: 18px;
	margin: 0;
	transition: all 0.25s ease-in-out;
	transform: ${(props) => (props.open ? 'rotate(0)' : 'rotate(-180deg)')};
	cursor: pointer;
`;

const HiddenBoxStyle = styled.div<{open: boolean}>`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 0;
	background: #222227;
	border-radius: 5px;
	transition: all 0.25s ease-in-out;
	${(props) => {
		if (props.open) {
			return {
				height: '100%',
				overflow: 'visible',
				paddingTop: '20px',
				marginTop: '20px',
				borderTop: '1px solid #47474F',
			};
		}
		return {
			height: '0px',
			overflow: 'hidden',
			paddingTop: '0',
		};
	}}
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
	certificationBrandName?: string;
	warrantyDate?: string;
	nftCustomField?: string[] | [];
	afterServiceInfo?: string | null;
	authInfo?: string;
	nftBackgroundImage?: string | ArrayBuffer | null;
	profileImage?: string | ArrayBuffer | null;
	returnInfo?: string | null;

	// 상품 정보
	productName?: string;
	price?: string;
	nftCustomFieldValue?: Record<string, any> | null;
	previewImage?: string;
	orderDate?: string;
	platformName?: string;
	orderId?: string;
	nftRequestId?: string;
	nftIssueDt?: string;
	categoryName?: string;
	modelNum?: string;

	// 유효하지 않는 카드 여부 ex) 삭제된 개런티
	isInvalidCard?: boolean;
};

interface GreyBoxProps {
	title: string;
	desc: string;
}

interface PreviewProps {
	values: ValueTypes;
	serviceCenterHandler?: () => void;
}

function GreyBoxComponent({title, desc}: GreyBoxProps) {
	const [open, setOpen] = useState(false);
	return (
		<GreyInfoBoxStyle
			style={{
				gap: '0',
			}}>
			<Grid
				container
				justifyContent="space-between" /* onClick={certificationBoxHandler} */
			>
				<TitleTextStyle>{title}</TitleTextStyle>

				<UnRollButtonStyle
					src={greyArrowButton}
					onClick={() => {
						setOpen((prev) => !prev);
					}}
					open={open}
				/>
			</Grid>
			<HiddenBoxStyle open={open} className="hidden-box">
				{desc ? (
					textLineChangeHelper(desc).map((line) => (
						<DescTextStyle>
							{line}
							<br />
						</DescTextStyle>
					))
				) : (
					<DescTextStyle>
						{'예시) 제품 구매 후 3년간 보증됩니다.'}
					</DescTextStyle>
				)}
				<DescTextStyle className="desc-text">{desc}</DescTextStyle>
			</HiddenBoxStyle>
		</GreyInfoBoxStyle>
	);
}

const InvalidCard = () => {
	return (
		<Box
			className="invalid-card flex-center"
			sx={{
				backgroundColor: '#FFFFFF99',
				position: 'absolute',
				zIndex: 3,
				width: CARD_WIDTH,
				height: CARD_HEIGHT,
				borderRadius: '10px',
				userSelect: 'none',
			}}>
			<Box
				className="flex-center"
				sx={{
					flexDirection: 'column',
					textAlign: 'center',
					width: '75px',
					height: '75px',
					borderRadius: '50%',
					backgroundColor: 'rgba(0, 0, 0, 0.7)',
					color: '#FFF',
					fontSize: 12,
					fontWeight: 700,
				}}>
				<IcWarningTriangle />
				유효하지 <br /> 않음
			</Box>
		</Box>
	);
};

const productImageRatio = 0.252;
const productBoxRatio = 0.252;

function PreviewGuarantee({values, serviceCenterHandler}: PreviewProps) {
	const {previewImage} = values;
	const {data: partnershipData} = useGetPartnershipInfo();
	const b2bType = useMemo(() => partnershipData?.b2bType, [partnershipData]);

	const productImageStyle = useMemo(() => {
		if (!partnershipData) {
			return {};
		}
		const {
			nftProductImageW,
			nftProductImageH,
			nftProductImageX,
			nftProductImageY,
		} = partnershipData;
		return {
			backgroundImage: `url('${previewImage || ''}')`,
			width: `${nftProductImageW * productImageRatio}px`,
			height: `${nftProductImageH * productImageRatio}px`,
			top: nftProductImageY?.includes('px')
				? `calc((${nftProductImageY} * ${productImageRatio}))`
				: nftProductImageY,
			left: nftProductImageX?.includes('px')
				? `calc(${nftProductImageX} * ${productImageRatio})`
				: nftProductImageX,
			...(nftProductImageY?.includes('%') && {
				marginTop: `-${(nftProductImageW * productImageRatio) / 2}px`,
			}),
			...(nftProductImageX?.includes('%') && {
				marginLeft: `-${(nftProductImageH * productImageRatio) / 2}px`,
			}),
		};
	}, [previewImage, partnershipData]);

	const productBoxStyle = useMemo(() => {
		if (!partnershipData) {
			return {};
		}

		const {nftProductBoxW, nftProductBoxH, nftProductBoxX, nftProductBoxY} =
			partnershipData;
		return {
			width: `${nftProductBoxW * productBoxRatio}px`,
			height: `${nftProductBoxH * productBoxRatio}px`,
			top: nftProductBoxY?.includes('px')
				? `calc(${nftProductBoxY} * ${productBoxRatio})`
				: nftProductBoxY,
			left: nftProductBoxX?.includes('px')
				? `calc(${nftProductBoxX} * ${productBoxRatio})`
				: nftProductBoxX,
			...(nftProductBoxY?.includes('%') && {
				marginTop: `-${(nftProductBoxW * productBoxRatio) / 2}px`,
			}),
			...(nftProductBoxX?.includes('%') && {
				marginLeft: `-${(nftProductBoxH * productBoxRatio) / 2}px`,
			}),
		};
	}, [partnershipData]);

	const handleClickCustomerCenter = useCallback(() => {
		if (serviceCenterHandler) {
			serviceCenterHandler();
			return;
		}
		const customerCenterUrl =
			partnershipData && partnershipData.customerCenterUrl;
		if (customerCenterUrl) {
			try {
				window.open(customerCenterUrl);
			} catch (e) {}
		}
	}, [partnershipData, serviceCenterHandler]);

	if (!partnershipData) {
		return <></>;
	}

	const isPriceFilled = () => {
		const price = values?.price;

		if (!price || price === '0원' || price === '0') {
			return false;
		}
		return true;
	};

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
								src={`${STATIC_URL}/files/nft/bg_nft_vircle_new.png`}
								alt="brand card"
							/>
						)}

						{/* 상품 이미지 */}
						{partnershipData.useNftProdImage &&
							values.previewImage && (
								<>
									{partnershipData?.useNftProdBox === 'Y' && (
										<ProductBoxStyle
											style={productBoxStyle}
											id="product-box-style"
										/>
									)}
									<ProductCardStyle
										id="product-card-style"
										src={values.previewImage}
										srcSet={`${values.previewImage} 1x, ${values.previewImage} 2x`}
										alt="product card"
										className={`brand-${
											partnershipData?.email || ''
										}`}
										style={productImageStyle}
									/>
								</>
							)}
						{values?.isInvalidCard && <InvalidCard />}
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
						{values?.productName || '상품명'}
					</Typography>
					<Typography
						variant="h6"
						fontSize={'14px'}
						color="white"
						fontWeight={700}
						lineHeight={'17px'}
						mb="26px">
						{isPriceFilled() ? values?.price : null}
					</Typography>

					<TabBoxStyle className="tabs">
						<TabStyle>보증정보</TabStyle>
					</TabBoxStyle>

					<Grid container flexDirection="column" gap="20px">
						<GreyInfoBoxStyle key="product-info">
							<Grid container flexWrap={'nowrap'} gap="10px">
								{/* 로고, 날짜 */}
								<LogoImgStyle
									logo={
										values?.profileImage &&
										values?.profileImage
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
										{values?.certificationBrandName ||
											'브랜드명'}
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
								// gap="11px"
								sx={{
									padding: '14px 16px 14px 18px',
									backgroundColor: 'grey.700',
									borderRadius: '8px',
								}}>
								<TitleTextStyle mb={'11px'}>
									보증기간
								</TitleTextStyle>
								{values?.warrantyDate ? (
									textLineChangeHelper(
										values?.warrantyDate
									).map((line) => (
										<DescTextStyle>
											{line}
											<br />
										</DescTextStyle>
									))
								) : (
									<DescTextStyle>
										{'예시) 제품 구매 후 3년간 보증됩니다.'}
									</DescTextStyle>
								)}
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
						{values?.categoryName && (
							<Grid
								container
								justifyContent={'space-between'}
								alignItems="flex-start">
								<DescTextStyle>카테고리</DescTextStyle>
								<TitleTextStyle>
									{values?.categoryName}
								</TitleTextStyle>
							</Grid>
						)}
						{values?.modelNum && (
							<Grid
								container
								justifyContent={'space-between'}
								alignItems="flex-start">
								<DescTextStyle>모델번호</DescTextStyle>
								<TitleTextStyle>
									{values?.modelNum}
								</TitleTextStyle>
							</Grid>
						)}
						{/* {values?.nftCustomField &&
							values?.nftCustomField.map((el: string) => {
								return (
									<Grid
										key={el}
										container
										justifyContent={'space-between'}
										alignItems="flex-start">
										<DescTextStyle>{el}</DescTextStyle>
										{String(
											values?.nftCustomFieldValue[el]
										).includes('http') ? (
											<AtagComponent
												url={
													values?.nftCustomFieldValue[
														el
													]
												}>
												<LinkTextStyle className="text-ellipsis">
													보러가기
												</LinkTextStyle>
											</AtagComponent>
										) : (
											<TitleTextStyle className="text-ellipsis">
												{(values?.nftCustomFieldValue &&
													values?.nftCustomFieldValue[
														el
													]) ??
													'-'}
											</TitleTextStyle>
										)}
									</Grid>
								);
							})} */}
						{values?.nftCustomField &&
							values?.nftCustomField.map((el: string) => (
								<Grid
									key={el}
									container
									justifyContent={'space-between'}
									alignItems="flex-start">
									<DescTextStyle>{el}</DescTextStyle>
									{String(
										values?.nftCustomFieldValue[
											el
										] as string
									).includes('http') ? (
										<AtagComponent
											url={
												values?.nftCustomFieldValue[el]
											}>
											<LinkTextStyle className="text-ellipsis">
												보러가기
											</LinkTextStyle>
										</AtagComponent>
									) : (
										<TitleTextStyle className="text-ellipsis">
											{(values?.nftCustomFieldValue &&
												values?.nftCustomFieldValue[
													el
												]) ??
												'-'}
										</TitleTextStyle>
									)}
								</Grid>
							))}
						{values?.orderDate && (
							<Grid
								container
								justifyContent={'space-between'}
								alignItems="flex-start">
								<DescTextStyle>주문일자</DescTextStyle>
								<TitleTextStyle>
									{values.orderDate}
								</TitleTextStyle>
							</Grid>
						)}
						{values?.orderId && (
							<Grid
								container
								justifyContent={'space-between'}
								alignItems="flex-start">
								<DescTextStyle>주문번호</DescTextStyle>
								<TitleTextStyle className="text-ellipsis">
									{values.orderId}
								</TitleTextStyle>
							</Grid>
						)}
						<Grid
							container
							justifyContent={'space-between'}
							alignItems="flex-start">
							<DescTextStyle>디지털 개런티 번호</DescTextStyle>
							<TitleTextStyle className="text-ellipsis">
								{values?.nftRequestId || '-'}
							</TitleTextStyle>
						</Grid>
						<Grid
							container
							justifyContent={'space-between'}
							alignItems="flex-start">
							<DescTextStyle>디지털 개런티 발급일</DescTextStyle>
							<TitleTextStyle>
								{values?.nftIssueDt || '-'}
							</TitleTextStyle>
						</Grid>
						{values?.platformName && (
							<Grid
								container
								justifyContent={'space-between'}
								alignItems="flex-start">
								<DescTextStyle>구입처</DescTextStyle>
								<TitleTextStyle className="text-ellipsis">
									{values.platformName}
								</TitleTextStyle>
							</Grid>
						)}
						<Grid
							container
							justifyContent={'space-between'}
							alignItems="flex-start">
							<DescTextStyle>
								{b2bType === 'brand'
									? '브랜드 소개'
									: '판매자 검증'}
							</DescTextStyle>
							<TitleTextStyle
								style={{
									maxWidth: '170px',
									fontSize: 14,
									fontWeight: 400,
									lineHeight: '16px',
								}}>
								{values?.authInfo ? (
									textLineChangeHelper(values?.authInfo).map(
										(line) => (
											<DescTextStyle>
												{line}
												<br />
											</DescTextStyle>
										)
									)
								) : (
									<DescTextStyle>{'-'}</DescTextStyle>
								)}
								{/* {values?.authInfo || '-'} */}
							</TitleTextStyle>
						</Grid>
						<ServiceCenterButtonStyle
							onClick={handleClickCustomerCenter}>
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
			<Grid container gap="10px" mb="40px">
				{guaranteeSample.map((el, idx) => (
					<Tab
						text={el.name}
						isActive={idx === exampleIdx}
						idx={idx}
						activeHandler={changeExample}
					/>
				))}
			</Grid>

			<Box className="flex-center">
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
			</Box>
		</>
	);
}

export default PreviewGuarantee;
