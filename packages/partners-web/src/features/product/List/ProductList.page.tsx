import {Box, TableRow, Typography} from '@mui/material';

import {useList, useOpen} from '@/utils/hooks';
import {getProductList} from '@/api/product.api';
import {
	ProductListRequestParam,
	ProductListResponse,
	ProductListRequestSearchType,
	ListRequestParam,
	ListResponse,
} from '@/@types';
import {
	initialSearchFilter,
	productListSearchFilter,
	sortSearchFilter,
} from '@/data';
import {goToParentUrl, openParantModal, trackingToParent} from '@/utils';

import {
	ListTitle,
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	ImagePopup,
	ImageModal,
	Button,
	Select,
	TableCell,
} from '@/components';

function ProductList() {
	const b2btype = localStorage.getItem('b2btype');
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
			categoryCode: '',
		},
	});
	const {open, onOpen, onClose, modalData, onSetModalData} = useOpen({});

	return (
		<>
			<Box>
				<ListTitle title="상품 목록" />
				<SearchFilter
					filter={filter}
					filterComponent={productListSearchFilter}
					onSearch={handleSearch}
					onReset={handleReset}
					onChangeFilter={handleChangeFilter}
				/>
				<TableInfo totalSize={totalSize} unit="건">
					<Select
						height={32}
						value={filter?.sort ?? 'latest'}
						options={sortSearchFilter}
						onChange={(e) =>
							handleChangeFilter({
								sort: e.target.value,
							})
						}
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
							trackingToParent('itemadmin_list_regist_click', {
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
							<TableCell>모델번호</TableCell>
							<TableCell>상품코드</TableCell>
						</>
					}>
					{data &&
						data?.data?.length > 0 &&
						data?.data.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell sx={{minWidth: 180}}>
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
								<TableCell sx={{minWidth: 120}}>
									{item?.brand?.name || '-'}
								</TableCell>
								<TableCell>
									<Box>
										<ImagePopup
											image={item?.productImage}
											alt={item?.name}
											onClick={(value) => {
												// 부모창 이미지 모달 오픈
												openParantModal({
													title: '이미지',
													content: `<img src=${value.imgSrc} alt=${value.imgAlt} style={maxHeight: '70vh'} />`,
												});
												// onSetModalData(value);
												// onOpen();
											}}
										/>
										<Typography
											fontSize={16}
											lineHeight="16px"
											ml="12px">
											{item?.name ?? '-'}
										</Typography>
									</Box>
								</TableCell>
								<TableCell sx={{minWidth: 120}}>
									{item?.price
										? `${item?.price.toLocaleString()}원`
										: '-'}
								</TableCell>
								<TableCell sx={{minWidth: 120}}>
									{item?.categoryName || '-'}
								</TableCell>
								<TableCell sx={{minWidth: 180}}>
									{item?.modelNum || '-'}
								</TableCell>
								<TableCell sx={{minWidth: 180}}>
									{item?.code || '-'}
								</TableCell>
							</TableRow>
						))}
				</Table>
				<Pagination {...paginationProps} />
			</Box>
			<ImageModal
				open={open}
				onClose={onClose}
				imgSrc={modalData?.imgSrc}
				imgAlt={modalData?.imgAlt}
			/>
		</>
	);
}

export default ProductList;
