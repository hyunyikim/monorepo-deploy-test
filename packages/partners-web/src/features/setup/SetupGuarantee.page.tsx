import React, {
	useState,
	useRef,
	ReactNode,
	useMemo,
	useEffect,
	KeyboardEvent,
} from 'react';
import styled from '@emotion/styled';
import style from '@/assets/styles/style.module.scss';

import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {guaranteeSchemaShape} from '@/utils/schema';

import {useModalStore, useGetPartnershipInfo, useMessageDialog} from '@/stores';
import {Box, Typography, Grid, Divider} from '@mui/material';

import CapsuleButton from '@/components/atoms/CapsuleButton';

import {Button} from '@/components';

import {
	IcGreyArrowDown,
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
import {goToParentUrl, updateParentPartnershipData} from '@/utils';
import Header from '@/components/common/layout/Header';
import {useLocation} from 'react-router-dom';

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
	width: 40px;
	height: 40px;
	border-radius: 50%;
	position: relative;
	background: rgba(255, 255, 255, 0.4);

	&:before {
		content: '';
		background: white;
		display: 'block';
		width: 18px;
		height: 18px;
		border-radius: 50%;
		position: absolute;
		left: 0;
		right: 0;
		top: 11px;
		margin: auto;
	}
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
	hasProfileLogo?: string;
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
interface InputFormProps {
	boxIndexState: number;
	boxOpenHandler: (_idx: number) => void;
	justOpenBox: (_idx: number) => void;
}

interface ParsedQueryProps {
	state?: string;
	code?: string;
}

const tabList = ['쥬얼리', '패션의류', '가구', '전자기기'];

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
	hasProfileLogo,
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

				{!hasProfileLogo && (
					<IcGreyArrowDown
						onClick={openHandler}
						style={{
							transform: isOpen
								? 'rotate(180deg)'
								: 'rotate(0deg)',
							transition: 'all 250ms linear',
						}}
					/>
				)}
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

function VideoInformationSection({boxIndexState}: {boxIndexState: number}) {
	const video = useMemo(() => {
		const result = `${STATIC_URL}/files/video/video_setup_guarantee_${
			boxIndexState + 1
		}.mp4`;
		return result;
	}, [boxIndexState]);

	const tipText = useMemo(() => {
		let result;

		switch (boxIndexState) {
			case 0:
				result = (
					<TipTextStyle>
						{`고객센터는 브랜드의 카카오톡 채널에서 더보기 > URL 복사하기를 선택하신 후에 개런티 설정의 고객센터 영역에 입력해주세요!`}
					</TipTextStyle>
				);
				break;
			case 1:
				result = (
					<TipTextStyle>
						개런티 카드에 어떤 정보를 개런티카드에 노출할지 설정하는
						단계입니다.
						<br />
						<TipBoldTextStyle>
							상품명과 보증기간 두가지의 필수정보 이외에 브랜드의
							상품에 필요한 정보들을 자유롭게 추가해주세요!
						</TipBoldTextStyle>
					</TipTextStyle>
				);
				break;
			case 2:
				result = (
					<TipTextStyle>
						브랜드의 이미지를 개런티카드에 제작 해보세요! <br />
						이미지를 업로드해 개런티 카드의 배경 이미지를 자유롭게
						변경할 수 있습니다.
						<br />
						<TipBoldTextStyle underline={true}>
							개런티제작가이드를{' '}
						</TipBoldTextStyle>
						참고해 개런티카드를 제작 해보세요!
					</TipTextStyle>
				);
				break;
			case 3:
				result = (
					<TipTextStyle>
						개런티 카드에 추가로 노출 될 정보를 입력해주세요.
						<br />
						<TipBoldTextStyle underline={true}>
							교환 및 반품안내, A/S 주의사항
						</TipBoldTextStyle>
						과 같이 사후관리와 관련된 정보들을 입력해주시면 개런티가
						발급되었을때 고객과의 접점을 확보할 수 있어요!
					</TipTextStyle>
				);
				break;
			default:
				result = <></>;
				break;
		}

		return result;
	}, [boxIndexState]);

	return (
		<Grid
			item
			container
			minWidth="662px"
			maxWidth="662px"
			sx={{position: 'relative' /* zIndex : 1300 */}}>
			<Box sx={{position: 'fixed', left: 0, top: 0}}>
				<Grid
					container
					gap="83px"
					sx={{position: 'absolute', top: '115px', left: '47px'}}>
					{Array(4)
						.fill('')
						.map((el, idx) =>
							idx > boxIndexState ? (
								<Box
									sx={{position: 'relative'}}
									key={`progress-circle-${idx}`}>
									<EmphtyProgressCircleStyle />
									{idx !== 3 && (
										<DashedLineStyle
											src={dashedLine}
											srcSet={`${dashedLine} 1x, ${dashedLine2x} 2x`}
										/>
									)}
								</Box>
							) : idx === boxIndexState ? (
								<Box
									sx={{position: 'relative'}}
									key={`progress-circle-${idx}`}>
									<ProgressCircleStyle />
									{idx !== 3 && (
										<DashedLineStyle
											src={dashedLine}
											srcSet={`${dashedLine} 1x, ${dashedLine2x} 2x`}
										/>
									)}
								</Box>
							) : (
								<Box
									sx={{position: 'relative'}}
									key={`progress-circle-${idx}`}>
									<img
										src={tickInWhiteCircle}
										srcSet={`${tickInWhiteCircle} 1x, ${tickInWhiteCircle2x} 2x`}
										alt="completed"
									/>
									{idx !== 3 && (
										<SolidLineStyle
											src={solidLine}
											srcSet={`${solidLine} 1x, ${solidLine2x} 2x`}
										/>
									)}
								</Box>
							)
						)}
				</Grid>

				<Box
					sx={{
						minWidth: '660px',
						minHeight: '786px',
						// height : '986px'
					}}>
					<video
						autoPlay
						muted
						playsInline
						loop
						src={video}
						// type="video/mp4"
					/>
				</Box>

				<Grid
					container
					flexDirection="column"
					sx={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: '55px',
						margin: 'auto',
						background: 'rgba(0, 0, 0, 0.4)',
						backdropFilter: 'blur(15px)',
						borderRadius: '16px',
						padding: '22px 24px',
						maxWidth: 'calc(100% - 110px)',
					}}>
					<Typography
						variant="h4"
						sx={{
							color: 'white',
							fontSize: '20px',
							fontWeight: 700,
							lineHeight: '24px',
							marginBottom: '16px',
						}}>
						버클TIP
					</Typography>
					{tipText}
				</Grid>
			</Box>
		</Grid>
	);
}

export function InputFormSection({
	boxIndexState,
	boxOpenHandler,
	justOpenBox,
}: InputFormProps) {
	const {
		handleSubmit,
		watch,
		setError,
		clearErrors,
		control,
		reset,
		getValues,
		formState: {errors},
	} = useForm({
		resolver: yupResolver(guaranteeSchemaShape),
		mode: 'onChange',
	});

	const location = useLocation();
	const parsedQuery: ParsedQueryProps | undefined = location.state?.query;

	const [brandLogo, setBrandLogo] = useState<FileData>({
		file: null,
	});
	const [brandLogoError, setBrandLogoError] = useState<boolean>(false);
	const [brandLogoPreview, setBrandLogoPreview] = useState<FileDataPreview>({
		preview: null,
	});

	const [brandCard, setBrandCard] = useState<FileData>({
		file: null,
	});

	const [brandCardPreview, setBrandCardPreview] = useState<FileDataPreview>({
		preview: null,
	});

	const [tooltipState, setTooltipState] = useState<boolean>(true);

	const logoInputFile =
		React.useRef() as React.MutableRefObject<HTMLInputElement>;
	const brandInputFile =
		React.useRef() as React.MutableRefObject<HTMLInputElement>;

	const [tabState, setTabState] = useState<number>(0);
	const [exampleList, setExampleList] = useState<string[]>([]);
	const [isAdding, setIsAdding] = useState<boolean>(false);
	const {setOpen, setModalOption} = useModalStore((state) => state);
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const {data} = useGetPartnershipInfo();
	const b2bType = data?.b2bType; // cooperator or brand
	const maximumAdditionalCategory = b2bType === 'brand' ? 6 : 3;
	const hasProfileLogo = data?.profileImage;

	/**
	 * 파일 선택 이벤트
	 *
	 * @param e
	 */
	const handleAttachFile = (e: React.FormEvent<HTMLInputElement>) => {
		const targetName = (e.currentTarget as HTMLInputElement).name;
		const files = (e.currentTarget as HTMLInputElement).files as FileList;
		const currentFile: File = files[0];

		const reader = new FileReader();
		reader.onloadend = () => {
			if (currentFile) {
				const newFile = {
					file: currentFile,
				};

				if (targetName === 'brandCard') {
					setBrandCard(newFile);
					setBrandCardPreview({
						preview: reader.result,
					});
				} else {
					setBrandLogo(newFile);
					setBrandLogoPreview({
						preview: reader.result,
					});
				}
			}
		};
		reader.readAsDataURL(currentFile);
		setBrandLogoError(false);
	};

	const closeTooltip = () => {
		setTooltipState(false);
	};

	const tabHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		const targetIdx = e.target.dataset.tabidx;

		setTabState(Number(targetIdx));
	};

	const deleteList = (e: React.ChangeEvent<HTMLInputElement>) => {
		const targetIdx = e.target.dataset.exampleidx;

		setExampleList((pre) => {
			const filteredList = pre.filter((el, idx) => {
				if (idx !== Number(targetIdx)) {
					return el;
				}
			});

			return [...filteredList];
		});
	};

	const addCategoryToList = (
		e: React.ChangeEvent<HTMLInputElement> | KeyboardEvent<HTMLImageElement>
	) => {
		const target = (e.target as HTMLButtonElement).value;

		if (target) {
			setExampleList((pre: string[]) => {
				if (pre.includes(target)) {
					/* 이미 추가된 상품일때, 모달 */
					onMessageDialogOpen({
						title: '이미 추가된 상품 정보입니다.',
						showBottomCloseButton: true,
						closeButtonValue: '확인',
					});
					return [...pre];
				}

				return [...pre, target];
			});
		}
		setIsAdding(false);
	};

	const enterHandler = (e: KeyboardEvent<HTMLImageElement>) => {
		if (e.key === 'Enter') {
			addCategoryToList(e);
		}
	};

	const wantToAddCategory = () => {
		setIsAdding(true);
	};

	const deleteCardPreview = () => {
		setBrandCard({file: null});
		setBrandCardPreview({preview: null});
	};

	/**
	 * 링크 확인
	 */
	const handleCheckOutLinkClick = () => {
		const value: string = getValues('customerCenterUrl');

		if (value) {
			if (!value.includes('https')) {
				window.open(`https://${value}`);
			} else {
				window.open(value);
			}
		} else {
			setError('customerCenterUrl', {
				message: 'URL을 입력해주세요',
			});
		}
	};

	const additionalInfomationList = [
		{
			name: 'authInfo',
			title: '브랜드 소개',
			placeholder: '브랜드를 소개하는 글을 입력해주세요.',
			appearance: true,
		},
		{
			name: 'returnInfo',
			title: '교환 및 반품 안내',
			placeholder:
				'예시 : 교환/환불이 불가능한 경우 개별 주문 제작의 경우, 주문 취소 및 환불이 불가합니다. 사전에 안내된 생산완료 예정일 기준 3주전에는 모델 및 색상변경이 불가합니다. 본 제품의 하자가 아닌 가구 소재의 특성에 대한 변심은 교환/환불이 불가합니다.',
			appearance: b2bType === 'brand' ? true : false,
		},
		{
			name: 'afterServiceInfo',
			title: 'A/S 주의사항',
			placeholder:
				'예시 : 제품 하자 관련 무상 A/S 기간은 제품별로 상이합니다.',
			appearance: b2bType === 'brand' ? true : false,
		},
	];

	const openPreviewGuaranteeModal = () => {
		const values = getValues();

		setModalOption({
			id: 'exampleGuranteeCard',
			isOpen: true,
			title: '개런티 미리보기',
			subtitle:
				'개런티 설정 완료 전에 입력한 정보들을 미리보기를 통해 확인해보세요.',
			children: (
				<div>
					<PreviewGuarantee
						serviceCenterHandler={handleCheckOutLinkClick}
						values={{
							...values,
							nftCustomField: exampleList,
							profileImage: brandLogoPreview.preview,
							nftBackgroundImage: brandCardPreview.preview,
						}}
					/>
				</div>
			),
			width: '544px',
			buttonTitle: '개런티 설정 완료하기',
			onClickButton: () => {
				if (typeof setOpen === 'function') {
					setOpen(false);
				}
			},
		});
	};

	const openExampleModal = () => {
		const values = getValues();

		setModalOption({
			id: 'exampleGuranteeCard',
			isOpen: true,
			title: '브랜드 개런티 예시',
			children: <ExamplePreviewGuarantee />,
			width: '544px',
			buttonTitle: '확인',
			onClickButton: () => {
				if (typeof setOpen === 'function') {
					setOpen(false);
				}
			},
		});
	};

	/**
	 * Form Data 생성하기
	 *
	 * @returns {FormData}
	 */
	const handleFormData = () => {
		const formData = new FormData();
		const values = getValues();

		/* 기본 정보 */
		Object.keys(values).forEach((key: string) => {
			if (
				!key.includes('newCustomField') ||
				key !== 'nftBackgroundImage'
			) {
				formData.append(key, values[key] as string | Blob);
			}
		});

		/* 커스텀 정보 */
		formData.append('nftCustomField', exampleList.join(','));

		/* 프로필 파일 */
		if (brandLogo.file) {
			formData.append('profileImage', brandLogo.file);
		}

		return formData;
	};

	/* 개런티 설정완료 및 파트너스 데이터 업데이트 모달 */
	const openCompleteSettingGuaranteeModal = () => {
		onMessageDialogOpen({
			title: '개런티 설정이 완료되었어요!',
			message: '이용 가이드를 통해 버클의 기능들을 미리 경험해보세요!',
			buttons: (
				<>
					<Button
						color="primary"
						variant="outlined"
						onClick={() => {
							updateParentPartnershipData();
							setTimeout(() => {
								goToParentUrl('/b2b/interwork');
							}, 200);
						}}>
						Cafe24 연동하기
					</Button>
					<Button
						color="black"
						variant="contained"
						onClick={() => {
							updateParentPartnershipData();
							setTimeout(() => {
								goToParentUrl('/b2b/guarantee/register');
							}, 200);
						}}>
						개런티 발급하기
					</Button>
				</>
			),
		});
	};

	/**
	 * Form Data 보내기
	 *
	 */
	const reqestSetupInputData: (data: FormData) => Promise<void> = async (
		_data
	) => {
		const response = await setGuaranteeInformation(_data);
		if (response) {
			openCompleteSettingGuaranteeModal();
		}
	};

	const onSubmit: () => Promise<void> = async () => {
		/* 로고 등록 안할시 에러표시 */
		if (!brandLogoPreview.preview) {
			setBrandLogoError(true);
			justOpenBox(0);
			return;
		} else {
			setBrandLogoError(false);
		}

		const formData = new FormData();
		const data = handleFormData();

		/* 브랜드 카드 파일 */
		if (brandCard.file) {
			formData.append('nftBackgroundImage', brandCard.file);
			const response = await setCustomizedBrandCard(formData);
			if (response) {
				await reqestSetupInputData(data);
			}
		} else {
			await reqestSetupInputData(data);
		}
	};

	useEffect(() => {
		if (b2bType === 'brand') {
			setExampleList([...categoryExampleList[tabState]]);
		} else {
			setExampleList([]);
		}
	}, [tabState]);

	/* 저장 및 나가기 */
	const saveDataToStorage = () => {
		localStorage.setItem('hasInputDataSaved', 'true');

		localStorage.setItem(
			'afterServiceInfo',
			watch().afterServiceInfo as string
		);
		localStorage.setItem('authInfo', watch().authInfo as string);
		localStorage.setItem('brandName', watch().brandName as string);
		localStorage.setItem('brandNameEN', watch().brandNameEN as string);
		localStorage.setItem(
			'customerCenterUrl',
			watch().customerCenterUrl as string
		);
		localStorage.setItem('returnInfo', watch().returnInfo as string);
		localStorage.setItem('warrantyDate', watch().warrantyDate as string);
		localStorage.setItem('nftCustomField', exampleList.join(','));

		if (parsedQuery) {
			localStorage.setItem('cafe24context', 'cafe24');
			localStorage.setItem('cafe24code', parsedQuery.code as string);
			localStorage.setItem('cafe24state', parsedQuery.state as string);
		}

		goToParentUrl('/dashboard');
	};

	/**
	 * 초기 데이터 셋팅
	 */
	useEffect(() => {
		const hasInputDataSavedInStorage =
			localStorage.getItem('hasInputDataSaved');
		const nftCustomFieldSavedData: string | null =
			localStorage.getItem('nftCustomField');

		// 임시저장된 데이터가 있을 경우
		if (hasInputDataSavedInStorage === 'true') {
			reset({
				brandName: localStorage.getItem('brandName'),
				brandNameEN: localStorage.getItem('brandNameEN'),
				warrantyDate: localStorage.getItem('warrantyDate'),
				customerCenterUrl: localStorage.getItem('customerCenterUrl'),

				authInfo: localStorage.getItem('authInfo'),
				returnInfo: localStorage.getItem('returnInfo'),
				afterServiceInfo: localStorage.getItem('afterServiceInfo'),
			});

			if (nftCustomFieldSavedData) {
				setExampleList(() => [...nftCustomFieldSavedData.split(',')]);
			}

			/* 개런티 수정할때, 저장 및 나가기 눌렀을경우에 이미지 불러와야함 */
			if (data?.profileImage) {
				setBrandLogoPreview({preview: data.profileImage});
			}
			if (data?.nftBackgroundImg) {
				setBrandCardPreview({preview: data.nftBackgroundImg});
			}
		} else if (hasProfileLogo && data) {
			reset({
				brandName: data.brand?.name,
				brandNameEN: data.brand?.englishName,
				warrantyDate: data.warrantyDate,
				customerCenterUrl: data.customerCenterUrl,
				authInfo: data.authInfo,
				returnInfo: data.returnInfo,
				afterServiceInfo: data.afterServiceInfo,
			});

			setExampleList(() => [...data.nftCustomFields]);

			setBrandLogoPreview({preview: data.profileImage});
			setBrandCardPreview({preview: data.nftBackgroundImg});
		}
	}, [data]);

	return (
		<Grid
			item
			container
			position="relative"
			justifyContent={hasProfileLogo ? 'center' : 'flex-start'}
			alignItems="center"
			p={hasProfileLogo ? '20px 0px 32px 0px' : '89px 0px 32px'}>
			<FullFormStyled
				onSubmit={handleSubmit(onSubmit)}
				noValidate
				autoComplete="off">
				<Grid
					container
					flexWrap={'nowrap'}
					alignItems={'flex-end'}
					justifyContent={
						hasProfileLogo ? 'space-between' : 'flex-end'
					}
					gap="12px"
					mb="32px"
					sx={{maxWidth: '800px'}}>
					{hasProfileLogo && (
						<Grid
							xs={6}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: '20px',
							}}>
							<Typography
								fontSize={28}
								color={'black'}
								lineHeight="32px"
								fontWeight={700}>
								안녕하세요, {data?.brand?.name}님!
							</Typography>
							<Typography
								fontSize={16}
								color={'grey.300'}
								lineHeight="24px"
								fontWeight={500}>
								개런티 설정을 완료하고 버클 개런티 카드를
								발급해보세요
							</Typography>
						</Grid>
					)}

					<Grid
						container
						xs={6}
						gap="12px"
						flexWrap={'nowrap'}
						justifyContent={'flex-end'}>
						<Grid item sx={{position: 'relative'}}>
							<TooltipComponent
								isOpen={tooltipState}
								arrow={true}
								onClickCloseBtn={closeTooltip}
								title={
									<Typography
										fontSize={12}
										color={'#ffffff'}
										lineHeight="18px"
										fontWeight={500}>
										어떤 정보를 노출 할지 고민 된다면
										<br /> 타 브랜드의 개런티 화면을
										참고하세요!
									</Typography>
								}>
								<CapsuleButton
									variant="outlined"
									onClick={openExampleModal}
									sx={{
										padding: '4px 11px 4px 6px',
										gap: '12px',
									}}
									startIcon={
										<img
											src={exampleBrandIcon}
											srcSet={`${exampleBrandIcon} 1x, ${exampleBrandIcon2x} 2x`}
											alt="brand-sample"
										/>
									}>
									브랜드 개런티 예시보기
								</CapsuleButton>
							</TooltipComponent>
						</Grid>

						<LinkStyle
							href="https://guide.vircle.co.kr/about-vircle"
							target="_blank"
							rel="noreferrer"
							className="faq_link">
							<CapsuleButton>이용가이드 보기</CapsuleButton>
						</LinkStyle>
					</Grid>
				</Grid>

				{/* 브랜드 정보 box */}
				<BoxContainer
					hasProfileLogo={hasProfileLogo}
					isOpen={
						hasProfileLogo
							? true
							: boxIndexState === 0
							? true
							: false
					}
					title="브랜드 정보를 입력해주세요"
					useLabel={boxIndexState !== 0}
					isFilled={
						getValues().brandName &&
						getValues().brandNameEN &&
						getValues().warrantyDate &&
						brandLogoPreview.preview &&
						boxIndexState !== 0
					}
					openHandler={() => boxOpenHandler(0)}>
					<Grid container flexWrap="nowrap" alignItems={'flex-start'}>
						<Box mr="24px" sx={{position: 'relative'}}>
							<FileInputStyle
								type="file"
								accept="image/*"
								name="brandLogo"
								ref={logoInputFile}
								id={`input-file-brandLogo`}
								onChange={(e) => handleAttachFile(e)}
							/>
							<AvatarStyle
								onClick={() => logoInputFile?.current.click()}
								src={
									brandLogoError
										? defaultErrorLogoImg2x
										: (brandLogoPreview?.preview as string)
										? (brandLogoPreview?.preview as string)
										: defaultLogoImg2x
								}
							/>
							{!brandLogoPreview?.preview && (
								<PlusInBlueStyle
									src={plusInBlue}
									srcSet={`${plusInBlue} 1x, ${plusInBlue2x} 2x`}
									alt="plus-button"
									onClick={() =>
										logoInputFile.current.click()
									}
								/>
							)}
						</Box>

						<Grid container sx={{marginBottom: '24px'}}>
							<InputLabelTag
								required={true}
								labelTitle={'브랜드명'}
							/>
							<Grid container gap="16px" flexWrap={'nowrap'}>
								<ControlledInputComponent
									type={'text'}
									name="brandName"
									placeholder={'국문 브랜드명을 입력해주세요'}
									required
									maxHeight={'48px'}
									control={control}
									error={errors && errors.brandName}
								/>
								<ControlledInputComponent
									type={'text'}
									name="brandNameEN"
									control={control}
									placeholder={'영문 브랜드명을 입력해주세요'}
									required
									maxHeight={'48px'}
									error={errors && errors.brandNameEN}
								/>
							</Grid>
						</Grid>
					</Grid>

					<InputWithLabel
						name="warrantyDate"
						control={control}
						labelTitle="보증기간"
						required={true}
						placeholder="예시) 제품 구매 후 3년간 보증됩니다."
						multiline
						inputType="textarea"
						error={errors && errors.warrantyDate}
					/>

					{b2bType === 'brand' && (
						<Grid container sx={{marginBottom: 0}}>
							<Grid container justifyContent="space-between">
								<InputLabelTag
									required={false}
									labelTitle={'고객센터'}
								/>
								<Typography
									onClick={handleCheckOutLinkClick}
									sx={{
										fontSize: '14px',
										lineHeight: '18px',
										color: 'primary.main',
										fontWeight: 700,
										textDecoration: 'underline',
										cursor: 'pointer',
									}}>
									연결 확인하기
								</Typography>
							</Grid>

							<ControlledInputComponent
								control={control}
								name="customerCenterUrl"
								error={errors && errors.customerCenterUrl}
								type={'text'}
								placeholder={'고객센터 링크를 연결해주세요'}
								fullWidth
							/>
						</Grid>
					)}
				</BoxContainer>

				{/* 상품 정보 box */}
				<BoxContainer
					hasProfileLogo={hasProfileLogo}
					isOpen={
						hasProfileLogo
							? true
							: boxIndexState === 1
							? true
							: false
					}
					title="상품 정보를 추가해주세요"
					isFilled={false}
					openHandler={() => boxOpenHandler(1)}>
					{b2bType === 'brand' && (
						<Grid container gap="8px" mb="24px">
							{tabList.map((li, idx) => (
								<Tab
									text={li}
									idx={idx}
									key={`tab-${li}`}
									activeHandler={tabHandler}
									isActive={tabState === idx ? true : false}
								/>
							))}
						</Grid>
					)}

					<Grid container gap="12px">
						{b2bType === 'brand'
							? brandCategoryRequiredList.map((li, idx) => (
									<CategoryContainer
										required={true}
										category={li}
										clickHandler={deleteList}
										exampleIdx={idx}
										key={`example-list-${idx}`}
									/>
							  ))
							: b2bType === 'cooperator'
							? categoryRequiredList.map((li, idx) => (
									<CategoryContainer
										required={true}
										category={li}
										clickHandler={deleteList}
										exampleIdx={idx}
										key={`example-list-${idx}`}
									/>
							  ))
							: null}

						{exampleList.map((li, idx) => (
							<CategoryContainer
								required={false}
								category={li}
								clickHandler={deleteList}
								exampleIdx={idx}
								key={`example-list-${idx}`}
							/>
						))}

						{isAdding && (
							<ControlledInputComponent
								type="text"
								maxHeight="48px"
								placeholder="상품정보 명칭을 입력해 주세요"
								onBlur={addCategoryToList}
								onKeyDown={enterHandler}
								control={control}
								autoFocus={true}
								name={`newCustomField-${exampleList.length}`}
							/>
						)}

						{exampleList.length >=
						maximumAdditionalCategory ? null : (
							<Grid
								item
								display="flex"
								gap="6px"
								alignItems="center"
								sx={{cursor: 'pointer'}}
								mt="8px"
								onClick={wantToAddCategory}>
								<img
									src={bluePlus}
									srcSet={`${bluePlus} 1x, ${bluePlus2x} 2x`}
									alt="plus button"
								/>
								<Typography
									variant="h4"
									sx={{
										fontSize: '16px',
										fontWeight: 500,
										color: 'primary.main',
										lineHeight: '24px',
									}}>
									상품정보 추가
								</Typography>
							</Grid>
						)}
					</Grid>
				</BoxContainer>

				{/* 개런티 카드 디자인 box */}
				<BoxContainer
					hasProfileLogo={hasProfileLogo}
					isOpen={
						hasProfileLogo
							? true
							: boxIndexState === 2
							? true
							: false
					}
					title="개런티 카드 디자인을 업로드 해주세요"
					isFilled={false}
					openHandler={() => boxOpenHandler(2)}>
					<Grid
						container
						flexWrap="nowrap"
						alignItems="flex-end"
						gap="20px">
						<Grid item>
							<FileInputStyle
								type="file"
								accept="image/*"
								name="brandCard"
								ref={brandInputFile}
								id={`input-file-brandLogo`}
								onChange={(e) => handleAttachFile(e)}
								// control={control}
							/>

							{brandCardPreview?.preview ? (
								<AvatarCardStyle
									onClick={() =>
										logoInputFile?.current.click()
									}
									src={brandCardPreview?.preview}
								/>
							) : (
								<Box
									sx={{
										position: 'relative',
										cursor: 'pointer',
									}}>
									<UploadBrandCardDesignStyle
										onClick={() =>
											brandInputFile?.current.click()
										}
									/>
									<UploadPlusButtonStyle
										onClick={() =>
											brandInputFile?.current.click()
										}
										src={blue100Plus}
										srcSet={`${blue100Plus} 1x, ${blue100Plus2x} 2x`}
										alt="plus button"
									/>
								</Box>
							)}
						</Grid>

						<Grid item>
							<Grid container flexDirection="column" gap="20px">
								<Grid container gap="8px">
									{brandCard.file ? (
										<CategoryContainer
											required={false}
											category={brandCard.file?.name}
											clickHandler={deleteCardPreview}
											exampleIdx={177}
										/>
									) : (
										<Box
											sx={{
												backgroundColor: 'white',
												color: 'grey.100',
												border: '1px solid',
												borderColor: 'grey.100',
												borderRadius: '6px',
												padding: '16px',
												maxHeight: '48px',
												minHeight: '48px',
												fontWeight: 500,
												fontSize: '14px',
												lineHeight: '14px',
											}}>
											이미지 파일을 업로드 해주세요
										</Box>
									)}

									<Button
										variant="contained"
										color="blue-50"
										width={100}
										height={48}
										sx={{
											paddingLeft: '16px',
											paddingRight: '16px',
										}}
										onClick={() =>
											brandInputFile?.current.click()
										}>
										업로드 하기
									</Button>
								</Grid>

								<UlStyle>
									<BulletListStyle>
										2MB 이하의 이미지 파일을 업로드
										해주세요.
									</BulletListStyle>
									<BulletListStyle>
										PNG, JPG, JPEG 형식의 이미지 파일을
										업로드 해주세요.
									</BulletListStyle>
									<BulletListStyle>
										가이드를 참고해 개런티 카드를
										제작해주세요.{' '}
										<Typography
											variant="h6"
											sx={{
												display: 'inline-block',
												color: 'primary.main',
												fontSize: '14px',
												fontWeight: 700,
												lineHeight: '18px',
												textDecoration: 'underline',
												cursor: 'pointer',
											}}
											onClick={openCustomizedCardDesign}>
											가이드보기
										</Typography>
									</BulletListStyle>
								</UlStyle>
							</Grid>
						</Grid>
					</Grid>
				</BoxContainer>

				{/* 추가정보를 입력해주세요 box */}
				<BoxContainer
					hasProfileLogo={hasProfileLogo}
					isOpen={
						hasProfileLogo
							? true
							: boxIndexState === 3
							? true
							: false
					}
					title="추가정보를 입력해주세요"
					isFilled={false}
					openHandler={() => boxOpenHandler(3)}>
					{additionalInfomationList.map(
						(li, idx) =>
							li.appearance && (
								<InputWithLabel
									name={li.name}
									control={control}
									labelTitle={li.title}
									placeholder={li.placeholder}
									multiline
									fullWidth={true}
									inputType="textarea"
									key={`additional-information-${idx}`}
								/>
							)
					)}
				</BoxContainer>

				{/* fixed 버튼s */}
				<Box
					sx={{
						background: 'transparent',
						position: 'fixed',
						bottom: '0',
						left: '0',
						right: '0',
					}}>
					<Grid
						container
						justifyContent="space-between"
						sx={{
							padding: hasProfileLogo
								? '12px 0px'
								: '12px 24px 12px 40px',
							background: 'white',
							borderTop: hasProfileLogo
								? null
								: '1px solid #E2E2E9',
							marginLeft: hasProfileLogo ? 0 : '662px',
							width: hasProfileLogo
								? '100%'
								: 'calc(100% - 662px)',
						}}>
						<Grid
							container
							justifyContent="space-between"
							sx={{
								maxWidth: '800px',
								margin: hasProfileLogo ? 'auto' : 0,
							}}>
							<Button
								variant="outlined"
								color="black"
								height={48}
								onClick={saveDataToStorage}>
								저장 및 나가기
							</Button>

							<Grid
								item
								container
								gap="12px"
								sx={{width: 'auto'}}>
								<Button
									variant="outlined"
									color="primary"
									height={48}
									onClick={openPreviewGuaranteeModal}>
									미리보기
								</Button>
								<Button
									type="submit"
									color="primary"
									height={48}>
									{hasProfileLogo
										? '수정하기'
										: '설정 완료하기'}
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			</FullFormStyled>
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
		<Grid container flexWrap="nowrap">
			<Header backgroundColor="transparent" borderBottom={false} />
			<VideoInformationSection boxIndexState={boxIndexState} />

			<InputFormSection
				boxIndexState={boxIndexState}
				boxOpenHandler={boxOpenHandler}
				justOpenBox={justOpenBox}
			/>
		</Grid>
	);
}

export default SetupGuarantee;
