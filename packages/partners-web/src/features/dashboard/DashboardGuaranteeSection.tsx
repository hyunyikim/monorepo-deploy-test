import {Box, Stack, Typography} from '@mui/material';

import Chart from 'react-apexcharts';
import DashboardSection from '@/features/dashboard/common/DashboardSection';
import SectionBox from '@/features/dashboard/common/SectionBox';
import SectionTitleComponent from '@/features/dashboard/common/SectionTitleComponent';
import {
	IcChevronRight,
	IcDocsInGreyBox,
	IcWalletInGreen,
	IcCrossoutInRedBox,
	IcTickInBlueBox,
	IcArrow,
	IcDashBar,
} from '@/assets/icon';

import {useCheckboxList} from '@/utils/hooks';
import {imgDefaultPieChart, imgDefaultPieChart2x} from '@/assets/images';
import {formatCommaNum, dashboardDateStack, sendAmplitudeLog} from '@/utils';
import {
	DashboardPeriodType,
	IssueStatusType,
	IssuedFromType,
	IssuedGraphType,
	WalletLinkType,
} from '@/@types/dashboard.types';
import {useNavigate} from 'react-router-dom';
import {format, subDays, subWeeks} from 'date-fns';

type OverviewBoxProps = {
	title: string | number;
	difference: string | number;
	rate: string | number;
	count: string | number;
	img: HTMLImageElement | string;
	guaranteeVal: string;
	period: DashboardPeriodType;
};

const {today, previousWeek, previousMonth} = dashboardDateStack();

function GuaranteeOverviewBox({
	title = '0',
	difference = '0',
	rate = '0',
	count = '0',
	img,
	guaranteeVal,
	period,
}: OverviewBoxProps) {
	const navigate = useNavigate();

	const goToGuaranteeListPage = () => {
		if (title === '발급총액') {
			return;
		}
		let status = '';
		let statusCode = '';
		switch (title) {
			case '신청대기':
				status = 'waiting';
				statusCode = '1';
				break;
			case '발급완료':
				status = 'success';
				statusCode = '2%2C3%2C4';
				break;
			case '발급취소':
				status = 'cancel';
				statusCode = '9';
				break;
			default:
				break;
		}

		sendAmplitudeLog(`dashboard_${status}_click`, {
			pv_title: '개런티 목록으로 이동',
		});

		const from = period === 'WEEKLY' ? previousWeek : previousMonth;
		const to = today;

		navigate({
			pathname: '/b2b/guarantee',
			search: `?searchType=all&searchText=&startDate=${from}&endDate=${to}&sort=latest&currentPage=1&pageMaxNum=25&nft_req_state=${statusCode}&platform=`,
		});

		return;
	};

	return (
		<Box sx={{display: 'flex', gap: '12px', alignItems: 'center'}}>
			<Box
				sx={{
					img: {
						maxWidth: '40px',
						minWidth: '40px',
						maxHeight: '40px',
						minHeight: '40px',
					},
				}}>
				<img src={img} alt="overview img" />
			</Box>
			<Box sx={{display: 'flex', flexDirection: 'column'}}>
				<Box display="flex">
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '13px',
							lineHeight: '145%',
							color: 'grey.500',
							marginRight: '6px',
						}}>
						{title}
					</Typography>

					<Box display={'flex'} alignItems="center" gap="4px">
						{difference > 0 ? (
							<IcArrow color="#00C29F" />
						) : difference < 0 ? (
							<IcArrow transform="rotate(180)" color="#F8434E" />
						) : (
							<IcDashBar />
						)}
						<Typography
							sx={{
								fontWeight: 500,
								fontSize: '13px',
								lineHeight: '145%',
								color:
									difference > 0
										? '#00C29F'
										: difference < 0
										? '#F8434E'
										: 'grey.300',
							}}>
							{formatCommaNum(Math.abs(Number(difference))) || 0}
							{title === '발급총액' ? '원' : '건'}
						</Typography>

						<Typography
							sx={{
								fontWeight: 500,
								fontSize: '13px',
								lineHeight: '145%',
								color: 'grey.300',
							}}>
							|{/* &nbsp;|&nbsp; */}
						</Typography>

						<Typography
							sx={{
								fontWeight: 500,
								fontSize: '13px',
								lineHeight: '145%',
								color: 'grey.300',
							}}>
							{rate || 0}%
						</Typography>
					</Box>
				</Box>

				<Box
					display="flex"
					gap="2px"
					alignItems="center"
					sx={{cursor: title === '발급총액' ? 'auto' : 'pointer'}}
					onClick={goToGuaranteeListPage}>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '21px',
							lineHeight: '145%',
							color: 'grey.900',
						}}>
						{formatCommaNum(count) || 0}
						{title === '발급총액' ? '원' : null}
					</Typography>
					{title === '발급총액' ? null : (
						<IcChevronRight width="12" height="12" fill="#222227" />
					)}
				</Box>
			</Box>
		</Box>
	);
}
interface GuaranteeOverviewProps {
	period: DashboardPeriodType;
	guaranteeData: any;
	date: string;
}

function DashboardGuaranteeSection({
	period = 'WEEKLY',
	guaranteeData,
	date,
}: GuaranteeOverviewProps) {
	// const {previousWeek, previousMonth, today} = dashboardDateStack();
	let currentPeriod: {
		dateType: DashboardPeriodType;
		issueStatusCount: IssueStatusType;
		issuedFrom: IssuedFromType;
		issuedGraph: IssuedGraphType;
		walletLink: WalletLinkType;
	};

	if (guaranteeData) {
		currentPeriod =
			guaranteeData[
				period
			]; /* {issuedGraph, issueStatusCount, issuedFrom} = currentPeriod */
	} else {
		guaranteeData['WEEKLY'];
	}

	const getSortedData = (_obj: any) => {
		let etc = 0;
		let sortedValuesArr: number[] | [] = [];
		let sortedKeysArr: string[] | [] = [];
		if (_obj) {
			const doubleArr = Object.entries(_obj).sort((a, b) => b[1] - a[1]);

			doubleArr.forEach((arr, idx) => {
				if (idx < 3) {
					sortedKeysArr = [...sortedKeysArr, arr[0]];
					sortedValuesArr = [...sortedValuesArr, Number(arr[1])];
					return;
				} else {
					return (etc = Number(etc) + Number(arr[1]));
				}
			});

			if (Object.entries(_obj).length > 3) {
				return {
					keys: [...sortedKeysArr, '기타'],
					values: [...sortedValuesArr, etc],
				};
			} else {
				return {
					keys: sortedKeysArr,
					values: [...sortedValuesArr],
				};
			}
		}
	};

	const pieChartData = {
		type: 'donut',
		height: 265,
		series: getSortedData(currentPeriod?.issuedFrom.count)?.values,
		options: {
			labels: getSortedData(currentPeriod?.issuedFrom.count)?.keys,
			plotOptions: {
				pie: {
					size: 124,
					donut: {
						size: '40%',
					},
				},
			},
			dataLabels: {
				enabled: false,
			},
			legend: {
				show: true,
				position: 'bottom',
			},
			colors: ['#526eff', '#98A8FF', '#D6DCFF', '#E2E2E9'],
		},
	};

	const generateDefaultData = (_period: DashboardPeriodType) => {
		if (_period) {
			if (_period === 'WEEKLY') {
				/* 주간 데이터 */
				const result = Array(7)
					.fill('')
					.map((el, idx) => {
						const rawDate = subDays(new Date(today), idx);
						return {
							x: format(rawDate, 'MM/dd'),
							y: 0,
						};
					});

				return result.reverse();
			} else {
				/* 월간 데이터 */
				const result = Array(4)
					.fill('')
					.map((el, idx) => {
						const rawDate = subWeeks(new Date(today), idx);
						return {
							x: format(rawDate, 'MM/dd'),
							y: 0,
						};
					});

				return result.reverse();
			}
		}
	};

	const getMaxCount = () => {
		const lastRawData = currentPeriod?.issuedGraph?.last;
		const currentRawData = currentPeriod?.issuedGraph?.current;
		let maxCount = 1;

		if (lastRawData && currentRawData) {
			const allData = {...lastRawData, ...currentRawData};
			const lastDataArr = Object.keys(lastRawData);
			const currentDataArr = Object.keys(currentRawData);

			const dataArr = [...lastDataArr, ...currentDataArr];

			dataArr.forEach((date) => {
				if (allData[date] >= 5) {
					maxCount = 5;
				} else if (allData[date] > maxCount) {
					maxCount = allData[date];
				}
			});
		}

		return maxCount;
	};

	const lineDataGenerator = (
		_period: DashboardPeriodType,
		startDate: string,
		time: 'current' | 'last'
	) => {
		const rawData = currentPeriod?.issuedGraph[time];
		const currentRawData = currentPeriod?.issuedGraph?.current;
		const currentRawDataArr: string[] = currentRawData
			? Object.keys(currentRawData).reverse()
			: [];

		function isValidDate(_date) {
			return _date instanceof Date && !isNaN(_date);
		}

		if (
			rawData &&
			Object.keys(rawData).length > 0 &&
			currentRawDataArr &&
			currentRawDataArr.length > 0
		) {
			if (_period === 'WEEKLY') {
				/* 주간 데이터 */
				let result: {x: string; y: string}[] = [];
				Object.keys(rawData)
					.reverse()
					.forEach((date: string, idx: number) => {
						if (idx < 7) {
							if (isValidDate(new Date(currentRawDataArr[idx]))) {
								result = [
									...result,
									{
										x: format(
											new Date(currentRawDataArr[idx]),
											'MM/dd'
										),
										y: rawData[date],
									},
								];
							} else {
								result = [
									...result,
									{
										x: '-',
										y: 0,
									},
								];
							}
						}
					});

				return result;

				// return Object.keys(rawData)
				// 	.reverse()
				// 	.map((date: string, idx: number) => {
				// 		console.log('date', date);
				// 		console.log(
				// 			'currentRawDataArr[idx]',
				// 			currentRawDataArr[idx]
				// 		);
				// 		if (isValidDate(new Date(currentRawDataArr[idx]))) {
				// 			return {
				// 				x: format(
				// 					new Date(currentRawDataArr[idx]),
				// 					'MM/dd'
				// 				),
				// 				y: rawData[date],
				// 			};
				// 		} else {
				// 			console.log('date', date);
				// 			console.log(
				// 				'currentRawDataArr[idx]',
				// 				currentRawDataArr[idx]
				// 			);
				// 			return {
				// 				x: '11/22',
				// 				y: 0,
				// 			};
				// 		}
				// 	});
			} else {
				/* 월간 데이터 */
				let result: {x: string; y: string}[] = [];

				Object.keys(rawData)
					.reverse()
					.forEach((date: string, idx: number) => {
						if (idx < 4) {
							if (isValidDate(new Date(currentRawDataArr[idx]))) {
								result = [
									...result,
									{
										x: format(
											new Date(currentRawDataArr[idx]),
											'MM/dd'
										),
										y: rawData[date],
									},
								];
							} else {
								result = [
									...result,
									{
										x: '-',
										y: 0,
									},
								];
							}
						}
					});

				return result;

				// return Object.keys(rawData)
				// 	.reverse()
				// 	.map((date: string, idx: number) => {

				// 		if (isValidDate(new Date(currentRawDataArr[idx]))) {
				// 			return {
				// 				x: format(
				// 					new Date(currentRawDataArr[idx]),
				// 					'MM/dd'
				// 				),
				// 				y: rawData[date],
				// 			};
				// 		} else {
				// 			console.log('date222222', date);
				// 			console.log(
				// 				'currentRawDataArr[idx]22222222',
				// 				currentRawDataArr[idx]
				// 			);
				// 			return {
				// 				x: '11/22',
				// 				y: 0,
				// 			};
				// 		}
				// 	});
			}
		} else {
			return generateDefaultData(_period);
		}
	};

	const lineChartData = {
		type: 'line',
		height: 240,
		series: [
			{
				name: period === 'WEEKLY' ? '지난주' : '지난달',
				data: lineDataGenerator(
					period,
					period === 'WEEKLY' ? previousWeek : previousMonth,
					'last'
				),
			},
			{
				name: period === 'WEEKLY' ? '이번주' : '이번달',
				data: lineDataGenerator(period, today, 'current'),
			},
		],
		xaxis: {
			type: 'category',
		},

		options: {
			chart: {
				height: 240,
				type: 'line',
				zoom: {
					enabled: false,
				},
				toolbar: {
					show: false,
				},
			},
			// dataLabels: {
			// 	enabled: false,
			// },
			stroke: {
				show: true,
				curve: 'straight',
				width: 3,
			},
			yaxis: {
				tickAmount: getMaxCount(),
				min: 0,
				logBase: 10,
				labels: {
					formatter: (value: number) =>
						value > 0 ? value.toFixed(0) : 0,
				},
			},
			colors: ['#CACAD3', '#526EFF'],
		},
	};

	const overviewDataList = [
		{
			title: '신청대기',
			difference:
				currentPeriod?.issueStatusCount['1']?.count -
				currentPeriod?.issueStatusCount['1']?.lastCount,
			rate: Math.round(currentPeriod?.issueStatusCount['1']?.rate),
			count: currentPeriod?.issueStatusCount['1']?.count,
			img: IcDocsInGreyBox,
			guaranteeVal: '1',
		},
		{
			title: '발급완료',
			difference:
				currentPeriod?.issueStatusCount['3']?.count -
				currentPeriod?.issueStatusCount['3']?.lastCount,
			rate: Math.round(currentPeriod?.issueStatusCount['3']?.rate),
			count: currentPeriod?.issueStatusCount['3']?.count,
			img: IcTickInBlueBox,
			guaranteeVal: '2,3,4',
		},
		{
			title: '발급취소',
			difference:
				currentPeriod?.issueStatusCount['9']?.count -
				currentPeriod?.issueStatusCount['9']?.lastCount,
			rate: Math.round(currentPeriod?.issueStatusCount['9']?.rate),
			count: currentPeriod?.issueStatusCount['9']?.count,
			img: IcCrossoutInRedBox,
			guaranteeVal: '9',
		},
		{
			title: '발급총액',
			difference:
				currentPeriod?.issueStatusCount?.totalPrice?.price -
				currentPeriod?.issueStatusCount?.totalPrice?.lastPrice,
			rate: Math.round(currentPeriod?.issueStatusCount.totalPrice?.rate),
			count: currentPeriod?.issueStatusCount?.totalPrice?.price,
			img: IcWalletInGreen,
			guaranteeVal: '',
		},
	];

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
		<DashboardSection sectionTitle="개런티 발급 현황">
			<SectionBox sx={{minWidth: '590px', maxWidth: '590px'}}>
				<SectionTitleComponent
					boxTitle={
						<>
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
									{formatCommaNum(
										String(
											currentPeriod?.issuedGraph
												?.totalCount
										)
									) || 0}
								</Typography>
								건의
								<br /> 개런티를 발급완료 했습니다.
							</Typography>
						</>
					}
					boxSubtitle={
						currentPeriod?.issuedGraph?.rate ? (
							currentPeriod?.issuedGraph?.rate < 0 ? (
								<Typography
									variant="h4"
									sx={{
										fontWeight: 500,
										fontSize: '15px',
										lineHeight: '145%',
										color: 'grey.600',
										marginTop: '4px',
									}}>
									지난 {getPeriodText()} 대비 발급량이&nbsp;
									<Typography
										variant="h3"
										sx={{
											fontWeight: 700,
											fontSize: '15px',
											lineHeight: '145%',
											color: '#F8434E',
											display: 'inline-block',
										}}>
										{Math.abs(
											Math.round(
												currentPeriod.issuedGraph?.rate
											)
										)}
										% 감소
									</Typography>
									했습니다.
								</Typography>
							) : (
								<Typography
									variant="h4"
									sx={{
										fontWeight: 500,
										fontSize: '15px',
										lineHeight: '145%',
										color: 'grey.600',
										marginTop: '4px',
									}}>
									지난 {getPeriodText()} 대비 발급량이&nbsp;
									<Typography
										variant="h3"
										sx={{
											fontWeight: 700,
											fontSize: '15px',
											lineHeight: '145%',
											color: 'primary.main',
											display: 'inline-block',
										}}>
										{Math.abs(
											Math.round(
												currentPeriod.issuedGraph?.rate
											)
										)}
										% 증가
									</Typography>
									했습니다
								</Typography>
							)
						) : (
							'비교 가능한 데이터가 없습니다.'
						)
					}
				/>

				<Chart {...lineChartData} />
			</SectionBox>

			<Stack flexDirection={'row'} gap="20px" justifyContent={'center'}>
				<SectionBox sx={{minWidth: '285px', maxWidth: '285px'}}>
					<SectionTitleComponent boxTitle={'개런티 발급 요약'} />

					<Stack sx={{gap: '32px', minWidth: '285px'}}>
						{overviewDataList.map((li, idx) => (
							<GuaranteeOverviewBox
								period={period}
								title={li.title}
								difference={li.difference}
								rate={li.rate}
								count={li.count}
								img={li.img}
								guaranteeVal={li.guaranteeVal}
								key={`guarantee-issue-overview-box-${idx}`}
							/>
						))}
					</Stack>
				</SectionBox>

				<SectionBox sx={{minWidth: '285px', maxWidth: '285px'}}>
					<SectionTitleComponent
						boxTitle={
							currentPeriod?.issuedFrom?.most ? (
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
										{currentPeriod?.issuedFrom.most}
									</Typography>
									에서
									<br /> 가장 많이 발급했어요.
								</Typography>
							) : (
								<Typography
									variant="h3"
									sx={{
										fontWeight: 700,
										fontSize: '21px',
										lineHeight: '145%',
										color: 'grey.900',
									}}>
									한 {getPeriodText()}간 발급된
									<br /> 개런티가 없어요.
								</Typography>
							)
						}
						boxSubtitle={
							!currentPeriod?.issuedFrom.lastMost
								? '비교 가능한 데이터가 없습니다.'
								: currentPeriod?.issuedFrom.most ===
								  currentPeriod?.issuedFrom.lastMost
								? `지난 ${getPeriodText()}${
										getPeriodText() === '주' ? '와' : '과'
								  } 동일합니다.`
								: `지난 ${getPeriodText()}에는 ${
										currentPeriod?.issuedFrom?.lastMost
								  }에서 많이 발급했어요.`
						}
					/>

					<Box
						sx={{
							width: '100%',
							display: 'flex',
							justifyContent: 'center',
							marginTop: currentPeriod?.issuedFrom?.most
								? '0px'
								: '62px',
							img: {margin: 'auto', maxWidth: '160px'},
						}}>
						{currentPeriod?.issuedFrom?.most ? (
							<Chart {...pieChartData} />
						) : (
							<img src={imgDefaultPieChart2x} alt="pie chart" />
						)}
					</Box>
				</SectionBox>
			</Stack>
		</DashboardSection>
	);
}

export default DashboardGuaranteeSection;
