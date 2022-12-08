import {Box, TableCell as MuiTableCell, TableCellProps} from '@mui/material';
interface Props extends TableCellProps {
	minWidth?: number; // 디자인에 정의되어 있는 width값 부여
}

function TableCell({minWidth, align, children, sx = {}, ...props}: Props) {
	return (
		<MuiTableCell
			sx={{
				...(minWidth && {
					minWidth,
				}),
				...sx,
			}}
			{...props}>
			<Box
				sx={{
					justifyContent: align,
				}}>
				{children}
			</Box>
		</MuiTableCell>
	);
}

export default TableCell;
