import {
	Table as MuiTable,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	TableProps,
} from '@mui/material';

import {TableCell} from '@/components';

interface Props extends TableProps {
	isLoading: boolean;
	totalSize: number;
	headcell: React.ReactNode;
}

function Table({isLoading, totalSize, headcell, children}: Props) {
	return (
		<TableContainer
			sx={(theme) => ({
				borderRadius: '4px',
				// thead
				'& .MuiTableCell-root.MuiTableCell-head, & .MuiTableCell-root.MuiTableCell-head p':
					{
						backgroundColor: 'grey.10',
						color: 'grey.700',
						fontWeight: 'bold',
					},
				'& .MuiTableCell-root': {
					border: `1px solid ${theme.palette.grey[100]}`,
					fontSize: '14px',
					lineHeight: '14px',
					// cell의 자식
					'& div': {
						display: 'flex',
						alignItems: 'center',
					},
					padding: 0,
					'& > .MuiBox-root': {
						paddingLeft: '16px',
						paddingRight: '16px',
					},
				},
				'& .MuiTableRow-root > .MuiTableCell-root:nth-of-type(1)': {
					borderLeft: 'none',
				},
				'& .MuiTableRow-root > .MuiTableCell-root:nth-last-of-type(1)':
					{
						borderRight: 'none',
					},
				// thead row height
				'& .MuiTableHead-root .MuiTableCell-root > .MuiBox-root': {
					minHeight: '46px',
				},
				// tbody row height
				'& .MuiTableBody-root .MuiTableCell-root > .MuiBox-root': {
					minHeight: '48px',
				},
			})}>
			<MuiTable aria-label="simple table">
				<TableHead>
					<TableRow>{headcell}</TableRow>
				</TableHead>
				<TableBody>
					{/* 너무 빠르게 isLoading이 변경 되기 때문에 현재 의미가 없어 false로 임시 처리 */}
					{false ? (
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
