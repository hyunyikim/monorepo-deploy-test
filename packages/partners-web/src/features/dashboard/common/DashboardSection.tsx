import {ReactElement} from 'react';

import {Box, Typography, Grid, Card, useTheme, SxProps} from '@mui/material';

interface DashboardSectionProps {
	children: ReactElement | ReactElement[];
	sectionTitle?: string;
	sx?: SxProps;
	ChildrenSx?: SxProps;
}

function DashboardSection({
	children,
	sectionTitle,
	sx,
	ChildrenSx,
}: DashboardSectionProps) {
	const theme = useTheme();
	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				gap: '12px',
				maxWidth: '1200px',
				margin: '0 auto 20px',
				width: '100%',
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
						[theme.breakpoints.down(1330)]: {
							width: '590px',
							margin: 'auto',
						},
					}}>
					{sectionTitle}
				</Typography>
			)}

			<Box
				sx={{
					display: 'flex',
					gap: '20px',
					flexWrap: 'wrap',
					justifyContent: 'center',
					...ChildrenSx,
				}}>
				{children}
			</Box>
		</Box>
	);
}

export default DashboardSection;
