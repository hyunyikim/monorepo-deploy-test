import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	ReactElement,
	ReactNode,
} from 'react';

import {
	Box,
	Stack,
	Typography,
	Grid,
	Card,
	useTheme,
	SxProps,
} from '@mui/material';

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
} from '@/assets/icon';

type OverviewBoxProps = {
	title: string | number;
	difference: string | number;
	rate: string | number;
	total: string | number;
	img: HTMLImageElement | string;
};
function GuaranteeOverviewBox({
	title = '0',
	difference = '0',
	rate = '0',
	total = '0',
	img,
}: OverviewBoxProps) {
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
						신청대기
					</Typography>

					<Typography
						sx={{
							fontWeight: 500,
							fontSize: '13px',
							lineHeight: '145%',
							color: 'grey.300',
						}}>
						0건 |&nbsp;
					</Typography>
					<Typography
						sx={{
							fontWeight: 500,
							fontSize: '13px',
							lineHeight: '145%',
							color: 'grey.300',
						}}>
						0%
					</Typography>
				</Box>

				<Box
					display="flex"
					gap="2px"
					alignItems="center"
					sx={{cursor: 'pointer'}}>
					<Typography
						sx={{
							fontWeight: 700,
							fontSize: '21px',
							lineHeight: '145%',
							color: 'grey.900',
						}}>
						0
					</Typography>
					<IcChevronRight width="12" height="12" fill="#222227" />
				</Box>
			</Box>
		</Box>
	);
}

function DashboardGuaranteeSection(/* {_chartData} */) {
	const defaultChartData = {
		series: [
			{
				name: 'guaratnee-issued-chart',
				data: [0, 0, 0, 0, 0, 0, 0],
			},
		],
		options: {
			chart: {
				height: 300,
				type: 'line',
				toolbar: {
					show: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'straight',
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
			colors: ['#526EFF', '#8E8E98'],
			xaxis: {
				categories: [
					'Jan',
					'Feb',
					'Mar',
					'Apr',
					'May',
					'Jun',
					'Jul',
					'Aug',
					'Sep',
				],
			},
			legend: {
				show: true,
				position: 'bottom',
			},
		},
	};

	const chartData = {
		series: [
			{
				name: 'Desktops',
				data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
			},
		],
		options: {
			chart: {
				height: 300,
				type: 'line',
				zoom: {
					enabled: false,
				},
				toolbar: {
					show: false,
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'straight',
			},
			// grid: {
			// 	row: {
			// 		colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
			// 		opacity: 0.5,
			// 	},
			// },
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
				categories: [
					'Jan',
					'Feb',
					'Mar',
					'Apr',
					'May',
					'Jun',
					'Jul',
					'Aug',
					'Sep',
				],
			},
		},
	};

	const overviewDataList = [
		{
			title: '신청대기',
			difference: '',
			rate: '',
			total: '',
			img: IcDocsInGreyBox,
		},
		{
			title: '발급완료',
			difference: '',
			rate: '',
			total: '',
			img: IcTickInBlueBox,
		},
		{
			title: '발급취소',
			difference: '',
			rate: '',
			total: '',
			img: IcCrossoutInRedBox,
		},
		{
			title: '발급총액',
			difference: '',
			rate: '',
			total: '',
			img: IcWalletInGreen,
		},
	];

	return (
		<DashboardSection sectionTitle="개런티 발급 현황">
			<SectionBox>
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
								하루 동안
								<Typography
									variant="h3"
									sx={{
										fontWeight: 700,
										fontSize: '21px',
										lineHeight: '145%',
										color: 'primary.main',
										display: 'inline-block',
									}}>
									0
								</Typography>
								건의
								<br /> 개런티를 발급완료 했습니다.
							</Typography>
						</>
					}
					boxSubtitle={'비교 가능한 데이터가 없습니다.'}
				/>

				<Chart {...defaultChartData} />
			</SectionBox>

			{/*  */}
			{/*  */}
			{/*  */}
			<SectionBox>
				<SectionTitleComponent boxTitle={'개런티 발급 요약'} />

				<Stack sx={{gap: '32px', minWidth: '285px'}}>
					{overviewDataList.map((li, idx) => (
						<GuaranteeOverviewBox
							title={li.title}
							difference={li.difference}
							rate={li.rate}
							total={li.total}
							img={li.img}
						/>
					))}
				</Stack>
			</SectionBox>

			{/*  */}
			{/*  */}
			{/*  */}
			<SectionBox>
				<SectionTitleComponent
					boxTitle={'한 주간 발급된 개런티가 없어요.'}
					boxSubtitle={'비교 가능한 데이터가 없습니다.'}
				/>
			</SectionBox>
		</DashboardSection>
	);
}

export default DashboardGuaranteeSection;
