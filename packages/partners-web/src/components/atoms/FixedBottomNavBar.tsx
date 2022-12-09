import {Box, Grid, SxProps} from '@mui/material';
import React from 'react';

function FixedBottomNavBar({
	children,
	sx = {},
	maxWidth = '800px',
}: {
	children: string | string[] | JSX.Element | JSX.Element[];
	sx?: SxProps;
	maxWidth?: string;
}) {
	return (
		<Box
			sx={{
				background: 'white',
				position: 'fixed',
				bottom: '0',
				left: '0',
				right: '0',
				zIndex: 100,
				...sx,
			}}>
			<Grid
				container
				justifyContent="center"
				sx={{
					padding: '12px 40px',
					background: 'white',
					borderTop: '1px solid #E2E2E9',
					marginLeft: 0,
					width: '100%',
				}}>
				<Grid container sx={{maxWidth: maxWidth, margin: 'auto'}}>
					{children}
				</Grid>
			</Grid>
		</Box>
	);
}

export default FixedBottomNavBar;
