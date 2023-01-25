import {useMemo} from 'react';

import {Box, TableRow, Typography} from '@mui/material';

import {useCheckboxList, useList} from '@/utils/hooks';
import {
	ListRequestParam,
	ListResponseV2,
	RepairListRequestParam,
	RepairListRequestSearchType,
	RepairSummary,
} from '@/@types';
import {
	initialSearchFilter,
	repairStatusOption,
	repairListSearchFilter,
	getRepairStatusChip,
} from '@/data';
import {
	formatPhoneNum,
	goToParentUrl,
	sendAmplitudeLog,
	usePageView,
} from '@/utils';

import {
	TitleTypography,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	HeadTableCell,
	TableCell,
	SearchFilterTab,
	Checkbox,
} from '@/components';
import {getRepairList} from '@/api/repair.api';

import RepairBulkControl from './RepairBulkControl';

const menu = 'repair';
const menuKo = '수선';

function RepairList() {
	usePageView('repair_pv', '수선신청목록 진입');

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
		ListResponseV2<RepairSummary[]>,
		ListRequestParam<RepairListRequestSearchType> & RepairListRequestParam
	>({
		apiFunc: getRepairList,
		initialFilter: {
			...initialSearchFilter,
			searchType: 'all',
			status: '',
		},
	});

	const {
		checkedIdxList,
		checkedTotal,
		onCheckItem,
		onCheckTotalItem,
		onResetCheckedItem,
		onHandleChangeFilter,
		isCheckedItemsExisted,
	} = useCheckboxList({
		idxList:
			data && data?.data && data?.data?.length > 0
				? data?.data?.map((item) => item.idx)
				: [],
		handleChangeFilter,
	});

	const isNotValidCheck = useMemo(() => {
		if (['request'].includes(filter?.status)) {
			return false;
		}
		return true;
	}, [filter?.status]);

	return (
		<>
			<Box p={5}>
				<TitleTypography title="수선신청 관리" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={repairListSearchFilter}
					periodIdx={2}
					onSearch={(param) => {
						handleSearch(param);
						onResetCheckedItem();
					}}
					onReset={() => {
						handleReset();
						onResetCheckedItem();
					}}
					onChangeFilter={onHandleChangeFilter}
				/>
				<SearchFilterTab
					options={repairStatusOption.filter(
						(item) => item.value !== 'ready' // 대기 상태는 추후 사용할 예정
					)}
					selectedTab={filter.status}
					tabLabel={'repair status'}
					onChangeTab={(value) =>
						onHandleChangeFilter({
							status: value,
						})
					}
				/>
				<TableInfo totalSize={totalSize} unit="건">
					<PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {
							[key: string]: any;
							pageMaxNum: number;
						}) => {
							sendAmplitudeLog(`${menu}_unit_view_click`, {
								button_title: `노출수_${value.pageMaxNum}개씩`,
							});
							onHandleChangeFilter(value);
						}}
					/>
					<RepairBulkControl
						status={filter.status}
						checkedItems={checkedIdxList}
						onHandleChangeFilter={onHandleChangeFilter}
						isCheckedItemsExisted={isCheckedItemsExisted}
					/>
				</TableInfo>
				<Table
					isLoading={isLoading}
					totalSize={totalSize}
					headcell={
						<>
							<HeadTableCell width={52}>
								<Checkbox
									disabled={isNotValidCheck}
									checked={checkedTotal}
									onChange={(e) => {
										onCheckTotalItem(
											e?.target?.checked || false
										);
									}}
								/>
							</HeadTableCell>
							<HeadTableCell minWidth={120}>신청일</HeadTableCell>
							<HeadTableCell minWidth={180}>
								신청번호
							</HeadTableCell>
							<HeadTableCell minWidth={180}>이름</HeadTableCell>
							<HeadTableCell minWidth={180}>연락처</HeadTableCell>
							<HeadTableCell minWidth={500}>
								상품정보
							</HeadTableCell>
							<HeadTableCell minWidth={180}>
								신청현황
							</HeadTableCell>
						</>
					}>
					{data &&
						data?.data?.length > 0 &&
						data?.data.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell>
									<Checkbox
										disabled={isNotValidCheck}
										checked={checkedIdxList.includes(
											item.idx
										)}
										onChange={(e) => {
											const checked =
												e?.target?.checked || false;
											onCheckItem(item.idx, checked);
										}}
									/>
								</TableCell>
								<TableCell>
									{item.registeredAt
										? item.registeredAt.slice(0, 10)
										: '-'}
								</TableCell>
								<TableCell>
									<Typography
										variant="body3"
										className="underline"
										onClick={() => {
											goToParentUrl(
												`/b2b/repair/${item.idx}`
											);
										}}>
										{item.repairNum}
									</Typography>
								</TableCell>
								<TableCell>
									<Typography
										variant="body3"
										className="underline"
										onClick={() => {
											const name = item?.ordererName;
											const phone = item?.ordererTel;
											if (!name || !phone) return;
											goToParentUrl(
												`/b2b/customer/${name}/${phone}`
											);
										}}>
										{item?.ordererName}
									</Typography>
								</TableCell>
								<TableCell>
									{item.ordererTel
										? formatPhoneNum(item.ordererTel)
										: '-'}
								</TableCell>
								<TableCell>
									<Box>
										<Typography variant="body3">
											[{item.brandNameEn ?? '-'}
											]
											<br />
											{item.productName ?? '-'}
										</Typography>
									</Box>
								</TableCell>
								<TableCell>
									{getRepairStatusChip(item.repairStatusCode)}
								</TableCell>
							</TableRow>
						))}
				</Table>
				<Pagination {...paginationProps} />
			</Box>
		</>
	);
}

export default RepairList;
