import {Grid, Box} from '@mui/material';
import React, {useMemo} from 'react';

interface Props {
	text: string;
	idx?: number;
	isActive?: boolean;
	activeHandler(e: React.ChangeEvent<HTMLInputElement>): void;
}

function Tab({text, isActive, idx, activeHandler}: Props) {
	const activeSx = useMemo(() => {
		switch (isActive) {
			case true:
				return {
					backgroundColor: 'grey.900',
					color: 'white',
					'&:hover': {
						backgroundColor: 'grey.700',
					},
				};
			default:
				return {
					backgroundColor: 'grey.50',
					color: 'grey.300',
					'&:hover': {
						backgroundColor: 'grey.100',
					},
				};
		}
	}, [isActive]);

	return (
		<Box
			sx={{
				cursor: 'pointer',
				display: 'inline-block',
				padding: '0 20px',
				height: '40px',
				borderRadius: '44px',
				fontWeight: 700,
				fontSize: '14px',
				lineHeight: '40px',
				width: 'auto',
				...activeSx,
			}}
			data-tabidx={idx}
			// onClick={activeHandler}
			onClick={(e) => activeHandler(e)}>
			{text}
		</Box>
	);
}

export default Tab;
