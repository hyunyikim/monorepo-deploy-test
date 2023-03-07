import {Box, Stack, Typography} from '@mui/material';
import SectionBox from '../../dashboard/common/SectionBox';
import {imgVipStar} from '@/assets/images/index';
import {
	icYellowView,
	icBlueChain,
	icGreenSend,
	IcChevronRight,
} from '@/assets/icon/index';
import ToolTipComponent from '@/components/atoms/ToolTipComponent';
import {useGetPartnershipInfo} from '../../../stores/partnership.store';
import {
	DashboardCustomerOverviewType,
	DashboardWalletOverviewType,
} from '@/@types/dashboard.types';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {formatCommaNum} from '@/utils';

interface ProgressStateProps {
	data: {
		title: string;
		tooltipText: string | JSX.Element;
		rate: string | number;
		count: string | number;
		icon?: string;
	};
}

function ProgressStateBox({data}: ProgressStateProps) {
	const {title, tooltipText, rate, count, icon, openState, toolTipHandler} =
		data;

	return (
		<Box display="flex" gap="12px" alignItems={'center'}>
			<Stack
				sx={{
					img: {
						width: '40px',
						height: '40px',
						margin: 'auto',
					},
				}}>
				<img src={icon} alt="send-icon" />
			</Stack>
			<Box>
				<Stack
					flexDirection={'row'}
					gap="2px"
					sx={{svg: {cursor: 'pointer'}}}>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '13px',
							lineHeight: '145%',
							color: 'grey.500',
							whiteSpace: 'nowrap',
						}}>
						{title}&nbsp;
					</Typography>
					<Typography
						sx={{
							fontWeight: 500,
							fontSize: '12px',
							lineHeight: '145%',
							color: 'grey.300',
						}}>
						|&nbsp;{rate || 0}%
					</Typography>

					<ToolTipComponent
						content={tooltipText}
						openState={openState}
						toolTipHandler={toolTipHandler}
					/>
				</Stack>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '21px',
							lineHeight: '30px',
							color: 'grey.900',
						}}>
						{count || 0}
					</Typography>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '13px',
							lineHeight: '30px',
							color: 'grey.900',
						}}>
						명
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

interface CustomerInfoOverviewProps {
	customerData: DashboardCustomerOverviewType;
	linkData: DashboardWalletOverviewType;
}
function CustomerInfoOverview({
	customerData,
	linkData,
}: CustomerInfoOverviewProps) {
	const navigate = useNavigate();
	const {data: partnershipData} = useGetPartnershipInfo();
	const [tooltipState, setTooltipState] = useState({
		send: false,
		view: false,
		link: false,
	});
	const toolTipHandler = (_key: 'send' | 'view' | 'link') => {
		setTooltipState((pre) => ({
			send: false,
			view: false,
			link: false,
			[_key]: !pre[_key],
		}));
	};

	const repairStateList = [
		{
			title: '전송',
			tooltipText: '고객에게 전송한 알림톡 건수입니다.',
			rate: linkData?.confirmCount ? '100' : '0',
			count: formatCommaNum(linkData?.confirmCount),
			icon: icGreenSend,
			openState: tooltipState.send,
			toolTipHandler: () => toolTipHandler('send'),
		},
		{
			title: '조회',
			tooltipText: '개런티 알림톡을 클릭해서 조회한 고객의 수 입니다.',
			rate: linkData?.viewCount
				? Math.round(
						(linkData?.viewCount / linkData?.confirmCount) * 100
				  )
				: '0',
			count: formatCommaNum(linkData?.viewCount),
			icon: icYellowView,
			openState: tooltipState.view,
			toolTipHandler: () => toolTipHandler('view'),
		},
		{
			title: '연동',
			tooltipText:
				'개런티 알림톡을 클릭해서 Klip 지갑을 연동한 고객의 수 입니다.',
			rate: linkData?.linked
				? Math.round((linkData?.linked / linkData?.confirmCount) * 100)
				: '0',
			count: formatCommaNum(linkData?.linked),
			icon: icBlueChain,
			openState: tooltipState.link,
			toolTipHandler: () => toolTipHandler('link'),
		},
	];

	const goToKakaoInterwork = () => {
		navigate('/b2b/interwork/kakao');
	};

	return (
		<Stack flexDirection={'row'} gap="20px" flexWrap={'wrap'} mb="40px">
			<SectionBox
				sx={{
					// minWidth: '800px',
					maxWidth: '800px',
					minHeight: '150px',
					// maxHeight: '150px',
				}}>
				<Stack
					flexDirection={'row'}
					alignItems="center"
					justifyContent={'space-between'}
					sx={{marginBottom: '19px'}}>
					<Typography
						variant="h2"
						sx={{
							fontWeight: 700,
							fontSize: '18px',
							lineHeight: '145%',
							color: 'grey.900',
						}}>
						고객 개런티 연동현황
					</Typography>
					<Typography
						variant="h4"
						sx={{
							fontWeight: 500,
							fontSize: '13px',
							lineHeight: '145%',
							color: 'grey.300',
						}}>
						지난 30일 기준
					</Typography>
				</Stack>

				<Stack
					flexDirection={'row'}
					flexWrap="wrap"
					gap="46px"
					alignItems={'center'}>
					<Box
						sx={{
							display: 'flex',
							gap: '16px',
							alignItems: 'center',
						}}>
						{repairStateList.map((state, idx) => (
							<>
								<ProgressStateBox
									data={state}
									key={`repair-state-${idx}`}
								/>
								{idx === repairStateList.length - 1 ? null : (
									<IcChevronRight />
								)}
							</>
						))}
					</Box>

					{partnershipData?.useAlimtalkProfile === 'N' && (
						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								paddingLeft: '24px',
								borderLeft: '1px solid #E2E2E9',
							}}>
							<Typography
								variant="body3"
								sx={{
									fontWeight: 500,
									fontSize: '13px',
									lineHeight: '145%',
									color: 'grey.900',
								}}>
								연동률 올리기
							</Typography>
							<Typography
								variant="body3"
								sx={{
									fontWeight: 500,
									fontSize: '12px',
									lineHeight: '145%',
									color: 'grey.400',
								}}>
								카카오 알림톡 연동해보세요!
							</Typography>
							<Typography
								variant="body3"
								onClick={goToKakaoInterwork}
								sx={{
									fontWeight: 500,
									fontSize: '12px',
									lineHeight: '145%',
									color: 'primary.main',
									cursor: 'pointer',
								}}>
								{'연동하기 >'}
							</Typography>
						</Box>
					)}
				</Stack>
			</SectionBox>

			<SectionBox
				sx={{
					minWidth: '260px',
					maxWidth: '260px',
					minHeight: '150px',
					maxHeight: '150px',
					display: 'flex',
					justifyContent: 'space-between',
					flexDirection: 'row',
				}}>
				<Stack
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-between',
						width: '100%',
					}}>
					<Stack
						sx={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							marginBottom: '11px',
						}}>
						<Typography
							variant="h2"
							sx={{
								fontWeight: 700,
								fontSize: '18px',
								lineHeight: '145%',
								color: 'grey.900',
							}}>
							단골고객
						</Typography>

						<Typography
							variant="h2"
							sx={{
								fontWeight: 500,
								fontSize: '13px',
								lineHeight: '145%',
								color: 'grey.300',
							}}>
							전체 기간
						</Typography>
					</Stack>

					{/* ---------------------------- */}
					<Stack
						flexDirection="row"
						justifyContent={'space-between'}
						sx={{gap: '16px'}}>
						<Box>
							<Stack
								sx={{width: '100%', height: '40px'}}
								flexDirection="row"
								alignItems={'flex-end'}
								mb="4px">
								<Typography
									sx={{
										fontWeight: 700,
										fontSize: '21px',
										lineHeight: '30px',
										color: 'grey.900',
									}}>
									{customerData?.vip || 0}
								</Typography>
								<Typography
									sx={{
										fontWeight: 700,
										fontSize: '13px',
										lineHeight: '30px',
										color: 'grey.900',
									}}>
									명
								</Typography>
							</Stack>

							<Stack
								sx={{
									fontWeight: 500,
									fontSize: '14px',
									lineHeight: '20px',
									color: 'grey.400',
									padding: '0px 6.5px',
									height: '20px',
									background: '#F3F3F5',
									borderRadius: '64px',
								}}>
								3개 이상 구매한 고객
							</Stack>
						</Box>

						<Stack>
							<Box
								sx={{
									width: '60px',
									height: '60px',
									img: {
										width: '60px',
										height: '60px',
									},
								}}>
								<img src={imgVipStar} alt="yellow-star" />
							</Box>
						</Stack>
					</Stack>
				</Stack>
			</SectionBox>
		</Stack>
	);
}

export default CustomerInfoOverview;
