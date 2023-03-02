import {ReactNode} from 'react';

import {
	Box,
	Stack,
	Typography,
	Grid,
	Card,
	useTheme,
	SxProps,
} from '@mui/material';

interface SectionBoxProps {
	children: ReactNode;
	sx?: SxProps;
}

function SectionBox({children, sx}: SectionBoxProps) {
	return (
		<Box
			sx={{
				background: '#FFFFFF',
				border: '1px solid #E2E2E9',
				boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
				borderRadius: '8px',
				padding: '24px',
				minHeight: '400px',
				maxHeight: '400px',
				...sx,
			}}>
			{children}
		</Box>
	);
}

export default SectionBox;
