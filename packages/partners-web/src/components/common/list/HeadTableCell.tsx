import {TableCellProps} from '@mui/material';

import {TableCell} from '@/components';

interface Props extends TableCellProps {
	minWidth: number; // 디자인에 정의되어 있는 width값 부여
}

function HeadTableCell({children, ...props}: Props) {
	return <TableCell {...props}>{children}</TableCell>;
}

export default HeadTableCell;
