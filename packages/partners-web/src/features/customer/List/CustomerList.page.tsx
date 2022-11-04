import {useEffect} from 'react';
import {Box, TableRow, Typography} from '@mui/material';
import {TableCell} from '@/components';

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
} from '@/data';
import {
	formatPhoneNum,
	getDateByUnitHour,
	goToParentUrl,
	trackingToParent,
} from '@/utils';

import {
	ListTitle,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Avatar,
	TableSellWithSort,
} from '@/components';

const menu = 'useradmin';
const menuKo = '고객관리';

const {sort, ...customerInitialSearchFilter} = initialSearchFilter;

function CustomerList() {
	useEffect(() => {
		trackingToParent(`${menu}_pv`, {pv_title: '고객관리 목록 진입'});
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
	return (
		<>
			<Box>
				<ListTitle title="고객관리" />
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
				<TableInfo totalSize={totalSize} unit="명">
					<PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {
							[key: string]: any;
							pageMaxNum: number;
						}) => {
							trackingToParent(`${menu}_unit_view_click`, {
								button_title: `노출수_${value.pageMaxNum}개씩`,
							});
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
								colSpan={2}
								sx={{
									minWidth: '150px',
								}}
							/>
							<TableCell>지갑 연동 상태</TableCell>
							<TableCell
								colSpan={3}
								sx={{
									minWidth: '300px',
								}}>
								전화번호
							</TableCell>
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
							/>
						</>
					}>
					{data &&
						data?.list?.length > 0 &&
						data?.list.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell colSpan={2}>
									{item?.customerName ? (
										<Box flexDirection="row">
											<Avatar
												sx={{
													borderRadius: '12px',
													fontSize: '12px',
												}}>
												{item?.customerName.slice(0, 1)}
											</Avatar>
											<Typography
												fontSize={14}
												className="underline"
												ml={'12px'}
												onClick={() => {
													const name =
														item?.customerName;
													const phone = item?.phone;
													if (!name || !phone) return;
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
									{getWalletLinkChip(item?.walletLinked)}
								</TableCell>
								<TableCell colSpan={3}>
									{item.phone
										? formatPhoneNum(item.phone)
										: '-'}
								</TableCell>
								<TableCell>
									{Number(item?.amount ?? 0).toLocaleString()}
								</TableCell>
								<TableCell>
									{item?.totalPrice
										? `${item?.totalPrice.toLocaleString()}원`
										: '-'}
								</TableCell>
								<TableCell>
									{item?.latestIssuedAt
										? getDateByUnitHour(
												new Date(item?.latestIssuedAt)
										  )
										: '-'}
								</TableCell>
							</TableRow>
						))}
				</Table>
				<Pagination {...paginationProps} />
			</Box>
		</>
	);
}

export default CustomerList;
