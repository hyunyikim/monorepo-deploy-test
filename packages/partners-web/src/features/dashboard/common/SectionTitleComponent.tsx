import React from 'react';
import {
	useCallback,
	useEffect,
	useMemo,
	useState,
	ReactElement,
	ReactNode,
} from 'react';

import {
	Box,
	Stack,
	Typography,
	Grid,
	Card,
	useTheme,
	SxProps,
} from '@mui/material';

interface SectionTitleProps {
	boxTitle: string | JSX.Element;
	boxSubtitle?: string;
}

function SectionTitleComponent({boxTitle, boxSubtitle}: SectionTitleProps) {
	return (
		<Box sx={{marginBottom: '20px'}}>
			{typeof boxTitle === 'string' ? (
				<Typography
					variant="h3"
					sx={{
						fontWeight: 700,
						fontSize: '21px',
						lineHeight: '145%',
						color: 'grey.900',
					}}>
					{boxTitle}
				</Typography>
			) : (
				<>{boxTitle}</>
			)}

			{boxSubtitle && (
				<Typography
					variant="h4"
					sx={{
						fontWeight: 500,
						fontSize: '15px',
						lineHeight: '145%',
						color: 'grey.600',
						marginTop: '4px',
					}}>
					{boxSubtitle}
				</Typography>
			)}
		</Box>
	);
}

export default SectionTitleComponent;
