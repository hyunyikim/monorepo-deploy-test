import {
	LinearProgress as MuiLinearProgress,
	LinearProgressProps,
} from '@mui/material';

interface Props extends LinearProgressProps {
	value: number;
}

function LinearProgress({value, ...props}: Props) {
	return (
		<MuiLinearProgress
			value={value}
			sx={{
				backgroundColor: 'grey.50',
				borderRadius: '4px',
				'& .MuiLinearProgress-bar': {
					background:
						'linear-gradient(98.38deg, #5D9BF9 43.58%, #5C3EF6 104.42%)',
					borderRadius: '4px',
				},
			}}
			{...props}
		/>
	);
}

export default LinearProgress;
