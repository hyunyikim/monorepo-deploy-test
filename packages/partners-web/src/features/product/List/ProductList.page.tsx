import {useMemo} from 'react';

import {Box, TableRow, Typography} from '@mui/material';

import {useList, useCheckboxList} from '@/utils/hooks';
import {bulkDeleteProduct, getProductList} from '@/api/product.api';
import {
	ProductListResponse,
	ProductListRequestSearchType,
	ListRequestParam,
	ListResponse,
} from '@/@types';
import {
	calculatePeriod,
	initialSearchFilter,
	productListSearchFilter,
	sortSearchFilter,
} from '@/data';
import {goToParentUrl, trackingToParent} from '@/utils';
import {
	useGetPartnershipInfo,
	useGlobalLoading,
	useMessageDialog,
} from '@/stores';

import {
	TitleTypography,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Button,
	Select,
	HeadTableCell,
	TableCell,
	SearchFilterTab,
	Checkbox,
} from '@/components';

const menu = 'itemadmin';
const menuKo = '상품';

function ProductList() {
	const {data: partnershipInfo} = useGetPartnershipInfo();
	const b2bType = useGetPartnershipInfo()?.data?.b2bType;
	const useFieldModelNum = useMemo(() => {
		return partnershipInfo?.useFieldModelNum === 'Y' ? true : false;
	}, [partnershipInfo]);
	const setIsLoading = useGlobalLoading((state) => state.setIsLoading);

	const onOpenMessageDialog = useMessageDialog((state) => state.onOpen);

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
		ListResponse<ProductListResponse[]>,
		ListRequestParam<ProductListRequestSearchType>
	>({
		apiFunc: getProductList,
		initialFilter: {
			...initialSearchFilter,
			// default 날짜가 14일이 아님
			startDate: calculatePeriod('all')[0],
			endDate: calculatePeriod('all')[1],
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
				? data?.data?.map((item) => item.idx)
				: [],
		handleChangeFilter,
	});

	const handleDeleteProduct = async (checkedItems: number[]) => {
		try {
			setIsLoading(true);
			await bulkDeleteProduct(checkedItems);
			onOpenMessageDialog({
				title: '상품이 삭제됐습니다.',
				showBottomCloseButton: true,
				closeButtonValue: '확인',
				onCloseFunc: () => {
					handleSearch();
					onResetCheckedItem();
				},
			});
		} catch (e) {
			onOpenMessageDialog({
				title: '네트워크 에러',
				message: e?.response?.data?.message || '',
				showBottomCloseButton: true,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const isNotValidCheck = useMemo(() => {
		if (!data?.data || data?.data?.length < 1) {
			return true;
		}
		return false;
	}, [data?.data]);

	return (
		<>
			<Box>
				<TitleTypography title="상품 목록" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={productListSearchFilter}
					periodIdx={6}
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
					options={[
						{
							label: '전체',
							value: '',
						},
					]}
					selectedTab={''}
					tabLabel="product request state"
					onChangeTab={() => {
						console.log('');
					}}
					buttons={
						<>
							<Button
								variant="outlined"
								color="grey-100"
								height={32}
								onClick={() => {
									goToParentUrl('/b2b/product/excel-upload');
								}}>
								대량 등록
							</Button>
							<Button
								color="primary"
								height={32}
								onClick={() => {
									trackingToParent(
										`${menu}_list_regist_click`,
										{
											button_title: `신규등록 클릭`,
										}
									);
									goToParentUrl('/b2b/product/register');
								}}>
								상품 등록
							</Button>
						</>
					}
				/>
				<TableInfo totalSize={totalSize} unit="건">
					<Select
						height={32}
						value={filter?.sort ?? 'latest'}
						options={sortSearchFilter}
						onChange={(e) => {
							const sortLabel =
								sortSearchFilter.find(
									(item) => item.value === e.target.value
								)?.label || '';
							trackingToParent(`${menu}_unit_view_click`, {
								button_title: `정렬_${sortLabel}`,
							});
							onHandleChangeFilter({
								sort: e.target.value,
							});
						}}
						sx={{
							minWidth: '150px',
						}}
					/>
					<PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {[key: string]: any}) =>
							onHandleChangeFilter(value)
						}
					/>
					<Button
						variant="outlined"
						color="grey-100"
						height={32}
						onClick={() => {
							if (checkedIdxList?.length < 1) {
								onOpenMessageDialog({
									title: '삭제할 상품을 선택해주세요.',
									showBottomCloseButton: true,
									closeButtonValue: '확인',
								});
								return;
							}
							onOpenMessageDialog({
								title: '선택하신 상품을 삭제하시겠습니까?',
								showBottomCloseButton: true,
								closeButtonValue: '취소',
								buttons: (
									<>
										<Button
											color="black"
											variant="contained"
											onClick={() => {
												handleDeleteProduct(
													checkedIdxList
												);
											}}>
											삭제
										</Button>
									</>
								),
							});
						}}
						sx={{
							marginRight: '0',
						}}>
						선택 삭제
					</Button>
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
							<HeadTableCell minWidth={180}>No.</HeadTableCell>
							<HeadTableCell minWidth={180}>브랜드</HeadTableCell>
							<HeadTableCell minWidth={360}>상품명</HeadTableCell>
							<HeadTableCell minWidth={180}>
								상품가격
							</HeadTableCell>
							{b2bType !== 'brand' && (
								<HeadTableCell minWidth={180}>
									카테고리
								</HeadTableCell>
							)}
							{useFieldModelNum && (
								<HeadTableCell minWidth={180}>
									모델번호
								</HeadTableCell>
							)}
							<HeadTableCell minWidth={180}>
								상품코드
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
									{item.num ? (
										<Typography
											variant="body3"
											className="underline"
											onClick={() => {
												goToParentUrl(
													`/b2b/product/${item.idx}`
												);
											}}>
											{item.num}
										</Typography>
									) : (
										'-'
									)}
								</TableCell>
								<TableCell>
									{item?.brand?.name || '-'}
								</TableCell>
								<TableCell>
									<Typography
										variant="body3"
										className="underline"
										onClick={() => {
											goToParentUrl(
												`/b2b/product/${item.idx}`
											);
										}}>
										{item?.name ?? '-'}
									</Typography>
								</TableCell>
								<TableCell>
									{item?.price
										? `${item?.price.toLocaleString()}원`
										: '-'}
								</TableCell>
								{b2bType === 'brand' ? null : (
									<TableCell>
										{item?.categoryName || '-'}
									</TableCell>
								)}
								{useFieldModelNum && (
									<TableCell>
										{item?.modelNum || '-'}
									</TableCell>
								)}
								<TableCell>{item?.code || '-'}</TableCell>
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

export default ProductList;
