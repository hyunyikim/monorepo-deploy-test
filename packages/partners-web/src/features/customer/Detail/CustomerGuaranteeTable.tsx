import {Box, TableRow, TableCell, Typography} from '@mui/material';

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
import {goToParentUrl} from '@/utils';

import {
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	ImagePopup,
	ImageModal,
	Select,
} from '@/components';
import {getNftCustomerGuaranteeList} from '@/api/customer.api';
import {format} from 'date-fns';

function CustomerGuaranteeTable({idx}: {idx: number}) {
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
		apiRestParam: [idx],
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
							<TableCell>발급일</TableCell>
							<TableCell>개런티 번호</TableCell>
							<TableCell colSpan={2}>상품 정보</TableCell>
							<TableCell>상품금액</TableCell>
							<TableCell>개런티 상태</TableCell>
						</>
					}>
					{data &&
						data?.list?.length > 0 &&
						data?.list.map((item, idx) => (
							<TableRow key={`item_${idx}`}>
								<TableCell>
									{item?.requestedAt
										? format(new Date(), DATE_FORMAT)
										: '-'}
								</TableCell>
								<TableCell>
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
								<TableCell width={60}>
									<ImagePopup
										image={item?.product?.imagePath}
										alt={item?.product?.name}
										onClick={(value) => {
											onSetModalData(value);
											onOpen();
										}}
									/>
								</TableCell>
								<TableCell>
									<p>
										[{item?.brand?.nameEN ?? '-'}
										]
										<br />
										{item?.product?.name ?? '-'}
									</p>
								</TableCell>
								<TableCell>
									{item?.price
										? `${(item?.price).toLocaleString()}원`
										: '-'}
								</TableCell>
								<TableCell align="center">
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
