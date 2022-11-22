import React, {
	useState,
	useRef,
	ReactNode,
	useMemo,
	useEffect,
	KeyboardEvent,
} from 'react';
import {InputFormSection} from '@/features/setup/SetupGuarantee.page';

import styled from '@emotion/styled';
import style from '@/assets/styles/style.module.scss';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {guaranteeSchemaShape} from '@/utils/schema';

import {openParantModal} from '@/utils';
import {useModalStore, useGetPartnershipInfo, useMessageDialog} from '@/stores';
import {
	Box,
	Typography,
	Grid,
	useTheme,
	Input,
	InputLabel,
	Divider,
} from '@mui/material';

import CapsuleButton from '@/components/atoms/CapsuleButton';

import {Button, Dialog} from '@/components';

import {
	IcGreyArrowDown,
	IcChevronDown,
	IcLock,
	IcBin,
	exampleBrandIcon,
	exampleBrandIcon2x,
	plusInBlue,
	plusInBlue2x,
	bluePlus,
	bluePlus2x,
	blue100Plus,
	blue100Plus2x,
	tickInWhiteCircle,
	tickInWhiteCircle2x,
} from '@/assets/icon';

import {
	LogoImage2x,
	defaultLogoImg,
	defaultLogoImg2x,
	defaultErrorLogoImg2x,
	dashedLine,
	dashedLine2x,
	solidLine,
	solidLine2x,
} from '@/assets/images';

import InputWithLabel from '../../components/molecules/InputWithLabel';
import ControlledInputComponent from '../../components/molecules/ControlledInputComponent';
import TooltipComponent from '../../components/atoms/Tooltip';
import InputLabelTag from '../../components/atoms/InputLabelTag';
import Tab from '../../components/atoms/Tab';
import {FileData, FileDataPreview} from '@/@types';
import PreviewGuarantee, {
	ExamplePreviewGuarantee,
} from '@/components/common/PreviewGuarantee';
import {
	setGuaranteeInformation,
	setCustomizedBrandCard,
} from '@/api/guarantee.api';
import {CARD_DESIGN_GUIDE_LINK} from '@/data';
import {goToParentUrl} from '@/utils';

import smallPhoneFrame from '@/assets/images/img_small_phone_frame.png';
import smallPhoneFrame2x from '@/assets/images/img_small_phone_frame@2x.png';
import massadoptionBrandCard from '@/assets/images/img_massadoption_brand_card.png';
import massadoptionBrandCard2x from '@/assets/images/img_massadoption_brand_card@2x.png';

type BoldTextProps = {
	underline?: boolean | undefined;
};

const PlusInBlueStyle = styled('img')`
	position: absolute;
	right: -5px;
	bottom: 0;
	cursor: pointer;
`;

const AvatarStyle = styled('img')`
	border-radius: 50%;
	background-color: white;
	cursor: pointer;
	width: 78px;
	height: 78px;
`;

const FullFormStyled = styled('form')`
	width: 100%;
	max-width: 800px;
`;

const FileInputStyle = styled('input')`
	display: none;
`;

const BoxContainerSuccessLabel = styled('div')`
	background-color: #edf9f7;
	color: #00c29f;
	padding: 0px 12px;
	height: 26px;
	border-radius: 4px;
	font-weight: 700;
	font-size: 14px;
	line-height: 26px;
`;

const BoxContainerFailLabel = styled('div')`
	background-color: #fff2f3;
	color: #f8434e;
	padding: 0px 12px;
	height: 26px;
	border-radius: 4px;
	font-weight: 700;
	font-size: 14px;
	line-height: 26px;
`;

const UploadBrandCardDesignStyle = styled('div')`
	background-color: white;
	width: 252px;
	height: 395px;
	border: 2px dashed #d6dcff;
	border-radius: 16px;
`;

const UploadPlusButtonStyle = styled('img')`
	display: block;
	width: 56px;
	height: 56px;
	position: absolute;
	left: 0;
	right: 0;
	margin: auto;
	top: calc(100% - 198px - 28px);
`;

const AvatarCardStyle = styled('img')`
	border-radius: 16px;
	cursor: pointer;
	width: 252px;
	height: 395px;
`;

const UlStyle = styled('ul')`
	padding-left: 20px;
`;

const BulletListStyle = styled('li')`
	color: '#aeaeba';
	font-size: '16px';
	font-weight: 500;
	line-height: '24px';
`;

const ProgressCircleStyle = styled('div')`
	width : 40px;
	height : 40px;
	border-radius : 50%;
	position : relative;
	background: rgba(255, 255, 255, 0.4);
	
	&:before {
		content : '';
		background: white;
		display : 'block';
		width : 18px;
		height : 18px;
		border-radius : 50%;
		position : absolute;
		left : 0;
		right : 0;
		top : 11px;
		margin : auto;
	},
`;

const EmphtyProgressCircleStyle = styled('div')`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	position: relative;
	background: transparents;
	border: 3px solid rgba(255, 255, 255, 0.4);
`;

const DashedLineStyle = styled('img')`
	position: absolute;
	right: -76px;
	top: 20px;
	margin: auto;
`;

const SolidLineStyle = styled('img')`
	position: absolute;
	right: -76px;
	top: 20px;
	margin: auto;
`;

const TipTextStyle = styled('div')`
	color: white;
	font-size: 20px;
	font-weight: 500;
	line-height: 24px;
	display: inline;
`;

const TipBoldTextStyle = styled('div')<BoldTextProps>`
	color: white;
	font-size: 20px;
	font-weight: 700;
	line-height: 24px;
	display: inline;
	text-decoration: ${(props) => (props.underline ? 'underline' : 'none')};
`;

const LinkStyle = styled('a')`
	text-decoration: none;
`;

interface BoxContainerProps {
	children: ReactNode;
	isOpen: boolean;
	title: string;
	isFilled?: boolean;
	useLabel?: boolean;
	openHandler: () => void;
}
interface CategoryContainerProps {
	required: boolean;
	category: string;
	exampleIdx: number;
	sx?: object;
	clickHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

const brandCategoryRequiredList = ['상품명', '보증기간'];
const categoryRequiredList = ['상품금액', '브랜드', '카테고리'];

const categoryExampleList = [
	['소재', '사이즈', '중량(무게)', '색상'],
	['사이즈', '원단', '색상', '모델번호'],
	['사이즈', '소재', '모델번호'],
	['사이즈', '무게', '색상', '모델번호'],
];

/**
 * 카드 디자인 가이드 보기
 */
const openCustomizedCardDesign = () => {
	window.open(CARD_DESIGN_GUIDE_LINK);
};

function BoxContainer({
	children,
	isOpen,
	title,
	useLabel,
	isFilled,
	openHandler,
}: BoxContainerProps) {
	return (
		<Box
			sx={{
				border: '1px solid #E2E2E9',
				borderRadius: '16px',
				padding: '30px 26px 30px 30px',
				width: '100%',
				marginBottom: '24px',
				maxWidth: '800px',
			}}>
			<Grid
				container
				justifyContent="space-between"
				alignItems="center"
				sx={{paddingBottom: isOpen ? '40px' : 0}}>
				<Grid
					container
					flexWrap="nowrap"
					width="auto"
					alignItems={'center'}
					gap="12px">
					<Typography component="h4" className="sub-head-1">
						{title}
					</Typography>
					{useLabel &&
						(isFilled ? (
							<BoxContainerSuccessLabel>
								입력완료
							</BoxContainerSuccessLabel>
						) : (
							<BoxContainerFailLabel>
								미입력
							</BoxContainerFailLabel>
						))}
				</Grid>
				<IcGreyArrowDown
					onClick={openHandler}
					style={{
						transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
						transition: 'all 250ms linear',
					}}
				/>
				{/* <IcChevronDown style={{fill: 'rgba(42,169,224, 0.2)'}} fill="rgb(42,169,224)"/> */}
			</Grid>

			{isOpen && children}
		</Box>
	);
}

function CategoryContainer({
	required = false,
	category,
	clickHandler,
	exampleIdx,
	sx,
}: CategoryContainerProps) {
	const containerSx = useMemo(() => {
		switch (required) {
			case true:
				return {
					backgroundColor: 'grey.50',
				};
			default:
				return {
					backgroundColor: 'white',
				};
		}
	}, [required]);

	return (
		<Grid
			container
			justifyContent={'space-between'}
			sx={{
				// backgroundColor: 'grey.50',
				color: 'grey.100',
				border: '1px solid',
				borderColor: 'grey.100',
				borderRadius: '6px',
				padding: '12px',
				paddingLeft: '16px',
				maxHeight: '48px',
				...containerSx,
				...sx,
			}}>
			<Typography
				variant="h6"
				sx={{
					color: required ? 'grey.300' : 'grey.900',
					fontWeight: 500,
					fontSize: '14px',
					display: 'flex',
					gap: '2px',
				}}>
				{category}
				{required && (
					<Typography variant="body1" color={'red.main'}>
						{' '}
						*
					</Typography>
				)}
			</Typography>
			<Box sx={{position: 'relative'}}>
				<Divider
					orientation="vertical"
					sx={{
						height: '36px',
						position: 'absolute',
						left: '-12px',
						top: '-6px',
					}}
				/>
				{required ? (
					<IcLock />
				) : (
					<IcBin
						color={style.vircleGrey900}
						style={{cursor: 'pointer'}}
						data-exampleidx={exampleIdx}
						onClick={clickHandler}
					/>
				)}
			</Box>
		</Grid>
	);
}

function SetupGuarantee() {
	const [boxIndexState, setBoxIndexState] = useState<number>(0);
	/**
	 * 폼 인풋 박스 오픈 핸들러
	 *
	 * @param _index
	 */
	const boxOpenHandler = (_index: number) => {
		if (boxIndexState === _index) {
			setBoxIndexState(_index);
		} else {
			setBoxIndexState(_index);
		}
	};

	const justOpenBox = (_idx: number) => {
		setBoxIndexState(_idx);
	};

	return (
		<InputFormSection
			boxIndexState={boxIndexState}
			boxOpenHandler={boxOpenHandler}
			justOpenBox={justOpenBox}
		/>
	);
}

export default SetupGuarantee;
