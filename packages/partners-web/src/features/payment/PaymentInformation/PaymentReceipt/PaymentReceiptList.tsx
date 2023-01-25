import {useLocation, useNavigate} from 'react-router-dom';

import {Stack, TableRow, Typography} from '@mui/material';
import {
	TitleTypography,
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
	Chip,
} from '@/components';

const totalSize = 10;
const isLoading = false;

function PaymentReceiptList() {
	const {pathname, search} = useLocation();
	const navigate = useNavigate();

	const goToDetailReceiptPage = (idx: number) => {
		navigate(`${pathname}${search}&idx=${idx}`);
	};

	return (
		<Stack>
			<TableInfo totalSize={totalSize} unit="건">
				{/* <PageSelect
						value={filter.pageMaxNum}
						onChange={(value: {
							[key: string]: any;
							pageMaxNum: number;
						}) => {
							sendAmplitudeLog(`${menu}_unit_view_click`, {
								button_title: `노출수_${value.pageMaxNum}개씩`,
							});
							onHandleChangeFilter(value);
						}}
					/> */}
			</TableInfo>
			<Table
				isLoading={isLoading}
				totalSize={totalSize}
				headcell={
					<>
						<HeadTableCell minWidth={120}>ID</HeadTableCell>
						<HeadTableCell minWidth={180}>종류</HeadTableCell>
						<HeadTableCell minWidth={500}>날짜 </HeadTableCell>
						<HeadTableCell minWidth={180}>결제 금액</HeadTableCell>
						<HeadTableCell minWidth={180}>결제 상태</HeadTableCell>
					</>
				}>
				<TableRow>
					<TableCell>
						<Typography
							className="underline"
							onClick={() => {
								goToDetailReceiptPage(123);
							}}>
							test
						</Typography>
					</TableCell>
					<TableCell>test</TableCell>
					<TableCell>test</TableCell>
					<TableCell>test</TableCell>
					<TableCell>
						<Chip label="결제완료" color="green" />
					</TableCell>
				</TableRow>
			</Table>
			{/* <Pagination
					{...paginationProps}
					onChange={(_, page) => {
						onResetCheckedItem();
						onChangePage(_, page);
					}}
				 /> */}
		</Stack>
	);
}

export default PaymentReceiptList;
