import {useCallback, useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {addDays, format, lastDayOfMonth} from 'date-fns';

import {Box, Stack, Typography, Grid, Card, useTheme} from '@mui/material';
import Chart from 'react-apexcharts';
import {ApexOptions} from 'apexcharts';

import {getNftStatistics} from '@/api/statistics.api';
import {StatisticsResponse} from '@/@types';
import useDashboardStyles from './useDashboardStyles';
import {useBackground} from '@/utils/hooks';
import {useOpen} from '@/utils/hooks';

import NoticeSlider from './NoticeSlider';
import DashboardGuaranteeCard from './DashboardGuaranteeCard';
import DashboardDialog from './DashboardDialog';
import {
	IcGuaranteeIssuePending,
	IcGuaranteeIssueSuccess,
	IcGuaranteeIssueCancel,
} from '@/assets/icon';
import {
	ImgBgCards,
	ImgBgCards2x,
	ImgConnectService,
	ImgConnectService2x,
	ImgConnectServiceButton,
	ImgConnectServiceButton2x,
} from '@/assets/images';

const getChartOption = (daily: StatisticsResponse) => ({
	type: 'bar',
	height: 250,
	options: {
		chart: {
			id: 'main-chart',
			stacked: true,
			sparkline: {
				enabled: true,
			},
			toolbar: {
				show: false,
			},
			style: {
				paddingLeft: '10px',
			},
		},
		stroke: {
			curve: 'smooth',
			width: 0,
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
		colors: ['#bdc7ff', '#98A8FF', '#526eff'],
		xaxis: {
			labels: {
				show: true,
				style: {
					colors: Array(15)
						.fill(null)
						.map(() => '#8E8E98'),
				},
			},
		},
		yaxis: {
			min: 0,
			//max: 200,
			logBase: 10,
			tickAmount: 3,
			labels: {
				show: true,
				maxWidth: 58,
				formatter: (val: number) => val.toFixed(0),
				style: {
					colors: Array(4)
						.fill(null)
						.map(() => '#8E8E98'),
				},
			},
		},
		legend: {
			show: false,
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: '55%',
			},
		},
		tooltip: {
			fixed: {
				enabled: false,
			},
			x: {
				show: false,
			},
			y: {
				show: false,
			},
			marker: {
				show: false,
			},
		},
	} as ApexOptions,
	series: [
		{
			name: '발급취소',
			data: daily.map((day) => {
				return {
					x: format(new Date(day.reference.from), 'M.d'),
					y: Number(day.canceled),
				};
			}),
		},
		{
			name: '신청대기',
			data: daily.map((day) => {
				return {
					x: format(new Date(day.reference.from), 'M.d'),
					y: Number(day.ready),
				};
			}),
		},
		{
			name: '발급완료',
			data: daily.map((day) => {
				return {
					x: format(new Date(day.reference.from), 'M.d'),
					y:
						Number(day.requested) +
						Number(day.confirmed) +
						Number(day.completed),
				};
			}),
		},
	],
});

// TODO: skeleton
// TODO: 렌더링 2번
function Dashboard() {
	const navigate = useNavigate();
	const theme = useTheme();
	const classes = useDashboardStyles();
	const [updatedDate, setUpdatedDate] = useState<string | null>(null);
	const [daily, setDaily] = useState<StatisticsResponse | null>(null);
	const [weekly, setWeekly] = useState<StatisticsResponse | null>(null);
	const [monthly, setMonthly] = useState<StatisticsResponse | null>(null);

	useBackground(theme.palette.grey[50]);
	const {open, onClose} = useOpen({
		initialOpen: true,
	});

	useEffect(() => {
		// const today = new Date();
		// const firstDate = format(today, 'yyyy-MM-01');
		// const lastDate = format(lastDayOfMonth(today), 'yyyy-MM-dd');
		// const tomorrow = addDays(today, 1);
		// const before14day = addDays(today, -13);
		// setUpdatedDate(
		// 	today.toLocaleString('ko-KR', {
		// 		year: 'numeric',
		// 		month: 'long',
		// 		day: 'numeric',
		// 		hour: 'numeric',
		// 		minute: 'numeric',
		// 	})
		// );
		// (async () => {
		// 	const [monthly, weekly, daily] = await Promise.all([
		// 		getNftStatistics({
		// 			from: firstDate,
		// 			to: lastDate,
		// 			groupBy: 'MONTH',
		// 			groupSize: 1,
		// 		}),
		// 		getNftStatistics({
		// 			from: format(before14day, 'yyyy-MM-dd'),
		// 			to: format(tomorrow, 'yyyy-MM-dd'),
		// 			groupBy: 'DAY',
		// 			groupSize: 1,
		// 		}),
		// 		getNftStatistics({
		// 			from: format(before14day, 'yyyy-MM-dd'),
		// 			to: format(tomorrow, 'yyyy-MM-dd'),
		// 			groupBy: 'DAY',
		// 			groupSize: 1,
		// 		}),
		// 	]);
		// 	console.log(
		// 		'monthly, weekly, daily :>> ',
		// 		monthly.data,
		// 		weekly.data,
		// 		daily.data
		// 	);
		// 	setMonthly(monthly.data);
		// 	setWeekly(weekly.data);
		// 	setDaily(daily.data);
		// })();
	}, []);

	const chartOption = useMemo(() => {
		if (!daily) return;
		return getChartOption(daily);
	}, [daily]);

	const handleDataClick = useCallback((_type: any) => {
		let val;
		switch (_type) {
			case 'ready':
				val = '1';
				break;
			case 'completed':
				val = '2,3,4';
				break;
			case 'canceled':
				val = '9';
				break;
			default:
				break;
		}

		// TODO: query string 함께 보내기
		navigate('/guarantee');
		// history.push({
		// 	pathname: '/b2b/guarantee',
		// 	search: queryToString({nft_req_state: val}),
		// });
	}, []);

	// TODO:
	const goToConnectPage = useCallback(() => {
		// history.push({pathname: '/b2b/interwork'});
		// navigate('/b2b/interwork')
	}, []);

	// TODO:
	// 모달 닫기
	// const onClose = () => {
	// 	// dispatch(setClose());
	// 	// dispatch(clearError());
	// };

	return (
		<>
			<Box
				sx={{
					width: '100%',
					marginTop: 2,
					'& .MuiCard-root': {
						boxShadow: 'none',
					},
				}}>
				<Stack alignItems="flex-start" spacing={2} sx={{mb: 5}}>
					<Typography variant="h2">오늘 현황</Typography>
					<Typography variant="subtitle2">
						{updatedDate} 기준
					</Typography>
				</Stack>
				<NoticeSlider />
				<Grid container spacing={5}>
					<Grid item xs={12} md={9}>
						<Card className={classes.chartCard}>
							<Box
								sx={{
									p: 4,
								}}>
								<Typography
									variant="h3"
									sx={{mb: 2, fontSize: '20px'}}>
									개런티 발행현황
								</Typography>
								<Grid
									container
									flexWrap="nowrap"
									direction="row">
									<Grid
										item
										container
										direction="column"
										sx={{maxWidth: '220px'}}>
										<dl className="data-dl">
											<dd className="value">
												<strong>
													{`${
														daily
															? daily.reduce(
																	(
																		sum,
																		day
																	) =>
																		Number(
																			sum
																		) +
																		Number(
																			day.requested
																		) +
																		Number(
																			day.confirmed
																		) +
																		Number(
																			day.completed
																		),
																	0
															  )
															: 0
													}`.toLocaleString()}
												</strong>
												건
											</dd>
											<dt className="title">
												지난 14일 개런티 발급건수
											</dt>
										</dl>
									</Grid>
									{chartOption && (
										<Grid item className="chart-wrap">
											<Chart
												type="bar"
												height={250}
												options={chartOption.options}
												series={chartOption.series}
											/>
										</Grid>
									)}
								</Grid>
							</Box>
						</Card>
					</Grid>
					<Grid item xs={12} md={3}>
						<Card
							sx={{
								p: 4,
							}}
							className={classes.totalMonthlyCard}>
							<dl className="data-dl">
								<dt className="title">
									{new Date().getMonth() + 1}월 디지털 개런티
									발급건수
								</dt>
								<dd className="value">
									<strong>
										{monthly &&
											`${
												Number(
													monthly[0]?.requested || 0
												) +
												Number(
													monthly[0]?.confirmed || 0
												) +
												Number(
													monthly[0]?.completed || 0
												)
											}`.toLocaleString()}
									</strong>
								</dd>
							</dl>
							<img
								src={`${ImgBgCards}`}
								srcSet={`${ImgBgCards} 1x, ${ImgBgCards2x} 2x`}
								alt="cards"
								className={classes.cardsImg}
							/>
						</Card>
					</Grid>
					<DashboardGuaranteeCard
						title="신청대기"
						value={
							weekly
								? weekly.reduce(
										(sum, day) =>
											Number(sum) + Number(day.ready),
										0
								  )
								: 0
						}
						handleClick={() => handleDataClick('ready')}
						style={classes.statusWeeklyCard}
						icon={<IcGuaranteeIssuePending />}
					/>
					<DashboardGuaranteeCard
						title="발급완료"
						value={
							weekly
								? weekly.reduce(
										(sum, day) =>
											Number(sum) +
											Number(day.requested) +
											Number(day.confirmed) +
											Number(day.completed),
										0
								  )
								: 0
						}
						handleClick={() => handleDataClick('completed')}
						style={classes.statusWeeklyCard}
						icon={<IcGuaranteeIssueSuccess />}
					/>
					<DashboardGuaranteeCard
						title="발급취소"
						value={
							weekly
								? weekly.reduce(
										(sum, day) =>
											Number(sum) + Number(day.canceled),
										0
								  )
								: 0
						}
						handleClick={() => handleDataClick('canceled')}
						style={classes.statusWeeklyCard}
						icon={<IcGuaranteeIssueCancel />}
					/>
					{/* 서비스 연동 */}
					<Grid item xs={12} md={3}>
						<Card
							sx={{
								cursor: 'pointer',
								backgroundColor: '#D6DCFF',
								':hover': {
									boxShadow:
										'0 2px 14px 0 rgb(32 40 45 / 8%)',
								},
							}}
							onClick={goToConnectPage}>
							<Box
								sx={{
									p: 3,
								}}
								className={classes.connectServiceCard}>
								<div
									style={{
										background: `-webkit-image-set(url(${ImgConnectService}) 1x, url(${ImgConnectService2x}) 2x)`,
									}}
									className={classes.connectServiceButton}
								/>
								<img
									className={classes.btnConnect}
									src={`${ImgConnectServiceButton}`}
									srcSet={`${ImgConnectServiceButton} 1x, ${ImgConnectServiceButton2x} 2x`}
									alt="icon"
								/>
							</Box>
						</Card>
					</Grid>
				</Grid>
			</Box>
			<DashboardDialog open={open} onClose={onClose} />
		</>
	);
}

export default Dashboard;
