import {format} from 'date-fns';

import {Box, TableRow, Typography} from '@mui/material';

import {useList, useOpen} from '@/utils/hooks';
import {
	ListRequestParam,
	NftCustomerGuaranteeListResponse,
	NftCustomerGuaranteeRequestParam,
} from '@/@types';
import {
	initialSearchFilter,
	DATE_FORMAT,
	getGroupingGuaranteeStatusChip,
	sortSearchFilter,
	groupingGuaranteeRequestStates,
} from '@/data';
import {goToParentUrl, openParantModal} from '@/utils';

import {
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	ImagePopup,
	ImageModal,
	Select,
	TableCell,
} from '@/components';
import {getNftCustomerGuaranteeList} from '@/api/customer.api';

function CustomerGuaranteeTable({name, phone}: {name: string; phone: string}) {
	const {
		isLoading,
		data,
		totalSize,
		filter,
		paginationProps,
		handleChangeFilter,
	} = useList<
		NftCustomerGuaranteeListResponse,
		ListRequestParam & NftCustomerGuaranteeRequestParam
	>({
		apiFunc: getNftCustomerGuaranteeList,
		apiRestParam: [name, phone],
		initialFilter: {
			...initialSearchFilter,
			status: 'ALL',
			orderBy: 'REQUESTED',
			orderDirection: 'DESC',
		},
	});
	const {open, onOpen, onClose, modalData, onSetModalData} = useOpen({});
	return (
		<>
			<Box>
				<TableInfo totalSize={totalSize} unit="개">
					<Select
						height={32}
						value={filter?.status ?? 'ALL'}
						options={groupingGuaranteeRequestStates}
						onChange={(e) =>
							handleChangeFilter({
								status: e.target.value,
							})
						}
						sx={{
							marginRight: 1,
							minWidth: '150px',
						}}
					/>
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
							marginRight: 1,
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
							<TableCell>신청일</TableCell>
							<TableCell>개런티 번호</TableCell>
							<TableCell>상품 정보</TableCell>
							<TableCell>상품금액</TableCell>
							<TableCell>개런티 상태</TableCell>
						</>
					}
					sx={{
						'& .MuiTableBody-root .MuiTableCell-root > .MuiBox-root':
							{
								minHeight: '65px',
							},
					}}>
					{data &&
						data?.list?.length > 0 &&
						data?.list.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell width="180px">
									{item?.requestedAt
										? format(new Date(), DATE_FORMAT)
										: '-'}
								</TableCell>
								<TableCell width="180px">
									{item?.serialNo ? (
										<Typography
											fontSize={14}
											className="underline"
											onClick={() => {
												goToParentUrl(
													`/b2b/guarantee/detail/${item.idx}`
												);
											}}>
											{item?.serialNo}
										</Typography>
									) : (
										'-'
									)}
								</TableCell>
								<TableCell>
									<Box>
										<ImagePopup
											image={item?.product?.imagePath}
											alt={item?.product?.name}
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
											[{item?.brand?.nameEN ?? '-'}]<br />
											{item?.product?.name ?? '-'}
										</Typography>
									</Box>
								</TableCell>
								<TableCell width="180px">
									{item?.price
										? `${(item?.price).toLocaleString()}원`
										: '-'}
								</TableCell>
								<TableCell width="180px">
									{getGroupingGuaranteeStatusChip(
										item.status
									)}
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

export default CustomerGuaranteeTable;
