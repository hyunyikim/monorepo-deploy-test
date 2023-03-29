import {useEffect, useState} from 'react';
import {PartnershipInfoResponse} from '@/@types';
import {
	DashboardPeriodType,
	DashboardIssuedGuranteeOverviewType,
	DashboardCustomerOverviewType,
	TopIssuedCustomerOverviewType,
	TopPaidCustomerOverviewType,
	DashboardRepairOverviewType,
} from '@/@types/dashboard.types';

import {Box, Stack, Typography} from '@mui/material';

import Chart from 'react-apexcharts';
import DashboardSection from '@/features/dashboard/common/DashboardSection';
import SectionBox from '@/features/dashboard/common/SectionBox';
import SectionTitleComponent from '@/features/dashboard/common/SectionTitleComponent';
import {
	IcChevronRight,
	icRepairSiscors,
	icRepairBag,
	icRepairCancel,
	IcHelp,
	IcClose,
} from '@/assets/icon';

import {
	imgDefaultBarChart,
	imgDefaultBarChart2x,
	imgDefaultRepair,
	imgDefaultRepair2x,
} from '@/assets/images';
import {Button} from '@/components';
import {formatCommaNum, sendAmplitudeLog, dashboardDateStack} from '@/utils';
import {commaFormNumber} from '@/utils';
import styled from '@emotion/styled';
import {makeStyles} from '@mui/styles';
import TooltipComponent from '@/components/atoms/ToolTipComponent';
import {useNavigate} from 'react-router-dom';

type TopCustomerStateType = 'times' | 'amount';
type SelectedButtonType = {
	isSelected: boolean | string;
};

export interface TopDataType {
	name: string;
	paid?: string;
	phone?: string;
	issued?: string;
}

type TopBoxPropsType = {
	topData: TopDataType;
	order: number;
	type: string;
};

const ButtonStyle = styled('div')<SelectedButtonType>`
	width: '88px';
	height: '32px';
	font-size: '13px';
	line-height: '32px';
	padding: '9px 0px';

	button {
		cursor: pointer;
		border-radius: 62px;
		${({isSelected}) => ({
			fontWeight: isSelected ? 700 : 400,
			color: isSelected ? 'white' : 'grey.600',
			backgroundColor: isSelected ? '#47474F' : 'transparent',
		})}
	}
`;

interface RepairTypeProps {
	WEEKLY: DashboardRepairOverviewType;
	MONTHLY: DashboardRepairOverviewType;
}
interface WalletBoxProps {
	data: {
		title: string;
		content: string;
		count: string | number;
		openState: boolean;
		toolTipHandler: () => void;
	};
}

interface CustomerOverviewProps {
	period: DashboardPeriodType;
	guaranteeData: any;
	customerData: DashboardCustomerOverviewType;
	repairData: RepairTypeProps;
	partnershipData: PartnershipInfoResponse;
}

function DataWithToolTipBox({data}: WalletBoxProps) {
	const {count, title, content, openState, toolTipHandler} = data;

	return (
		<Stack alignItems={'center'}>
			<Box
				sx={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					gap: '2px',

					svg: {
						cursor: 'pointer',
					},
				}}>
				<Typography
					variant="h4"
					sx={{
						fontWeight: 500,
						fontSize: '13px',
						lineHeight: '145%',
						textAlign: 'center',
						color: 'grey.500',
					}}>
					{title}
				</Typography>
				<TooltipComponent
					content={content}
					openState={openState}
					toolTipHandler={toolTipHandler}
				/>
			</Box>
			<Typography
				variant="h3"
				sx={{
					fontWeight: 700,
					fontSize: '21px',
					lineHeight: '145%',
					textAlign: 'center',
					color: 'grey.900',
				}}>
				{count || 0}명
			</Typography>
		</Stack>
	);
}

function TopBoxComponent({topData, order, type}: TopBoxPropsType) {
	const navigate = useNavigate();

	const goToCustomerDetailPage = (_name: string, _phone: string) => {
		navigate(`/b2b/customer/${_name}/${_phone}`);
	};

	return (
		<>
			{type === 'times'
				? topData.issued &&
				  Number(topData.issued) > 0 && (
						<Stack
							flexDirection="row"
							alignItems="center"
							justifyContent="space-between"
							sx={{width: '100%'}}>
							<Box
								display="flex"
								gap="20px"
								alignItems={'center'}>
								<Typography
									variant="h4"
									sx={{
										fontWeight: 500,
										fontSize: '16px',
										lineHeight: '145%',
										color: 'grey.900',
										minWidth: '11px',
									}}>
									{order + 1}
								</Typography>
								<Typography
									variant="h4"
									sx={{
										fontWeight: 500,
										fontSize: '14px',
										lineHeight: '14px',
										textDecoration: 'underline',
										color: 'grey.900',
										cursor: 'pointer',
									}}
									onClick={() =>
										goToCustomerDetailPage(
											topData.name,
											topData.tel
										)
									}>
									{topData.name}
								</Typography>
							</Box>

							<Box
								sx={{
									height: '20px',
									padding: '0 6.5px',
									lineHeight: '20px',
									background: '#EDF0FF',
									borderRadius: '64px',
									fontWeight: 500,
									fontSize: '14px',
									color: '#526EFF',
								}}>
								{topData &&
									topData.paid &&
									`${commaFormNumber(topData.paid)}원`}
								{topData &&
									topData.issued &&
									`${commaFormNumber(topData.issued)}개`}
							</Box>
						</Stack>
				  )
				: topData.paid &&
				  Number(topData.paid) > 0 && (
						<Stack
							flexDirection="row"
							alignItems="center"
							justifyContent="space-between"
							sx={{width: '100%'}}>
							<Box
								display="flex"
								gap="20px"
								alignItems={'center'}>
								<Typography
									variant="h4"
									sx={{
										fontWeight: 500,
										fontSize: '16px',
										lineHeight: '145%',
										color: 'grey.900',
									}}>
									{order + 1}
								</Typography>
								<Typography
									variant="h4"
									sx={{
										fontWeight: 500,
										fontSize: '14px',
										lineHeight: '14px',
										textDecoration: 'underline',
										color: 'grey.900',
										cursor: 'pointer',
									}}
									onClick={() =>
										goToCustomerDetailPage(
											topData.name,
											topData.tel
										)
									}>
									{topData.name}
								</Typography>
							</Box>

							<Box
								sx={{
									height: '20px',
									padding: '0 6.5px',
									lineHeight: '20px',
									background: '#EDF0FF',
									borderRadius: '64px',
									fontWeight: 500,
									fontSize: '14px',
									color: '#526EFF',
								}}>
								{topData &&
									topData.paid &&
									`${commaFormNumber(topData.paid)}원`}
								{topData &&
									topData.issued &&
									`${commaFormNumber(topData.issued)}개`}
							</Box>
						</Stack>
				  )}
		</>
	);
}

function DashboardCustomerSection({
	period,
	guaranteeData,
	customerData,
	repairData,
	partnershipData,
}: CustomerOverviewProps) {
	const navigate = useNavigate();
	const [topCustomerTypeData, setTopCustomerTypeData] =
		useState<TopCustomerStateType>('times');
	const [topCustomerData, setTopCustomerData] = useState<
		TopPaidCustomerOverviewType[] | TopIssuedCustomerOverviewType[]
	>([]);
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

	const hasRepairData =
		repairData[period] && partnershipData?.useRepair === 'Y';

	const standardRate = 100 / guaranteeData[period]?.walletLink?.confirmCount;

	const barChartData = {
		type: 'bar',
		height: 210,
		series: [
			{
				name: 'total',
				data: [
					{
						x: '전송',
						y:
							Math.round(
								guaranteeData[period]?.walletLink
									?.confirmCount * standardRate
							) || 0,
					},
					{
						x: '조회',
						y:
							Math.round(
								guaranteeData[period]?.walletLink?.viewCount *
									standardRate
							) || 0,
					},
					{
						x: '연동',
						y:
							Math.round(
								guaranteeData[period]?.walletLink?.linked *
									standardRate
							) || 0,
					},
				],
			},
		],
		options: {
			chart: {
				zoom: {
					enabled: false,
				},
				toolbar: {
					show: false,
				},
			},
			xaxis: {
				categories: ['전송', '조회', '연동'],
			},
			yaxis: {
				tickAmount: 4,
				min: 0,
				max: 100,
				logarithmic: false,
				labels: {
					show: true,
					formatter: (value: number, idx: number) => {
						return value + '%';
					},
				},
			},

			dataLabels: {
				enabled: false,
			},
			grid: {
				show: true,
				borderColor: '#E2E2E9',
				strokeDashArray: 3,
				position: 'back',
				yaxis: {
					lines: {
						show: true,
					},
				},
			},
			fill: {
				colors: ['#526eff', '#526eff', '#526eff'],
			},

			plotOptions: {
				bar: {
					borderRadius: 4,
					columnWidth: '60%',
					barHeight: '50%',
				},
			},
		},
	};

	const repairStateList = [
		{
			icon: icRepairSiscors,
			title: '신규접수',
			url: '',
			total: repairData[period]?.request,
		},
		{
			icon: icRepairBag,
			title: '수선완료',
			url: '',
			total: repairData[period]?.complete,
		},
		{
			icon: icRepairCancel,
			title: '신청취소',
			url: '',
			total: repairData[period]?.cancel,
		},
	];

	useEffect(() => {
		if (customerData && customerData[period]) {
			const {topIssued, topPaid} = customerData[period];

			if (topCustomerTypeData === 'times') {
				if (topIssued && topIssued?.length > 0) {
					setTopCustomerData([...topIssued]);
				} else {
					setTopCustomerData([]);
				}
			} else if (topCustomerTypeData === 'amount') {
				if (topPaid && topPaid?.length > 0) {
					setTopCustomerData([...topPaid]);
				} else {
					setTopCustomerData([]);
				}
			}
		}
	}, [topCustomerTypeData, customerData]);

	const customerStateHandler = (
		e: React.MouseEventHandler<HTMLButtonElement>
	) => {
		const targetKey: TopCustomerStateType = e.target
			? e.target?.dataset.customer
			: 'times';

		sendAmplitudeLog(
			`dashboard_topcustomer_${
				targetKey === 'times' ? 'frequency' : 'price'
			}_click`,
			{
				pv_title:
					targetKey === 'times'
						? '구매회수 목록 표시'
						: '결제금액 목록 표시',
			}
		);

		if (targetKey === 'times' || targetKey === 'amount') {
			setTopCustomerTypeData(targetKey);
		}
	};

	const goToCustomerListPage = () => {
		const {today, previousWeek, previousMonth} = dashboardDateStack();

		sendAmplitudeLog(
			`dashboard_topcustomer_${
				topCustomerTypeData === 'times' ? 'frequency' : 'price'
			}_more_click`,
			{
				pv_title: '고객관리로 이동',
			}
		);

		const from = period === 'WEEKLY' ? previousWeek : previousMonth;
		const to = today;
		if (topCustomerTypeData === 'times') {
			navigate({
				pathname: '/b2b/customer',
				search: `?searchType=all&searchText=&startDate=${from}&endDate=${to}&currentPage=1&pageMaxNum=25&wallet=ALL&orderBy=NO_OF_GUARANTEE&orderDirection=DESC`,
			});
		} else {
			navigate({
				pathname: '/b2b/customer',
				search: `?searchType=all&searchText=&startDate=${from}&endDate=${to}&currentPage=1&pageMaxNum=25&wallet=ALL&orderBy=TOTAL_PRICE&orderDirection=DESC`,
			});
		}
	};

	const goToGuaranteeIssuePage = () => {
		sendAmplitudeLog(`dashboard_topcustomer_send_guarantee_click`, {
			pv_title: '개런티 발급으로 이동',
		});
		navigate('/b2b/guarantee/register');
	};

	const goToServiceInterworkPage = () => {
		sendAmplitudeLog(`dashboard_repair_install_click`, {
			pv_title: '서비스 연동관리>수선신청 관리 상세로 이동',
		});
		navigate('/b2b/interwork/repair');
	};

	const goToRepairListPage = (_title: string) => {
		const {today, previousWeek, previousMonth} = dashboardDateStack();
		let currentStatus = '';

		switch (_title) {
			case '신규접수':
				currentStatus = 'request';
				break;
			case '수선완료':
				currentStatus = 'complete';
				break;
			case '신청취소':
				currentStatus = 'cancel';
				break;
		}

		sendAmplitudeLog(`dashboard_repair_${currentStatus}_click`, {
			pv_title: '수선 신청관리로 이동',
		});

		const from = period === 'WEEKLY' ? previousWeek : previousMonth;
		const to = today;
		navigate({
			pathname: '/b2b/repair',
			search: `?searchType=all&searchText=&startDate=&endDate=${to}&sort=latest&currentPage=1&pageMaxNum=25&status=${currentStatus}`,
		});
	};

	const getPeriodText = () => {
		switch (period) {
			case 'WEEKLY':
				return '주';
			case 'MONTHLY':
				return '달';
			default:
				return '주';
		}
	};

	return (
		<DashboardSection sectionTitle="고객현황">
			<SectionBox
				sx={{
					minWidth: '590px',
					maxWidth: '590px',
					minHeight: '400px',
					maxHeight: '400px',
					padding: 0,
				}}>
				<SectionTitleComponent
					sx={{
						padding: '24px 24px 0',
					}}
					boxTitle={
						<Typography
							variant="h3"
							sx={{
								fontWeight: 700,
								fontSize: '21px',
								lineHeight: '145%',
								color: 'grey.900',
								display: 'inline-block',
							}}>
							한 {getPeriodText()}간&nbsp;
							<Typography
								variant="h3"
								sx={{
									fontWeight: 700,
									fontSize: '21px',
									lineHeight: '145%',
									color: 'primary.main',
									display: 'inline-block',
								}}>
								{guaranteeData[period] &&
								guaranteeData[period]?.walletLink
									? guaranteeData[period]?.walletLink.linked
									: 0}
							</Typography>
							명이 개런티를 연동했습니다.
						</Typography>
					}
					boxSubtitle={
						guaranteeData[period]?.walletLink.rate ? (
							<Typography
								variant="h3"
								sx={{
									fontWeight: 500,
									fontSize: '15px',
									lineHeight: '145%',
									color: 'grey.600',
									display: 'inline-block',
								}}>
								지난 {getPeriodText()} 대비 개런티 연동한
								고객이&nbsp;
								{guaranteeData[period]?.walletLink.rate > 0 ? (
									<Typography
										variant="h3"
										sx={{
											fontWeight: 500,
											fontSize: '15px',
											lineHeight: '145%',
											color: 'primary.main',
											display: 'inline-block',
										}}>
										{`${Math.abs(
											Math.round(
												Number(
													guaranteeData[period]
														?.walletLink.rate
												)
											)
										)}명 증가`}
									</Typography>
								) : (
									<Typography
										variant="h3"
										sx={{
											fontWeight: 500,
											fontSize: '15px',
											lineHeight: '145%',
											color: '#F8434E',
											display: 'inline-block',
										}}>
										{`${Math.abs(
											Math.round(
												Number(
													guaranteeData[period]
														?.walletLink.rate
												)
											)
										)}명 감소`}
									</Typography>
								)}
								했습니다.
							</Typography>
						) : (
							'비교 가능한 데이터가 없습니다.'
						)
					}
				/>

				<Box
					sx={{
						margin: 'auto',
						marginTop: '4px',
						paddingRight: '24px',
						paddingLeft: '4px',

						img: {margin: 'auto', maxWidth: '80px'},
						position: 'relative',
					}}>
					<Stack
						sx={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							maxWidth: '374px',
							minWidth: '374px',
							margin: 'auto',
							marginLeft: '113px',
							marginBottom: '12px',
						}}>
						<DataWithToolTipBox
							data={{
								title: '전송',
								content: '고객에게 전송한 알림톡 건수입니다.',
								count: commaFormNumber(
									guaranteeData[period]?.walletLink
										?.confirmCount
								),
								openState: tooltipState.send,
								toolTipHandler: () => toolTipHandler('send'),
							}}
						/>

						<IcChevronRight color="#8E8E98" />
						<DataWithToolTipBox
							data={{
								title: '조회',
								content:
									'개런티 알림톡을 클릭해서 조회한 고객의 수 입니다.',
								count: commaFormNumber(
									guaranteeData[period]?.walletLink?.viewCount
								),
								openState: tooltipState.view,
								toolTipHandler: () => toolTipHandler('view'),
							}}
						/>
						<IcChevronRight color="#8E8E98" />
						<DataWithToolTipBox
							data={{
								title: '연동',
								content:
									'개런티 알림톡을 클릭해서 버클 월렛을 연동한 고객의 수 입니다.',
								count: commaFormNumber(
									guaranteeData[period]?.walletLink?.linked
								),
								openState: tooltipState.link,
								toolTipHandler: () => toolTipHandler('link'),
							}}
						/>
					</Stack>

					<Chart {...barChartData} />
				</Box>
			</SectionBox>

			<Stack flexDirection={'row'} gap="20px">
				<SectionBox
					sx={{
						minWidth: '285px',
						minHeight: '400px',
						maxHeight: '400px',
					}}>
					<SectionTitleComponent boxTitle={'Top 구매고객'} />

					<Stack
						sx={{
							display: 'flex',
							flexDirection: 'row',

							button: {
								width: '88px',
								height: '32px',
								fontWeight: 400,
								fontSize: '13px',
								lineHeight: '14px',
								color: 'grey.600',
								backgroundColor: 'transparent',
								padding: '9px 0px',
								border: 0,
							},
						}}>
						<ButtonStyle
							isSelected={
								topCustomerTypeData === 'times' ? true : false
							}>
							<button
								data-customer="times"
								onClick={customerStateHandler}>
								구매수량
							</button>
						</ButtonStyle>
						<ButtonStyle
							isSelected={
								topCustomerTypeData === 'amount' ? true : false
							}>
							<button
								data-customer="amount"
								onClick={customerStateHandler}>
								결제금액
							</button>
						</ButtonStyle>
					</Stack>

					<Stack
						sx={{
							alignItems: 'center',
							marginTop: '24px',
							height: '242px',
						}}>
						{topCustomerData && topCustomerData.length > 0 ? (
							<>
								<Stack
									gap="16px"
									sx={{width: '100%', height: '100%'}}>
									{topCustomerData.map(
										(info, idx) =>
											idx + 1 < 6 && (
												<TopBoxComponent
													type={topCustomerTypeData}
													topData={info}
													order={idx}
													key={`top-customers-info-box-${idx}`}
												/>
											)
									)}
								</Stack>

								<Stack mt={'8px'}>
									<Button
										variant="outlined"
										color="black"
										height={32}
										sx={{margin: '0px auto 11px'}}
										onClick={goToCustomerListPage}>
										더보기
									</Button>
								</Stack>
							</>
						) : (
							<>
								<Box
									sx={{
										width: '80px',
										margin: 'auto',
										marginTop: '17px',
										marginBottom: '16px',
										img: {margin: 'auto', maxWidth: '80px'},
									}}>
									<img
										src={imgDefaultBarChart2x}
										alt="pie chart"
									/>
								</Box>

								<Stack
									sx={{
										textAlign: 'center',
										marginBottom: '16px',
										fontWeight: 500,
										fontSize: '15px',
										lineHeight: '145%',

										color: 'grey.600',
									}}>
									발급된 개런티가 없습니다.
									<br />
									개런티를 발급하고 Top 구매고객을
									<br />
									확인해보세요!
									<br />
								</Stack>

								<Button
									variant="outlined"
									height={32}
									sx={{
										borderColor: 'grey.100',
									}}
									onClick={goToGuaranteeIssuePage}>
									개런티 발급하기
								</Button>
							</>
						)}
					</Stack>
				</SectionBox>

				<SectionBox
					sx={{
						minWidth: '285px',
						minHeight: '400px',
						maxHeight: '400px',
					}}>
					<SectionTitleComponent
						BoxMarginBottom="12px"
						boxTitle={
							hasRepairData ? (
								'수선신청 현황'
							) : (
								<Typography
									variant="h3"
									sx={{
										fontWeight: 700,
										fontSize: '21px',
										lineHeight: '145%',
										color: 'grey.900',
										display: 'inline-block',
									}}>
									고객 수선 신청 접수를
									<br />
									한곳에서 관리하세요!
								</Typography>
							)
						}
					/>

					{!hasRepairData && (
						<Stack
							sx={{
								width: '160px',
								button: {
									fontWeight: 500,
									fontSize: '14px',
									lineHeight: '145%',
									color: '#526EFF',
									border: 0,
									background: 'none',
									textAlign: 'left',
									padding: 0,
									cursor: 'pointer',
								},
							}}>
							<button
								onClick={
									goToServiceInterworkPage
								}>{`수선신청 관리 연동하기 >`}</button>
						</Stack>
					)}

					{hasRepairData ? (
						<Box
							sx={{
								margin: 'auto',
								padding: '28px 0px 0px',
							}}>
							{repairStateList.map((state, idx) => (
								<Stack
									key={`repair-state-box-${idx}`}
									sx={{
										borderBottom:
											idx !== 2
												? '1px solid #E2E2E9'
												: 'none',
										marginBottom:
											idx !== 2 ? '30px' : '0px',
										flexDirection: 'row',
										alignItems: 'center',
										paddingBottom:
											idx !== 2 ? '30px' : '0px',
										// height: '48px',
									}}>
									<Box
										mr="12px"
										sx={{
											img: {
												minWidth: '40px',
												minHeight: '40px',
												maxWidth: '40px',
												maxHeight: '40px',
											},
										}}>
										<img
											src={state.icon}
											alt="repair-status-icon"
										/>
									</Box>
									<Box>
										<Typography
											sx={{
												fontWeight: 700,
												fontSize: '13px',
												lineHeight: '145%',
												color: 'grey.500',
											}}>
											{state.title}
										</Typography>
										<Box
											display={'flex'}
											flexDirection="row"
											alignItems={'center'}
											onClick={() =>
												goToRepairListPage(state.title)
											}
											sx={{
												svg: {
													cursor: 'pointer',
												},
											}}>
											<Typography
												variant="h6"
												sx={{
													fontWeight: 700,
													fontSize: '21px',
													lineHeight: '145%',
													color: 'grey.900',
													marginRight: '2px',
												}}>
												{state.total}
											</Typography>
											<IcChevronRight
												width="12px"
												heigth="12px"
											/>
										</Box>
									</Box>
								</Stack>
							))}
						</Box>
					) : (
						<Box
							sx={{
								minWidth: '219px',
								minHeight: '200px',
								maxWidth: '219px',
								maxHeight: '200px',
								margin: 'auto',
								marginTop: '41px',
								img: {
									margin: 'auto',
									minWidth: '219px',
									minHeight: '200px',
									maxWidth: '219px',
									maxHeight: '200px',
								},
							}}>
							<img src={imgDefaultRepair2x} alt="repair tool" />
						</Box>
					)}
				</SectionBox>
			</Stack>
		</DashboardSection>
	);
}

export default DashboardCustomerSection;
