import {TableCellProps, Typography} from '@mui/material';

import {TableCell} from '@/components';

interface Props extends TableCellProps {
	width?: number | string;
	required?: boolean;
	minWidth?: number; // 디자인에 정의되어 있는 width값 부여
}

function HeadTableCell({children, required = false, ...props}: Props) {
	return (
		<TableCell {...props}>
			{children}
			{required && (
				<Typography
					ml="4px"
					sx={{
						color: (theme) =>
							`${theme.palette.red.main} !important`,
					}}>
					*
				</Typography>
			)}
		</TableCell>
	);
}

export default HeadTableCell;
