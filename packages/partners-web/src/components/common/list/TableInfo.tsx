import {Box, BoxProps, Stack} from '@mui/material';

interface Props extends BoxProps {
	info?: string;
	totalSize: number;
	unit: string;
}

function TableInfo({info = '전체', totalSize, unit, children, sx = {}}: Props) {
	return (
		<Box
			className="flex justify-between items-center"
			sx={{
				marginTop: '40px',
				marginBottom: '20px',
				...sx,
			}}>
			<Box
				className="bold table-info-count"
				fontSize="14px"
				sx={{
					minWidth: '60px',
				}}>
				{info}
				<Box
					component="span"
					sx={{
						marginLeft: '4px',
						color: 'primary.main',
					}}>
					{(totalSize ?? 0)?.toLocaleString()}
				</Box>
				{unit}
			</Box>
			<Stack
				flexDirection="row"
				sx={{
					gap: '8px',
				}}>
				{children}
			</Stack>
		</Box>
	);
}

export default TableInfo;
