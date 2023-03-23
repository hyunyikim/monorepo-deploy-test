import {useCallback, useState} from 'react';

import {Box, Stack, Typography} from '@mui/material';

import {useGetPartnershipInfo} from '@/stores';

import {Button, Dialog, LabeledCheckbox} from '@/components';
import LogoVircleKakaoProfile from '@/assets/images/logo-vircle-kakao-profile.png';
import LogoVircleKakaoProfile2x from '@/assets/images/logo-vircle-kakao-profile@2x.png';
import ImgKakaoGuarantee from '@/assets/images/img-kakao-guarantee.png';
import ImgKakaoGuarantee2x from '@/assets/images/img-kakao-guarantee@2x.png';
import {NOT_OPEN_GUARANTEE_REGISTER_ALIM_TALK_NOTICE_KEY} from '@/data';

interface Props {
	open: boolean;
	modalData: null | {func: () => void};
}

function GuaranteeRegisterAlimTalkNoticeModal({open, modalData}: Props) {
	const [notShowChecked, setNotShowChecked] = useState(false);
	const {data: partnershipInfo} = useGetPartnershipInfo();

	const handleClose = useCallback(() => {
		if (!modalData) {
			return;
		}
		const func = modalData.func;
		func();

		// local storage 세팅
		const email = partnershipInfo?.email || '';
		const tempSavedData = JSON.parse(
			localStorage.getItem(
				NOT_OPEN_GUARANTEE_REGISTER_ALIM_TALK_NOTICE_KEY
			) || '{}'
		);
		localStorage.setItem(
			NOT_OPEN_GUARANTEE_REGISTER_ALIM_TALK_NOTICE_KEY,
			JSON.stringify({
				...tempSavedData,
				[email]: notShowChecked ? 'Y' : 'N',
			})
		);
	}, [modalData, notShowChecked]);

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			useBackgroundClickClose={true}
			TitleComponent={
				<Typography
					variant="header1"
					fontWeight="bold"
					component="span">
					개런티 발급 알림톡 안내
				</Typography>
			}
			width={800}
			showCloseButton={true}
			sx={{
				'.MuiDialogTitle-root': {
					paddingBottom: '14px',
					marginBottom: '0',
				},
			}}>
			<>
				<Typography variant="body2" color="grey.500">
					개런티는 고객에게 카카오 알림톡으로 발송됩니다.
					<br />
					기본적으로 “버클" 채널로 알림톡이 발송되지만, 브랜드 채널로
					발송할 수 있습니다.
					<br />
					<Typography component="span" color="primary.main">
						카카오 알림톡 연동
					</Typography>
					하고 고객에게 익숙한 브랜드 채널로 모든 알림톡을
					발송해보세요!
				</Typography>
				<KakaotalkNotice />
				<BottomControl
					notShowChecked={notShowChecked}
					setNotShowChecked={setNotShowChecked}
				/>
			</>
		</Dialog>
	);
}

const KakaotalkNotice = () => {
	const [selected, setSelected] = useState<'default' | 'brand'>('default');
	return (
		<Stack
			position="relative"
			sx={{
				minHeight: '386px',
				marginTop: '24px',
			}}>
			<Stack
				flexDirection="column"
				sx={{
					backgroundColor: 'grey.50',
					position: 'absolute',
					left: '-32px',
					width: 'calc(100% + 32px * 2)',
					minHeight: 'inherit',
				}}>
				<Stack
					flexDirection="row"
					justifyContent="center"
					gap="8px"
					sx={{
						paddingTop: '24px',
					}}>
					<Box
						className="cursor-pointer"
						sx={{
							padding: '9px 20px',
							borderRadius: '62px',
							color: 'grey.900',
							fontWeight: 'bold',
							fontSize: 13,
							border: '1px solid #F3F3F5',
							...(selected === 'default' && {
								backgroundColor: '#FFF',
								border: '1px solid #e2e2e2',
							}),
						}}
						onClick={() => {
							setSelected('default');
						}}>
						기본
					</Box>
					<Box
						className="cursor-pointer"
						sx={{
							padding: '9px 20px',
							borderRadius: '62px',
							color: 'grey.900',
							fontWeight: 'bold',
							fontSize: 13,
							border: '1px solid #F3F3F5',
							...(selected === 'brand' && {
								backgroundColor: '#FFF',
								border: '1px solid #e2e2e2',
							}),
						}}
						onClick={() => {
							setSelected('brand');
						}}>
						브랜드 채널
					</Box>
				</Stack>
				<KakaotalkSampleImage selected={selected} />
			</Stack>
		</Stack>
	);
};

const KakaotalkSampleImage = ({selected}: {selected: 'default' | 'brand'}) => {
	const {data: partnershipData} = useGetPartnershipInfo();

	const brandName =
		selected === 'default'
			? '버클'
			: partnershipData?.brand?.name || '버클';
	const imgUrl =
		selected === 'brand' && partnershipData?.profileImage
			? [partnershipData?.profileImage, partnershipData?.profileImage]
			: [LogoVircleKakaoProfile, LogoVircleKakaoProfile2x];

	return (
		<Stack
			sx={{
				width: '218px',
				height: '306px',
				marginX: 'auto',
				position: 'absolute',
				left: 'calc(100% / 2 - 109px)',
				bottom: 0,
				backgroundColor: '#ABC2D1',
				borderRadius: '8px 8px 0px 0px',
				paddingTop: '10px',
				paddingBottom: '26px',
				userSelect: 'none',
			}}>
			<Stack
				flexDirection="row"
				justifyContent="space-between"
				paddingX="25px">
				<Stack>
					<Timenow />
				</Stack>
				<Stack flexDirection="row" gap="3px">
					<CellularSignal />
					<WifiSignal />
					<Battery />
				</Stack>
			</Stack>
			<Stack position="relative">
				<Stack
					flexDirection="row"
					justifyContent="space-between"
					alignItems="center"
					paddingX="8px">
					<Arrow />
					<Box>
						<Magnifier />
						<Hamberger />
					</Box>
				</Stack>
				<Typography
					fontSize={9.5}
					sx={{
						position: 'absolute',
						top: '6px',
						margin: 'auto',
						width: '100%',
						textAlign: 'center',
					}}>
					{brandName}
				</Typography>
			</Stack>
			<Box
				sx={{
					fontSize: '40px',
					position: 'absolute',
					top: '30px',
					left: '-50px',
					animation: '.5s infinite alternate left-to-right',
				}}>
				&#128073;
			</Box>
			<Stack
				flexDirection="row"
				sx={{
					padding: '0 9px 0 5px',
				}}>
				<img
					src={imgUrl[0]}
					srcSet={`${imgUrl[0]} 1x, ${imgUrl[1]} 2x`}
					width={24}
					height={24}
					style={{
						borderRadius: '7.5px',
					}}
				/>
				<Stack
					sx={{
						marginLeft: '5px',
					}}>
					<Typography
						fontSize={7}
						fontWeight={400}
						color="#00000080"
						marginBottom="3px">
						{brandName}
					</Typography>
					<Stack
						sx={{
							width: '152px',
						}}>
						<Stack
							justifyContent="center"
							position="relative"
							sx={{
								backgroundColor: '#fde40b',
								width: '100%',
								height: '20px',
								padding: '8px 6px',
								borderRadius: '7px 7px 0px 0px',
							}}>
							<Typography fontSize={7} color="#464312">
								알림톡 도착
							</Typography>
						</Stack>
						<Stack
							sx={{
								background: '#f9f9f9',
								width: '100%',
								heigh: '75px',
								padding: '9.5px',
							}}>
							<Typography
								fontSize={10}
								fontWeight={700}
								color="#202020">
								디지털 개런티가
								<br />
								도착했습니다
							</Typography>
							<Stack alignItems="flex-end">
								<img
									src={ImgKakaoGuarantee}
									srcSet={`${ImgKakaoGuarantee2x} 2x`}
									width={42}
									height={42}
								/>
							</Stack>
						</Stack>
						<Stack
							sx={{
								backgroundColor: '#FFF',
								padding: '6px',
								borderRadius: '0px 0px 7px 7px',
							}}>
							<Typography
								fontSize={10}
								lineHeight="1.4em"
								sx={{
									wordBreak: 'keep-all',
								}}>
								홍길동님! <br />
								{brandName}에서 디지털 개런티를 보냈습니다.{' '}
								<br />
							</Typography>
							<Typography
								sx={{
									marginTop: '10px',
									borderRadius: '4.5px',
									backgroundColor: '#f5f5f5',
									fontSize: '7px',
									fontWeight: 400,
									paddingY: '7px',
									textAlign: 'center',
								}}>
								개런티 보러가기
							</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

const BottomControl = ({
	notShowChecked,
	setNotShowChecked,
}: {
	notShowChecked: boolean;
	setNotShowChecked: (value: boolean) => void;
}) => {
	return (
		<Stack
			flexDirection="row"
			justifyContent="space-between"
			alignItems="center"
			flexWrap="wrap"
			sx={{
				width: '100%',
				marginTop: '24px',
				marginBottom: '8px',
			}}>
			<LabeledCheckbox
				label="다시 보지 않기"
				value={notShowChecked}
				onChange={(e, checked) => {
					setNotShowChecked(checked);
				}}
				sx={{
					'.MuiFormControlLabel-label': {
						color: 'grey.400',
					},
				}}
			/>
			<Button
				variant="outlined"
				color="primary"
				height={40}
				onClick={() => {
					window.open('/b2b/interwork/kakao');
				}}>
				카카오 알림톡 연동
			</Button>
		</Stack>
	);
};

const Timenow = () => (
	<svg
		width="23"
		height="11"
		viewBox="0 0 23 11"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M2.81721 7.88721C4.19898 7.88721 5.00939 6.76489 5.00939 4.80884C5.00939 2.86737 4.19024 1.73921 2.81721 1.73921C1.4471 1.73921 0.627953 2.86445 0.627953 4.80884C0.625037 6.76489 1.43836 7.88721 2.81721 7.88721ZM2.81721 7.10596C2.01264 7.10596 1.52873 6.29847 1.53164 4.80884C1.53164 3.32213 2.01847 2.51172 2.81721 2.51172C3.61887 2.51172 4.1057 3.32213 4.1057 4.80884C4.1057 6.29847 3.6247 7.10596 2.81721 7.10596ZM9.96328 7.79102V7.01268H7.21432V6.96895L8.42701 5.73585C9.54642 4.63685 9.86125 4.10338 9.86708 3.43582C9.86125 2.46799 9.06542 1.73921 7.91395 1.73921C6.77705 1.73921 5.94624 2.46216 5.94915 3.55534H6.81203C6.81203 2.91692 7.23472 2.50006 7.89646 2.50006C8.52321 2.50006 9.00129 2.8732 9.00421 3.46205C9.00129 3.98677 8.6748 4.36283 8.01889 5.04205L5.94915 7.1322L5.95207 7.79102H9.96328ZM11.5588 4.06257C11.8736 4.06257 12.1418 3.80021 12.1418 3.47663C12.1418 3.15888 11.8736 2.89652 11.5588 2.89652C11.2352 2.89652 10.967 3.15888 10.9729 3.47663C10.967 3.80021 11.2352 4.06257 11.5588 4.06257ZM11.5588 7.05057C11.8736 7.05057 12.1418 6.78821 12.1418 6.46463C12.1418 6.14397 11.8736 5.88161 11.5588 5.88161C11.2352 5.88161 10.967 6.14397 10.9729 6.46463C10.967 6.78821 11.2352 7.05057 11.5588 7.05057ZM15.3152 7.87264C16.5542 7.87264 17.4724 7.14677 17.4666 6.15271C17.4724 5.39478 16.9973 4.84674 16.1869 4.73305V4.68641C16.8282 4.5319 17.248 4.04216 17.2421 3.36877C17.248 2.48257 16.5075 1.73921 15.3356 1.73921C14.2191 1.73921 13.3242 2.40095 13.295 3.37168H14.1696C14.1929 2.83238 14.7264 2.50006 15.3269 2.50006C15.9566 2.50006 16.3647 2.86737 16.3647 3.41541C16.3647 3.98677 15.8895 4.36574 15.2074 4.36574H14.7001V5.10618H15.2074C16.0644 5.10618 16.5542 5.52888 16.5512 6.12065C16.5542 6.69784 16.0294 7.09139 15.3065 7.09139C14.6418 7.09139 14.12 6.75615 14.088 6.23142H13.1697C13.2018 7.20799 14.0821 7.87264 15.3152 7.87264ZM19.8458 1.82084L18.362 2.79449V3.66028L19.7875 2.73036H19.8225V7.79102H20.732V1.82084H19.8458Z"
			fill="black"
		/>
	</svg>
);

const CellularSignal = () => (
	<svg
		width="11"
		height="7"
		viewBox="0 0 11 7"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<rect
			x="0.53125"
			y="3.875"
			width="1.75825"
			height="2.28344"
			rx="0.527638"
			fill="black"
		/>
		<rect
			x="3.1543"
			y="2.82324"
			width="1.75825"
			height="3.33544"
			rx="0.527638"
			fill="black"
		/>
		<rect
			x="5.81445"
			y="1.41699"
			width="1.75825"
			height="4.74165"
			rx="0.527638"
			fill="black"
			fillOpacity="0.2"
		/>
		<rect
			x="8.4375"
			y="0.00683594"
			width="1.75825"
			height="6.15149"
			rx="0.527638"
			fill="black"
			fillOpacity="0.2"
		/>
	</svg>
);
const Battery = () => (
	<svg
		width="15"
		height="8"
		viewBox="0 0 15 8"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M2.12002 0.81543C1.2458 0.81543 0.537109 1.52412 0.537109 2.39834V5.76522C0.537109 6.63944 1.2458 7.34814 2.12002 7.34814H11.5694C12.4436 7.34814 13.1523 6.63945 13.1523 5.76523V2.39834C13.1523 1.52412 12.4436 0.81543 11.5694 0.81543H2.12002ZM2.28391 1.35547C1.58453 1.35547 1.01758 1.92242 1.01758 2.6218V5.55001C1.01758 6.24939 1.58453 6.81634 2.28391 6.81634H11.3915C12.0909 6.81634 12.6579 6.24939 12.6579 5.55001V2.6218C12.6579 1.92242 12.0909 1.35547 11.3915 1.35547H2.28391Z"
			fill="black"
			fillOpacity="0.35"
		/>
		<rect
			x="1.56836"
			y="1.88086"
			width="3.58794"
			height="4.44899"
			rx="0.896985"
			fill="black"
		/>
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M13.7344 5.22133V2.93945C14.1606 3.14227 14.4553 3.57692 14.4553 4.08039C14.4553 4.58386 14.1606 5.01852 13.7344 5.22133Z"
			fill="black"
			fillOpacity="0.45"
		/>
	</svg>
);
const WifiSignal = () => (
	<svg
		width="10"
		height="8"
		viewBox="0 0 10 8"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M3.69102 5.68439C3.59536 5.77464 3.6018 5.92396 3.69142 6.02021L4.67313 7.07466C4.77746 7.18673 4.95497 7.18673 5.0593 7.07466L6.04075 6.02048C6.13034 5.92425 6.13681 5.77496 6.04119 5.68471C5.73451 5.39523 5.32095 5.21777 4.86594 5.21777C4.4111 5.21777 3.99767 5.3951 3.69102 5.68439Z"
			fill="black"
		/>
		<path
			d="M6.5081 5.09249C6.62426 5.19633 6.80499 5.19976 6.91116 5.08572L7.51278 4.43952C7.60776 4.3375 7.60761 4.17844 7.50542 4.08365C6.81309 3.44146 5.886 3.04883 4.8672 3.04883C3.84848 3.04883 2.92144 3.44139 2.22912 4.0835C2.12692 4.17829 2.12677 4.33736 2.22175 4.43938L2.82349 5.0857C2.92966 5.19974 3.11039 5.19631 3.22655 5.09247C3.66214 4.70309 4.23708 4.46636 4.86731 4.46636C5.49756 4.46636 6.07251 4.70309 6.5081 5.09249Z"
			fill="black"
		/>
		<path
			d="M8.02992 3.4762C8.14124 3.57822 8.31528 3.57702 8.41817 3.4665L8.98745 2.85505C9.08396 2.75138 9.0818 2.58953 8.97794 2.49323C7.89879 1.4926 6.45392 0.880859 4.86617 0.880859C3.2785 0.880859 1.8337 1.49253 0.754571 2.49307C0.650706 2.58937 0.648539 2.75122 0.745055 2.85489L1.31461 3.46664C1.4175 3.57715 1.59155 3.57835 1.70286 3.47632C2.53622 2.71249 3.6469 2.24634 4.86646 2.24634C6.08595 2.24634 7.19658 2.71244 8.02992 3.4762Z"
			fill="black"
		/>
	</svg>
);
const Arrow = () => (
	<svg
		width="10"
		height="19"
		viewBox="0 0 10 19"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			d="M1.47656 10.0217L6.22294 14.768L6.75923 14.2317L2.54918 10.0217L6.75919 5.81168L6.2229 5.27539L1.47656 10.0217Z"
			fill="#282A2B"
		/>
	</svg>
);
const Magnifier = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M11.8494 12.5775C11.2466 13.0456 10.4894 13.3243 9.66703 13.3243C7.70003 13.3243 6.10547 11.7297 6.10547 9.76273C6.10547 7.79574 7.70003 6.20117 9.66703 6.20117C11.634 6.20117 13.2286 7.79574 13.2286 9.76273C13.2286 10.5849 12.95 11.3421 12.482 11.9449L15.2278 14.6907L14.5952 15.3232L11.8494 12.5775ZM12.4271 9.76248C12.4271 11.287 11.1913 12.5228 9.66678 12.5228C8.14228 12.5228 6.90642 11.287 6.90642 9.76248C6.90642 8.23798 8.14228 7.00213 9.66678 7.00213C11.1913 7.00213 12.4271 8.23798 12.4271 9.76248Z"
			fill="#282A2B"
		/>
	</svg>
);
const Hamberger = () => (
	<svg
		width="20"
		height="20"
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		<path
			fillRule="evenodd"
			clipRule="evenodd"
			d="M5.2793 6.85742H15.8321V7.64888H5.2793V6.85742ZM5.2793 10.2861H15.8321V11.0776H5.2793V10.2861ZM15.8321 13.7167H5.2793V14.5082H15.8321V13.7167Z"
			fill="#282A2B"
		/>
	</svg>
);

export default GuaranteeRegisterAlimTalkNoticeModal;
