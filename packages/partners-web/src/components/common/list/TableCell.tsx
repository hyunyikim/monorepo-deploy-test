import {Box, TableCell as MuiTableCell, TableCellProps} from '@mui/material';

interface Props extends TableCellProps {}

function TableCell({align, children, ...props}: Props) {
	return (
		<MuiTableCell {...props}>
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
