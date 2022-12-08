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
				marginTop: '40px',
				marginBottom: '20px',
				...sx,
			}}>
			<Box className="bold table-info-count" fontSize="14px">
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
						marginRight: '8px',
					},
				}}>
				{children}
			</Box>
		</Box>
	);
}

export default TableInfo;
