import {
	Table as MuiTable,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableProps,
} from '@mui/material';

interface Props extends TableProps {
	isLoading: boolean;
	totalSize: number;
	headcell: React.ReactNode;
}

function Table({isLoading, totalSize, headcell, children}: Props) {
	return (
		<TableContainer
			sx={{
				borderRadius: '4px',
				'& .MuiTableHead-root': {
					height: '46px',
					backgroundColor: 'grey.10',
					color: 'grey.700',
					'& .MuiTableCell-head': {
						padding: '0 16px',
					},
				},
				'& .MuiTableCell-root': {
					borderWidth: '1px',
					borderStyle: 'solid',
					borderColor: 'grey.100',
					fontSize: '14px',
					lineHeight: '14px',
					// cell의 자식
					'& div': {
						display: 'flex',
						alignItems: 'center',
					},
				},
			}}>
			<MuiTable aria-label="simple table">
				<TableHead>
					<TableRow>{headcell}</TableRow>
				</TableHead>
				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell align="center" colSpan={20}>
								데이터를 불러오는 중입니다.
							</TableCell>
						</TableRow>
					) : totalSize === 0 ? (
						<TableRow>
							<TableCell align="center" colSpan={20}>
								데이터가 존재하지 않습니다.
							</TableCell>
						</TableRow>
					) : (
						<>{children}</>
					)}
				</TableBody>
			</MuiTable>
		</TableContainer>
	);
}

export default Table;
