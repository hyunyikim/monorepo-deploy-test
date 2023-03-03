import {useMemo} from 'react';

import {Typography, Box, Stack} from '@mui/material';
import {Dialog, LinearProgress} from '@/components';

interface Props {
	title: string;
	open: boolean;
	requestCount: number;
	totalCount: number;
}

function ProgressModal({title, open, requestCount, totalCount}: Props) {
	const progress = useMemo(() => {
		const value = (requestCount / totalCount) * 100;
		return value > 100 ? 100 : value;
	}, [totalCount, requestCount]);
	return (
		<Dialog
			open={open}
			width={500}
			height={210}
			sx={{
				'& .MuiPaper-root .MuiDialogContent-root': {
					marginTop: 0,
					padding: '0 !important',
				},
			}}>
			<Stack
				height="inherit"
				flexDirection="column"
				justifyContent="center"
				paddingX="64px">
				<Typography fontWeight={700} fontSize={20} textAlign="center">
					{title}
				</Typography>
				<Box className="flex-center" mt="20px" mb="16px">
					<Typography fontWeight={800} fontSize={14}>
						{requestCount}&nbsp;
					</Typography>
					<Typography fontWeight={400} fontSize={14}>
						/ {totalCount}
					</Typography>
				</Box>
				<LinearProgress variant="determinate" value={progress} />
			</Stack>
		</Dialog>
	);
}

export default ProgressModal;
