import {Box, TableRow, Typography} from '@mui/material';

import {useList} from '@/utils/hooks';
import {getProductList} from '@/api/product.api';
import {
	ProductListRequestParam,
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
	ListTitle,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Button,
	Select,
	TableCell,
} from '@/components';

const menu = 'itemadmin';
const menuKo = '상품';

function ProductList() {
	const b2btype = localStorage.getItem('b2btype');
	const useFieldModelNum =
		localStorage.getItem('useFieldModelNum') === 'Y' ? true : false;
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
		ListResponse<ProductListResponse[]>,
		ListRequestParam<ProductListRequestSearchType> & ProductListRequestParam
	>({
		apiFunc: getProductList,
		initialFilter: {
			...initialSearchFilter,
			// default 날짜가 14일이 아님
			startDate: calculatePeriod('all')[0],
			endDate: calculatePeriod('all')[1],
			categoryCode: '',
		},
	});
	return (
		<>
			<Box>
				<ListTitle title="상품 목록" />
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={productListSearchFilter}
					periodIdx={6}
					onSearch={handleSearch}
					onReset={handleReset}
					onChangeFilter={handleChangeFilter}
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
							handleChangeFilter({
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
							handleChangeFilter(value)
						}
					/>
					<Button
						color="primary"
						height={32}
						onClick={() => {
							trackingToParent(`${menu}_list_regist_click`, {
								button_title: `신규등록 클릭`,
							});
							goToParentUrl('/b2b/product/register');
						}}>
						상품 등록
					</Button>
				</TableInfo>
				<Table
					isLoading={isLoading}
					totalSize={totalSize}
					headcell={
						<>
							<TableCell>No.</TableCell>
							<TableCell>브랜드</TableCell>
							<TableCell>상품명</TableCell>
							<TableCell>상품가격</TableCell>
							<TableCell>카테고리</TableCell>
							{useFieldModelNum && (
								<TableCell>모델번호</TableCell>
							)}
							<TableCell>상품코드</TableCell>
						</>
					}>
					{data &&
						data?.data?.length > 0 &&
						data?.data.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell sx={{minWidth: 120}}>
									{item.num ? (
										<Typography
											fontSize={14}
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
								<TableCell width="500px">
									<Typography
										fontSize={14}
										lineHeight={'18px'}
										className="underline"
										onClick={() => {
											goToParentUrl(
												`/b2b/product/${item.idx}`
											);
										}}>
										{item?.name ?? '-'}
									</Typography>
								</TableCell>
								<TableCell sx={{minWidth: 120}}>
									{item?.price
										? `${item?.price.toLocaleString()}원`
										: '-'}
								</TableCell>
								<TableCell sx={{minWidth: 120}}>
									{item?.categoryName || '-'}
								</TableCell>
								{useFieldModelNum && (
									<TableCell sx={{minWidth: 180}}>
										{item?.modelNum || '-'}
									</TableCell>
								)}
								<TableCell sx={{minWidth: 180}}>
									{item?.code || '-'}
								</TableCell>
							</TableRow>
						))}
				</Table>
				<Pagination {...paginationProps} />
			</Box>
		</>
	);
}

export default ProductList;
