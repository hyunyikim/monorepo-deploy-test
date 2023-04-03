import {useMemo} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, TableRow, Typography} from '@mui/material';

import {useCheckboxList, useList} from '@/utils/hooks';
import {getGuaranteeList} from '@/api/guarantee-v1.api';
import {
	GuaranteeListRequestParam,
	GuaranteeListRequestSearchType,
	ListRequestParam,
	ListResponseV2,
	GuaranteeSummary,
} from '@/@types';
import {
	initialSearchFilter,
	guaranteeListSearchFilter,
	getGuaranteeStatusChip,
	groupingGuaranteeRequestStates,
} from '@/data';
import {formatPhoneNum, sendAmplitudeLog, usePageView} from '@/utils';

import {
	TitleTypography,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Button,
	HeadTableCell,
	TableCell,
	SearchFilterTab,
	Checkbox,
} from '@/components';
import GuaranteeCheckboxButton from '@/features/guarantee/List/GuaranteeCheckboxButton';
import {useGetStoreList} from '@/stores';

const menu = 'guarantee';
const menuKo = '개런티';

function GuaranteeList() {
	usePageView('guarantee_pv', '개런티목록 노출');
	const {data: storeList} = useGetStoreList();
	const navigate = useNavigate();

	const {
		isLoading,
		data,
		totalSize,
		filter,
		paginationProps: {onChange: onChangePage, ...paginationProps},
		handleChangeFilter,
		handleSearch,
		handleReset,
	} = useList<
		ListResponseV2<GuaranteeSummary[]>,
		ListRequestParam<GuaranteeListRequestSearchType> &
			GuaranteeListRequestParam
	>({
		apiFunc: getGuaranteeList,
		initialFilter: {
			...initialSearchFilter,
			nftStatus: '',
			storeIdx: '',
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
		const nftReqState = filter?.nftStatus;
		if (!nftReqState || nftReqState === 'cancel') {
			return true;
		}
		return false;
	}, [filter.nftStatus]);

	const platformOptions = useMemo(() => {
		const defaultOption = {
			label: '전체',
			value: '',
		};
		if (storeList) {
			return [defaultOption, ...storeList];
		}
		return [defaultOption];
	}, [storeList]);

	return (
		<>
			<Box p={5}>
				<TitleTypography title="개런티 목록" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={guaranteeListSearchFilter.map((item) => {
						if (item.name === 'storeIdx') {
							return {
								...item,
								options: platformOptions,
							};
						}
						return item;
					})}
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
					options={groupingGuaranteeRequestStates}
					selectedTab={filter.nftStatus}
					tabLabel={'nft request state'}
					onChangeTab={(value) =>
						onHandleChangeFilter({
							nftStatus: value,
						})
					}
					buttons={
						<>
							<Button
								color="grey-100"
								variant="outlined"
								height={32}
								onClick={() => {
									navigate('/b2b/guarantee/excel-upload');
								}}
								data-tracking={`guarantee_list_excelregistration_click,{'button_title': '엑셀등록 클릭'}`}>
								대량발급
							</Button>
							<Button
								color="primary"
								variant="outlined"
								height={32}
								onClick={() => {
									navigate('/b2b/interwork');
								}}>
								쇼핑몰 주문 연동하기
							</Button>
							<Button
								color="primary"
								height={32}
								onClick={() => {
									sendAmplitudeLog(
										'guarantee_list_firstexcelregistration_click',
										{button_title: `신규등록 클릭`}
									);
									navigate('/b2b/guarantee/register');
								}}>
								신규등록
							</Button>
						</>
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
					<GuaranteeCheckboxButton
						nftReqState={filter.nftStatus}
						checkedItems={checkedIdxList}
						onHandleChangeFilter={onHandleChangeFilter}
						onResetCheckedItem={onResetCheckedItem}
						onSearch={handleSearch}
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
							<HeadTableCell minWidth={180}>판매처</HeadTableCell>
							<HeadTableCell minWidth={180}>이름</HeadTableCell>
							<HeadTableCell minWidth={180}>연락처</HeadTableCell>
							<HeadTableCell minWidth={360}>
								상품정보
							</HeadTableCell>
							<HeadTableCell minWidth={120}>
								개런티 상태
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
											const nftReqIdx = item.idx;
											onCheckItem(nftReqIdx, checked);
										}}
									/>
								</TableCell>
								<TableCell>
									{item?.registeredAt
										? item?.registeredAt.substr(0, 10)
										: '-'}
								</TableCell>
								<TableCell>
									{item.idx ? (
										<Typography
											variant="body3"
											className="underline"
											onClick={() => {
												sendAmplitudeLog(
													'guarantee_list_numberclick_click',
													{
														button_title: `신청번호 클릭`,
													}
												);
												if (
													Number(item.nftStatusCode) <
													3
												) {
													navigate(
														`/b2b/guarantee/edit/${item.idx}`
													);
												} else {
													navigate(
														`/b2b/guarantee/${item.idx}`
													);
												}
											}}>
											{item.nftNumber}
										</Typography>
									) : (
										'-'
									)}
								</TableCell>
								<TableCell>
									{item.storeName ? item.storeName : '-'}
								</TableCell>
								<TableCell>
									<Typography
										variant="body3"
										className="underline"
										onClick={() => {
											const name = item?.ordererName;
											const phone = item?.ordererTel;
											if (!name || !phone) return;
											navigate(
												`/b2b/customer/${name}/${phone}`
											);
										}}>
										{item.ordererName
											? item.ordererName
											: '-'}
									</Typography>
								</TableCell>
								<TableCell>
									{item.ordererTel
										? formatPhoneNum(item.ordererTel)
										: '-'}
								</TableCell>
								<TableCell width="400px">
									<Typography variant="body3">
										[{item.brandNameEn ?? '-'}
										]
										<br />
										{item.productName
											? item.productName
											: '-'}
									</Typography>
								</TableCell>
								<TableCell>
									{getGuaranteeStatusChip(
										item.nftStatusCode,
										item.nftStatus
									)}
								</TableCell>
							</TableRow>
						))}
				</Table>
				<Pagination
					{...paginationProps}
					onChange={(_, page) => {
						onResetCheckedItem();
						onChangePage(_, page);
					}}
				/>
			</Box>
		</>
	);
}

export default GuaranteeList;
