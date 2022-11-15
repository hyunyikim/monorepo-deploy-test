import {format} from 'date-fns';

import {Box, TableRow, Typography} from '@mui/material';

import {useList} from '@/utils/hooks';
import {
	NftCustomerGuaranteeListResponse,
	NftCustomerGuaranteeRequestParam,
} from '@/@types';
import {
	initialSearchFilter,
	DATE_FORMAT,
	getGroupingGuaranteeStatusChip,
	groupingGuaranteeRequestStates,
	orderDirectionSearchFilter,
} from '@/data';
import {goToParentUrl} from '@/utils';

import {
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	Select,
	TableCell,
} from '@/components';
import {getNftCustomerGuaranteeList} from '@/api/customer.api';

const {
	searchText,
	searchType,
	startDate,
	endDate,
	sort,
	...customerGuaranteeInitialSearchFilter
} = initialSearchFilter;
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
		NftCustomerGuaranteeRequestParam
	>({
		apiFunc: getNftCustomerGuaranteeList,
		apiRestParam: [name, phone],
		initialFilter: {
			...customerGuaranteeInitialSearchFilter,
			status: 'ALL',
			orderBy: 'REQUESTED',
			orderDirection: 'DESC',
		},
	});
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
						value={filter?.orderDirection ?? 'DESC'}
						options={orderDirectionSearchFilter}
						onChange={(e) =>
							handleChangeFilter({
								orderDirection: e.target.value,
							})
						}
						sx={{
							marginRight: 1,
							minWidth: '150px',
						}}
					/>
					<PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {[key: string]: any}) => {
							handleChangeFilter(value);
						}}
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
					}>
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
								<TableCell sx={{minWidth: 200}}>
									<Typography
										fontSize={14}
										lineHeight={'18px'}>
										[{item?.brand?.nameEN ?? '-'}]<br />
										{item?.product?.name ?? '-'}
									</Typography>
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
		</>
	);
}

export default CustomerGuaranteeTable;
