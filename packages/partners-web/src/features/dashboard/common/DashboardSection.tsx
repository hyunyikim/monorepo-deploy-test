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

interface DashboardSectionProps {
	children: ReactElement | ReactElement[];
	sectionTitle?: string;
	sx?: SxProps;
}

function DashboardSection({children, sectionTitle, sx}: DashboardSectionProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '12px',
				marginBottom: '40px',
				...(sx && sx),
			}}>
			{sectionTitle && (
				<Typography
					variant="h2"
					sx={{
						fontWeight: 700,
						fontSize: '18px',
						lineHeight: '145%',
						color: 'grey.700',
					}}>
					{sectionTitle}
				</Typography>
			)}

			<Box
				sx={{
					display: 'flex',
					gap: '20px',
				}}>
				{children}
			</Box>
		</Box>
	);
}

export default DashboardSection;
