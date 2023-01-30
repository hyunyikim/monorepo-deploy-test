import {useCallback, useEffect} from 'react';
import {parse, stringify} from 'qs';

import {
	useParams,
	useSearchParams,
	useLocation,
	useNavigate,
} from 'react-router-dom';

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
} from '@/components';

const totalSize = 10;
const isLoading = false;

function SubscribeHistoryList() {
	const {pathname, search} = useLocation();
	const navigate = useNavigate();

	const goToDetailSubscribePage = (idx: number) => {
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
						<HeadTableCell width={52}>
							<Checkbox disabled />
						</HeadTableCell>
						<HeadTableCell width={120}>ID</HeadTableCell>
						<HeadTableCell width={180}>플랜</HeadTableCell>
						<HeadTableCell width={180}>구독 시작</HeadTableCell>
						<HeadTableCell width={180}>구독 종료</HeadTableCell>
						<HeadTableCell minWidth={500}>상태</HeadTableCell>
					</>
				}>
				<TableRow>
					<TableCell>
						<Checkbox disabled />
					</TableCell>
					<TableCell>
						<Typography
							className="underline"
							onClick={() => {
								goToDetailSubscribePage(123);
							}}>
							test
						</Typography>
					</TableCell>
					<TableCell>test</TableCell>
					<TableCell>test</TableCell>
					<TableCell>test</TableCell>
					<TableCell>test</TableCell>
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

export default SubscribeHistoryList;
