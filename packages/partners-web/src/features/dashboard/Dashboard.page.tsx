import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {addDays, format, lastDayOfMonth} from 'date-fns';

import DashboardGuaranteeSection from '@/features/dashboard/DashboardGuaranteeSection';

import {Box, Stack, useTheme, SelectChangeEvent} from '@mui/material';
import Chart from 'react-apexcharts';
import {ApexOptions} from 'apexcharts';
import {StatisticsResponse} from '@/@types';
import DashboardCustomerSection from './DashboardCustomerSection';
import DashboardInfoCentreSection from './DashboardInfoCentreSection';
import DashboardDialog from '@/features/dashboard/DashboardDialog';

import {Select} from '@/components';
import {
	getDashboardGuaranteeOverview,
	getDashboardCustomerOverview,
	getDashboardRepairOverview,
} from '@/api/dashboard';
import {
	dashboardGuaranteeStore,
	dashboardCustomerStore,
	dashboardRepairStore,
} from '../../stores/dashboard.store';
import {
	DashboardPeriodType,
	DashboardGuranteeParamsType,
	DashboardCustomersParamsType,
	DashboardCustomerOverviewType,
} from '../../@types/dashboard.types';

import {useGetPartnershipInfo, useModalStore} from '@/stores';
import NoticeModal from './common/NoticeModal';
import {dashboardDateStack, sendAmplitudeLog} from '@/utils';
import DashboardSettingHelper from '@/features/dashboard/DashboardSettingHelper';

function Dashboard() {
	const theme = useTheme();
	const {data: partnershipData} = useGetPartnershipInfo();
	const setModal = useModalStore((state) => state.setModalOption);
	const resetModal = useModalStore((state) => state.setIsOpen);
	const {previousWeek, previousMonth, today} = dashboardDateStack();
	const [periodState, setPeriodState] =
		useState<DashboardPeriodType>('WEEKLY');

	/* 개런티 발급 현황 데이터 */
	const {data: guaranteeOverviewData, setData: setGuaranteeOverviewData} =
		dashboardGuaranteeStore((state) => state);
	/* 고객현황 데이터 */
	const {data: customerOverviewData, setData: setCustomerOverviewData} =
		dashboardCustomerStore((state) => state);
	/* 수선현황 데이터 */
	const {data: repairOverviewData, setData: setRepairOverviewData} =
		dashboardRepairStore((state) => state);

	const getGuaranteeData = async (_type: DashboardPeriodType) => {
		try {
			const data = await getDashboardGuaranteeOverview({
				dateType: _type,
			});

			if (data) {
				setGuaranteeOverviewData({
					[_type]: data,
				});
			}
		} catch (e) {
			console.log('e', e);
		}
	};

	const getCustomerData = async (_type: DashboardPeriodType) => {
		try {
			const params: DashboardCustomersParamsType = {
				from: _type === 'WEEKLY' ? previousWeek : previousMonth,
				to: today,
			};

			const data = await getDashboardCustomerOverview(params);

			if (data) {
				setCustomerOverviewData({
					[_type]: data,
				});
			}
		} catch (e) {
			console.log('e', e);
		}
	};
	const getRepairData = async (_type: DashboardPeriodType) => {
		try {
			const params: DashboardCustomersParamsType = {
				from: _type === 'WEEKLY' ? previousWeek : previousMonth,
				to: today,
			};

			const data = await getDashboardRepairOverview(params);

			if (data) {
				setRepairOverviewData({
					[_type]: data,
				});
			}
		} catch (e) {
			console.log('e', e);
		}
	};

	const selectBoxHandler = (e: SelectChangeEvent<unknown>) => {
		const value = e.target.value as DashboardPeriodType;
		sendAmplitudeLog(
			value === 'WEEKLY'
				? 'dashboard_filter_week_click'
				: 'dashboard_filter_month_click',
			{
				pv_title: `대시보드 데이터 ${
					value === 'WEEKLY' ? '주' : '월'
				}간 기준으로 표시`,
			}
		);
		setPeriodState(value);
	};

	useEffect(() => {
		getGuaranteeData(periodState);
		getCustomerData(periodState);
		if (partnershipData?.useRepair === 'Y') {
			getRepairData(periodState);
		} else {
			setRepairOverviewData({WEEKLY: null, MONTHLY: null});
		}
	}, [periodState, partnershipData]);

	useEffect(() => {
		if (partnershipData && partnershipData?.companyName) {
			const noMoreNoticePopup = localStorage.getItem(
				`230213_notice_${partnershipData?.companyName}`
			);

			if (!noMoreNoticePopup || noMoreNoticePopup !== 'true') {
				setModal({
					isOpen: true,
					title: '버클 서비스 이용약관 및 개인정보처리방침 개정 안내',
					titlePadding: '40px 32px',
					children: <NoticeModal closeModal={closeNoticeModal} />,
					buttonTitle: '',
					maxWidth: '900px',
					width: '100%',
					align: 'center',
					titleAlign: 'left',
					showCloseButton: false,
					sx: {
						'& .MuiDialog-container': {
							'& .MuiPaper-root': {
								height: '600px',
								'& .MuiDialogContent-root': {
									paddingTop: {
										xs: '0px !important',
										sm: '4px !important',
									},
								},
							},
							'& .MuiDialogContent-root': {
								paddingBottom: '32px',
								padding: {xs: '0px 20px 24px 20px', sm: '32px'},
								'> div': {
									height: '100%',
								},
							},
						},
					},
					useBackgroundClickClose: false,
					amplitudeInfo: {},
				});
			}
		}
	}, [partnershipData]);

	const closeNoticeModal = () => {
		resetModal(false);

		if (partnershipData && partnershipData?.companyName) {
			localStorage.setItem(
				`230213_notice_${partnershipData.companyName}`,
				'true'
			);
		}
	};

	useEffect(() => {
		sendAmplitudeLog('dashboard_pv', {pv_title: '대시보드 노출'});
	}, []);

	return (
		<Stack p={5} gap="20px">
			{/* 개런티 세팅, 카카오연동, 카페24연동 유도 섹션 */}
			<DashboardSettingHelper partnershipData={partnershipData} />

			{/* 데이터 기간 조희 셀렉트 */}
			<Stack
				sx={{
					flexDirection: 'row',
					gap: '8px',
					marginBottom: '40px',
					maxWidth: '1200px',
					margin: 'auto',
					width: '100%',
					[theme.breakpoints.down(1330)]: {
						width: '590px',
						margin: 'auto',
					},
				}}>
				<Select
					height={40}
					value={periodState}
					options={[
						{
							label: '주간',
							value: 'WEEKLY',
						},
						{
							label: '월간',
							value: 'MONTHLY',
						},
					]}
					onChange={selectBoxHandler}
					sx={{
						minWidth: '150px',
						marginRight: '8px',
					}}
				/>

				<Box
					sx={{
						height: '40px',
						background: '#FFFFFF',
						padding: '9px 16px 8px',
						border: '1px solid',
						borderColor: 'grey.100',
						borderRadius: '4px',
						fontWeight: 500,
						fontSize: '16px',
						lineHeight: '145%',
						color: 'grey.500',
					}}>
					{periodState === 'WEEKLY' ? previousWeek : previousMonth} ~{' '}
					{today}
				</Box>
			</Stack>

			<DashboardGuaranteeSection
				period={periodState}
				guaranteeData={guaranteeOverviewData}
				date={periodState === 'WEEKLY' ? previousWeek : previousMonth}
			/>

			<DashboardCustomerSection
				period={periodState}
				guaranteeData={guaranteeOverviewData}
				customerData={customerOverviewData}
				repairData={repairOverviewData}
				partnershipData={partnershipData}
			/>
			<DashboardInfoCentreSection />
		</Stack>
	);
}

export default Dashboard;
