import {useEffect, useMemo} from 'react';
import {Box, TableRow, Typography} from '@mui/material';

import {useCheckboxList, useList} from '@/utils/hooks';
import {getGuaranteeList} from '@/api/guarantee.api';
import {
	GuaranteeListRequestParam,
	GuaranteeListResponse,
	GuaranteeListRequestSearchType,
	ListRequestParam,
	ListResponse,
} from '@/@types';
import {
	initialSearchFilter,
	guaranteeListSearchFilter,
	getGuaranteeStatusChip,
	groupingGuaranteeRequestStates,
} from '@/data';
import {
	formatPhoneNum,
	goToParentUrl,
	trackingToParent,
	goToGuaranteeExcelUploadPage,
} from '@/utils';

import {
	ListTitle,
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

const menu = 'guarantee';
const menuKo = '개런티';

function GuaranteeList() {
	useEffect(() => {
		trackingToParent('guarantee_pv', {pv_title: '개런티목록 노출'});
	}, []);

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
		ListResponse<GuaranteeListResponse[]>,
		ListRequestParam<GuaranteeListRequestSearchType> &
			GuaranteeListRequestParam
	>({
		apiFunc: getGuaranteeList,
		initialFilter: {
			...initialSearchFilter,
			nft_req_state: '',
		},
	});

	const {
		checkedIdxList,
		checkedTotal,
		onCheckItem,
		onCheckTotalItem,
		onResetCheckedItem,
		onHandleChangeFilter,
	} = useCheckboxList({
		idxList:
			data && data?.data && data?.data?.length > 0
				? data?.data?.map((item) => item.nft_req_idx)
				: [],
		handleChangeFilter,
	});

	const isNotValidCheck = useMemo(() => {
		const nftReqState = filter?.nft_req_state;
		if (!nftReqState || nftReqState === '9') {
			return true;
		}
		return false;
	}, [filter.nft_req_state]);

	return (
		<>
			<Box>
				<ListTitle title="개런티 목록" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={guaranteeListSearchFilter}
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
					selectedTab={filter.nft_req_state}
					tabLabel={'nft request state'}
					onChangeTab={(value) =>
						onHandleChangeFilter({
							nft_req_state: value,
						})
					}
					buttons={
						<>
							<Button
								color="grey-100"
								variant="outlined"
								height={32}
								onClick={goToGuaranteeExcelUploadPage}>
								대량등록
							</Button>
							<Button
								color="primary"
								variant="outlined"
								height={32}
								onClick={() => {
									goToParentUrl('/b2b/interwork');
								}}>
								쇼핑몰 주문 연동하기
							</Button>
							<Button
								color="primary"
								height={32}
								onClick={() => {
									trackingToParent(
										'guarantee_list_firstexcelregistration_click',
										{button_title: `신규등록 클릭`}
									);
									goToParentUrl('/b2b/guarantee/register');
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
							trackingToParent(`${menu}_unit_view_click`, {
								button_title: `노출수_${value.pageMaxNum}개씩`,
							});
							onHandleChangeFilter(value);
						}}
					/>
					<GuaranteeCheckboxButton
						nftReqState={filter.nft_req_state}
						checkedItems={checkedIdxList}
						onHandleChangeFilter={onHandleChangeFilter}
						onResetCheckedItem={onResetCheckedItem}
						onSearch={handleSearch}
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
											item.nft_req_idx
										)}
										onChange={(e) => {
											const checked =
												e?.target?.checked || false;
											const nftReqIdx = item.nft_req_idx;
											onCheckItem(nftReqIdx, checked);
										}}
									/>
								</TableCell>
								<TableCell>
									{item.reg_dt
										? item?.reg_dt.substr(0, 10)
										: '-'}
								</TableCell>
								<TableCell>
									{item.nft_req_num ? (
										<Typography
											fontSize={14}
											className="underline"
											onClick={() => {
												trackingToParent(
													'guarantee_list_numberclick_click',
													{
														button_title: `신청번호 클릭`,
													}
												);
												if (
													Number(item.nft_req_state) <
													3
												) {
													goToParentUrl(
														`/b2b/guarantee/edit/${item.nft_req_idx}`
													);
												} else {
													goToParentUrl(
														`/b2b/guarantee/detail/${item.nft_req_idx}`
													);
												}
											}}>
											{item.nft_req_num}
										</Typography>
									) : (
										'-'
									)}
								</TableCell>
								<TableCell>
									{item.platform_text
										? item.platform_text
										: '-'}
								</TableCell>
								<TableCell>
									<Typography
										fontSize={14}
										className="underline"
										onClick={() => {
											const name = item?.orderer_nm;
											const phone = item?.orderer_tel;
											if (!name || !phone) return;
											goToParentUrl(
												`/b2b/customer/${name}/${phone}`
											);
										}}>
										{item.orderer_nm
											? item.orderer_nm
											: '-'}
									</Typography>
								</TableCell>
								<TableCell>
									{item.orderer_tel
										? formatPhoneNum(item.orderer_tel)
										: '-'}
								</TableCell>
								<TableCell width="400px">
									<Typography
										fontSize={14}
										lineHeight={'18px'}>
										[{item.brand_nm_en ?? '-'}
										]
										<br />
										{item.pro_nm ? item.pro_nm : '-'}
									</Typography>
								</TableCell>
								<TableCell>
									{getGuaranteeStatusChip(
										item.nft_req_state,
										item.nft_req_state_text
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
