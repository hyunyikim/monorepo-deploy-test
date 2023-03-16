import {useLocation, useNavigate} from 'react-router-dom';

import {Stack, TableRow, Typography} from '@mui/material';

import {useList} from '@/utils/hooks';
import {getPaymentHistoryList} from '@/api/payment.api';
import {DATE_FORMAT, defaultPageSize, sortSearchFilter} from '@/data';
import {ListRequestParam, ListResponseV2, PaymentHistory} from '@/@types';

import {
	TableInfo,
	Table,
	PageSelect,
	Pagination,
	HeadTableCell,
	TableCell,
	Checkbox,
	Select,
} from '@/components';
import {format} from 'date-fns';

function SubscribeHistoryList() {
	const {pathname, search} = useLocation();
	const navigate = useNavigate();

	const goToDetailSubscribePage = (idx: string) => {
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
		Pick<ListRequestParam, 'sort' | 'currentPage' | 'pageMaxNum'>
	>({
		apiFunc: getPaymentHistoryList,
		initialFilter: {
			sort: 'latest',
			currentPage: 1,
			pageMaxNum: defaultPageSize,
		},
		isQueryChange: false,
	});

	return (
		data && (
			<Stack>
				<TableInfo totalSize={totalSize} unit="건">
					{/* <Select
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
					/> */}
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
							<HeadTableCell width={52}>
								<Checkbox disabled />
							</HeadTableCell>
							<HeadTableCell minWidth={120}>ID</HeadTableCell>
							<HeadTableCell minWidth={180}>플랜</HeadTableCell>
							<HeadTableCell minWidth={180}>
								구독 시작
							</HeadTableCell>
							<HeadTableCell minWidth={180}>
								구독 종료
							</HeadTableCell>
							<HeadTableCell minWidth={300}>상태</HeadTableCell>
						</>
					}>
					{data?.data &&
						data?.data.map((item) => (
							<TableRow key={item.orderId}>
								<TableCell>
									<Checkbox disabled />
								</TableCell>
								<TableCell>
									<Typography
										className="underline"
										data-tracking={`subscription_invoice_no_click,{'button_title': ''}`}
										onClick={() => {
											goToDetailSubscribePage(
												item.orderId
											);
										}}>
										{item.displayOrderId}
									</Typography>
								</TableCell>
								<TableCell>{item.planName}</TableCell>
								<TableCell>
									{format(
										new Date(item.startDate),
										DATE_FORMAT
									)}
								</TableCell>
								<TableCell>
									{format(
										new Date(item.expireDate),
										DATE_FORMAT
									)}
								</TableCell>
								<TableCell>결제완료</TableCell>
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

export default SubscribeHistoryList;
