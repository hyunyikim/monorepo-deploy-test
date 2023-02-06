import {useEffect, useState} from 'react';
import {Box, TableRow, Typography} from '@mui/material';

import {getUserPricePlan} from '@/api/payment.api';
import {useList} from '@/utils/hooks';
import {getNftCustomerList} from '@/api/customer.api';
import {
	NftCustomerListRequestParam,
	NftCustomerListResponse,
	NftCustomerListRequestSearchType,
	ListRequestParam,
} from '@/@types';
import {
	initialSearchFilter,
	nftCustomerListSearchFilter,
	getWalletLinkChip,
	calculatePeriod,
	walletLinkOption,
} from '@/data';
import {
	formatPhoneNum,
	getDateByUnitHour,
	goToParentUrl,
	sendAmplitudeLog,
} from '@/utils';

import {
	TitleTypography,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Avatar,
	TableSellWithSort,
	HeadTableCell,
	TableCell,
	SearchFilterTab,
	Button,
} from '@/components';

import {imgBlurredCustomerList} from '@/assets/images/index';
import {useMessageDialog} from '@/stores';

const menu = 'useradmin';
const menuKo = '고객관리';

const {sort, ...customerInitialSearchFilter} = initialSearchFilter;

function CustomerList() {
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const [isPlanExpired, setIsPlanExpired] = useState<boolean>(false);

	useEffect(() => {
		sendAmplitudeLog(`${menu}_pv`, {pv_title: '고객관리 목록 진입'});
	}, []);

	const {
		isLoading,
		data,
		totalSize,
		filter,
		paginationProps,
		handleChangeFilter,
		handleSearch,
		handleReset,
	} = useList<
		NftCustomerListResponse,
		ListRequestParam<NftCustomerListRequestSearchType> &
			NftCustomerListRequestParam
	>({
		apiFunc: getNftCustomerList,
		initialFilter: {
			...customerInitialSearchFilter,
			// default 날짜가 14일이 아님
			startDate: calculatePeriod('all')[0],
			endDate: calculatePeriod('all')[1],
			wallet: 'ALL',
			orderBy: 'LATEST_ISSUED',
			orderDirection: 'DESC',
		},
	});

	const openExpiredModal = (_isFreeTrial: boolean) => {
		onMessageDialogOpen({
			title: '앗! 고객데이터가 보이지 않으신가요?!',
			message: _isFreeTrial ? (
				<>
					무료체험 기간이 종료되어 고객 데이터를 확인할 수 없어요.
					<br />
					유료 플랜을 구독하고 모든 고객 데이터를 확인하세요.
				</>
			) : (
				<>
					유료 플랜 구독이 종료되어 고객 데이터를 확인할 수 없어요.
					<br />
					유료 플랜을 구독하고 모든 고객 데이터를 확인하세요.
				</>
			),
			showBottomCloseButton: true,
			closeButtonValue: '닫기',
			disableClickBackground: true,
			buttons: (
				<Button
					color="black"
					onClick={() => {
						goToParentUrl('/b2b/payment/subscribe');
					}}>
					플랜 업그레이드 하기
				</Button>
			),
		});
	};

	const getCurrentPricePlanInfo = async () => {
		try {
			const {planExpireDate, planStartedAt, pricePlan, usedNftCount} =
				await getUserPricePlan();

			const originalExpireDate =
				typeof planExpireDate === 'string'
					? planExpireDate?.split('T')[0]
					: '';
			const expireDate = new Date(originalExpireDate).getTime();
			const currentDate = new Date().getTime();
			const isExpired = expireDate - currentDate < 0;
			const isFreeTrial =
				pricePlan?.planLevel === 0 &&
				pricePlan?.planName === '무료 체험';

			if (isExpired) {
				setIsPlanExpired(true);
				openExpiredModal(isFreeTrial);
			} else {
				setIsPlanExpired(false);
			}
		} catch (error) {
			console.log('error', error);
		}
	};

	useEffect(() => {
		getCurrentPricePlanInfo();
	}, []);

	return (
		<>
			<Box p={5}>
				<TitleTypography title="고객관리" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={nftCustomerListSearchFilter}
					periodIdx={6}
					onSearch={handleSearch}
					onReset={handleReset}
					onChangeFilter={handleChangeFilter}
				/>
				<SearchFilterTab
					options={walletLinkOption}
					selectedTab={filter.wallet}
					tabLabel={'customer wallet link'}
					onChangeTab={(value) =>
						handleChangeFilter({
							wallet: value,
						})
					}
				/>

				{isPlanExpired ? (
					<Box sx={{position: 'relative'}}>
						<Box
							sx={{
								width: '100%',
								height: '100%',
								minHeight: '593px',

								position: 'absolute',
								left: '-8px',
								top: '12px',
								zIndex: 3,

								overflow: 'hidden',
							}}>
							<img src={imgBlurredCustomerList} />
						</Box>
					</Box>
				) : (
					<>
						<TableInfo totalSize={totalSize} unit="명">
							<PageSelect
								value={filter.pageMaxNum}
								onChange={(value: {
									[key: string]: any;
									pageMaxNum: number;
								}) => {
									sendAmplitudeLog(
										`${menu}_unit_view_click`,
										{
											button_title: `노출수_${value.pageMaxNum}개씩`,
										}
									);
									handleChangeFilter(value);
								}}
							/>
						</TableInfo>

						<Table
							isLoading={isLoading}
							totalSize={totalSize}
							headcell={
								<>
									<TableSellWithSort
										label="이름"
										name="NAME"
										orderBy={filter.orderBy}
										orderDirection={filter.orderDirection}
										onSortClick={(value) =>
											handleChangeFilter(
												value as {[key: string]: any}
											)
										}
										minWidth={240}
									/>
									<HeadTableCell minWidth={180}>
										지갑 연동 상태
									</HeadTableCell>
									<HeadTableCell minWidth={300}>
										전화번호
									</HeadTableCell>
									<TableSellWithSort
										label="총 발급건수"
										name="NO_OF_GUARANTEE"
										orderBy={filter.orderBy}
										orderDirection={filter.orderDirection}
										onSortClick={(value) =>
											handleChangeFilter(
												value as {[key: string]: any}
											)
										}
										minWidth={240}
									/>
									<TableSellWithSort
										label="총 상품금액"
										name="TOTAL_PRICE"
										orderBy={filter.orderBy}
										orderDirection={filter.orderDirection}
										onSortClick={(value) =>
											handleChangeFilter(
												value as {[key: string]: any}
											)
										}
										minWidth={240}
									/>
									<TableSellWithSort
										label="최근 발급 시간"
										name="LATEST_ISSUED"
										orderBy={filter.orderBy}
										orderDirection={filter.orderDirection}
										onSortClick={(value) =>
											handleChangeFilter(
												value as {[key: string]: any}
											)
										}
										minWidth={240}
									/>
								</>
							}>
							{data &&
								data?.list?.length > 0 &&
								data?.list.map((item, idx) => (
									<TableRow key={`item_${idx}`}>
										<TableCell>
											{item?.customerName ? (
												<Box flexDirection="row">
													<Avatar
														sx={{
															borderRadius:
																'12px',
															fontSize: '12px',
														}}>
														{item?.customerName.slice(
															0,
															1
														)}
													</Avatar>
													<Typography
														variant="body3"
														className="underline"
														ml={'12px'}
														onClick={() => {
															const name =
																item?.customerName;
															const phone =
																item?.phone;
															if (!name || !phone)
																return;
															goToParentUrl(
																`/b2b/customer/${name}/${phone}`
															);
														}}>
														{item?.customerName}
													</Typography>
												</Box>
											) : (
												'-'
											)}
										</TableCell>
										<TableCell>
											{getWalletLinkChip(
												item?.walletLinked
											)}
										</TableCell>
										<TableCell>
											{item.phone
												? formatPhoneNum(item.phone)
												: '-'}
										</TableCell>
										<TableCell>
											{Number(
												item?.amount ?? 0
											).toLocaleString()}
										</TableCell>
										<TableCell>
											{item?.totalPrice
												? `${item?.totalPrice.toLocaleString()}원`
												: '-'}
										</TableCell>
										<TableCell>
											{item?.latestIssuedAt
												? getDateByUnitHour(
														new Date(
															item?.latestIssuedAt
														)
												  )
												: '-'}
										</TableCell>
									</TableRow>
								))}
						</Table>
						<Pagination {...paginationProps} />
					</>
				)}
			</Box>
		</>
	);
}

export default CustomerList;
