import {useLocation, useNavigate} from 'react-router-dom';
import {format} from 'date-fns';

import {Stack, TableRow, Typography} from '@mui/material';
import {
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	HeadTableCell,
	TableCell,
	Chip,
	Select,
} from '@/components';
import {
	ListResponseV2,
	PaymentHistory,
	PaymentReceiptHistoryRequestParam,
} from '@/@types';
import {useList} from '@/utils/hooks';
import {getPaymentReciptList} from '@/api/payment.api';
import {DATE_FORMAT, defaultPageSize, sortSearchFilter} from '@/data';

function PaymentReceiptList() {
	const {pathname, search} = useLocation();
	const navigate = useNavigate();

	const goToDetailReceiptPage = (idx: string) => {
		navigate(`${pathname}${search}&idx=${idx}`);
	};

	const {
		isLoading,
		data,
		totalSize,
		filter,
		paginationProps: {onChange: onChangePage, ...paginationProps},
		handleChangeFilter,
	} = useList<
		ListResponseV2<PaymentHistory[]>,
		PaymentReceiptHistoryRequestParam
	>({
		apiFunc: getPaymentReciptList,
		initialFilter: {
			sort: 'latest',
			currentPage: 1,
			pageMaxNum: defaultPageSize,
			status: '',
		},
		isQueryChange: false,
	});

	return (
		data && (
			<Stack>
				<TableInfo totalSize={totalSize} unit="건">
					<Select
						height={32}
						value={filter?.status || ''}
						options={[
							{
								label: '전체',
								value: '',
							},
							{
								label: '결제완료',
								value: 'DONE',
							},
							{
								label: '결제실패',
								value: 'FAILED',
							},
						]}
						onChange={(e) => {
							handleChangeFilter({
								status: e.target.value,
							});
						}}
						sx={{
							minWidth: '150px',
						}}
					/>
					<Select
						height={32}
						value={filter?.sort ?? 'latest'}
						options={sortSearchFilter}
						onChange={(e) => {
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
						onChange={(value: {
							[key: string]: any;
							pageMaxNum: number;
						}) => {
							handleChangeFilter(value);
						}}
					/>
				</TableInfo>
				<Table
					isLoading={isLoading}
					totalSize={totalSize}
					headcell={
						<>
							<HeadTableCell width={120}>ID</HeadTableCell>
							<HeadTableCell width={180}>종류</HeadTableCell>
							<HeadTableCell minWidth={180}>날짜 </HeadTableCell>
							<HeadTableCell width={180}>결제 금액</HeadTableCell>
							<HeadTableCell width={180}>결제 상태</HeadTableCell>
						</>
					}>
					{data?.data &&
						data?.data.map((item) => (
							<TableRow key={item.orderId}>
								<TableCell>
									<Typography
										className="underline"
										onClick={() => {
											goToDetailReceiptPage(item.orderId);
										}}>
										{item.displayOrderId}
									</Typography>
								</TableCell>
								<TableCell>구독</TableCell>
								<TableCell>
									{format(
										new Date(item.startDate),
										DATE_FORMAT
									)}
								</TableCell>
								<TableCell>
									{(item.payTotalPrice || 0).toLocaleString()}
									원
								</TableCell>
								<TableCell>
									{item.payStatus === 'DONE' ? (
										<Chip label="결제완료" color="green" />
									) : (
										<Chip label="결제실패" color="red" />
									)}
								</TableCell>
							</TableRow>
						))}
				</Table>
				<Pagination
					{...paginationProps}
					onChange={(_, page) => {
						onChangePage(_, page);
					}}
				/>
			</Stack>
		)
	);
}

export default PaymentReceiptList;
