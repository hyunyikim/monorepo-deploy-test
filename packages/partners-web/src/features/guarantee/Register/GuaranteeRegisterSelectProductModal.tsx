import {
	useCallback,
	useEffect,
	useState,
	SetStateAction,
	Dispatch,
	useMemo,
} from 'react';
import {Box, TableRow, Typography} from '@mui/material';

import {ProductRegisterFormData, ImageState} from '@/@types';
import {Checkbox, Dialog} from '@/components';

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
	guaranteeRegisterProductListSearchFilter,
	sortSearchFilter,
} from '@/data';
import {sendAmplitudeLog} from '@/utils';

import {
	SearchFilter,
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Button,
	Select,
	TableCell,
} from '@/components';
import {useMessageDialog, useGetPartnershipInfo} from '@/stores';

const menu = 'guarantee_publish_pluspopup_query_click';
const menuKo = '';
interface Props {
	open: boolean;
	onClose: () => void;
	setProduct: (value: Partial<ProductRegisterFormData> | null) => void;
	setImages: Dispatch<SetStateAction<ImageState[]>>;
	setRegisterNewProduct: (value: boolean) => void;
}

function GuaranteeRegisterSelectProductModal({
	open,
	onClose,
	setProduct,
	setImages,
	setRegisterNewProduct,
}: Props) {
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
		isQueryChange: false,
	});
	const {data: partnershipInfo} = useGetPartnershipInfo();
	const isCooperator = useMemo(
		() => (partnershipInfo?.b2bType === 'cooperator' ? true : false),
		[partnershipInfo]
	);
	const onMessageDialogOpen = useMessageDialog((state) => state.onOpen);
	const [selectedProduct, setSelectedProduct] =
		useState<ProductListResponse | null>(null);

	const handleSelectProduct = useCallback(
		(data: ProductListResponse, checked: boolean) => {
			if (checked) {
				setSelectedProduct(data);
				return;
			}
			setSelectedProduct(null);
		},
		[]
	);

	const handleAddProduct = (data: ProductListResponse | null) => {
		if (!data) {
			onMessageDialogOpen({
				title: '상품을 선택해주세요.',
				showBottomCloseButton: true,
			});
			return;
		}

		const {
			idx,
			name,
			brand,
			brandIdx,
			price,
			productImage,
			customField,
			warranty,
		} = data;
		setProduct({
			idx,
			name,
			brandName: brand.name,
			brandNameEn: brand.englishName,
			brandIdx,
			price: price ? price.toLocaleString() : '',
			warranty,
			customField: customField || {},
		});
		if (productImage) {
			setImages([{preview: productImage, file: productImage}]);
		}
		setRegisterNewProduct(false);
		onClose();
		handleReset();
	};

	const handleResetProduct = useCallback(() => {
		setSelectedProduct(null);
		onClose();
		handleReset();
	}, []);

	// 모달 닫힐 때마다 데이터 초기화
	useEffect(() => {
		if (!open) {
			setSelectedProduct(null);
			return;
		}
		sendAmplitudeLog('guarantee_publish_pluspopup_view', {
			button_title: '상품추가 팝업 노출',
		});
	}, [open]);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			width={900}
			height={600}
			TitleComponent={
				<Typography fontSize={18} fontWeight="bold">
					상품 추가
				</Typography>
			}
			ActionComponent={
				<>
					<Button
						variant="outlined"
						color="grey-100"
						height={32}
						onClick={handleResetProduct}>
						닫기
					</Button>
					<Button
						height={32}
						onClick={() => handleAddProduct(selectedProduct)}>
						추가
					</Button>
				</>
			}
			sx={{
				'& .MuiDialogContent-root': {
					marginBottom: '65px',
				},
				'& .MuiDialogActions-root': {
					backgroundColor: 'grey.10',
					paddingY: '16px',
					borderTop: (theme) =>
						`1px solid ${theme.palette.grey[100]}`,
				},
			}}>
			<Box>
				<SearchFilter
					menu={menu}
					menuKo={menuKo}
					filter={filter}
					filterComponent={
						isCooperator
							? guaranteeRegisterProductListSearchFilter
							: guaranteeRegisterProductListSearchFilter.slice(
									0,
									1
							  )
					}
					periodIdx={6}
					onSearch={handleSearch}
					onReset={handleReset}
					onChangeFilter={handleChangeFilter}
				/>
				<Typography fontSize={14} fontWeight="bold" pt="40px">
					상품 목록
				</Typography>
				<TableInfo
					totalSize={totalSize}
					unit="건"
					sx={{
						marginTop: '12px',
						marginBottom: '20px',
						'& .table-info-count': {
							fontSize: 13,
						},
					}}>
					<Select
						height={32}
						value={filter?.sort ?? 'latest'}
						options={sortSearchFilter}
						onChange={(e) => {
							const sortLabel =
								sortSearchFilter.find(
									(item) => item.value === e.target.value
								)?.label || '';
							sendAmplitudeLog(
								`guarantee_publish_pluspopup_query_click`,
								{
									button_title: `정렬선택_${sortLabel}`,
								}
							);
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
				</TableInfo>
				<Table
					isLoading={isLoading}
					totalSize={totalSize}
					headcell={
						<>
							<TableCell></TableCell>
							<TableCell>브랜드</TableCell>
							<TableCell>상품명</TableCell>
							<TableCell>상품가격</TableCell>
							{isCooperator && <TableCell>카테고리</TableCell>}
						</>
					}>
					{data &&
						data?.data?.length > 0 &&
						data?.data.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell width="50px">
									<Checkbox
										onChange={(e, checked) =>
											handleSelectProduct(item, checked)
										}
										checked={
											selectedProduct &&
											selectedProduct?.idx == item.idx
												? true
												: false
										}
										sx={{
											padding: '0 !important',
										}}
										data-tracking={`guarantee_publish_pluspopup_select_click,{'button_title': '상품선택 클릭'}`}
									/>
								</TableCell>
								<TableCell width="180px">
									{item?.brand?.name || '-'}
								</TableCell>
								<TableCell width="400px">
									<Typography
										fontSize={14}
										lineHeight={'18px'}>
										{item?.name ?? '-'}
									</Typography>
								</TableCell>
								<TableCell sx={{minWidth: 120}}>
									{item?.price
										? `${item?.price.toLocaleString()}원`
										: '-'}
								</TableCell>
								{isCooperator && (
									<TableCell sx={{minWidth: 120}}>
										{item?.categoryName || '-'}
									</TableCell>
								)}
							</TableRow>
						))}
				</Table>
				<Pagination {...paginationProps} />
			</Box>
		</Dialog>
	);
}

export default GuaranteeRegisterSelectProductModal;
