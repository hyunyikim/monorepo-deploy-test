import {Box, BoxProps} from '@mui/material';

interface Props extends BoxProps {
	totalSize: number;
	unit: string;
}

function TableInfo({totalSize, unit, children, sx = {}}: Props) {
	return (
		<Box
			className="flex justify-between items-center"
			sx={{
				margin: '30px 0',
				...sx,
			}}>
			<Box className="bold">
				전체
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
			<Box
				sx={{
					'& > *': {
						marginLeft: '8px',
					},
				}}>
				{children}
			</Box>
		</Box>
	);
}

export default TableInfo;
