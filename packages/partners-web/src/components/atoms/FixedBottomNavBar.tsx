import {FOLDED_SIDEBAR_WIDTH, SIDEBAR_WIDTH} from '@/data';
import {useSidebarControlStore} from '@/stores';
import {Box, Grid, SxProps} from '@mui/material';

function FixedBottomNavBar({
	children,
	sx = {},
	maxWidth = '800px',
}: {
	children: string | string[] | JSX.Element | JSX.Element[];
	sx?: SxProps;
	maxWidth?: string;
}) {
	const isSidebarOpen = useSidebarControlStore((state) => state.isOpen);
	const sidebarWidth = isSidebarOpen ? SIDEBAR_WIDTH : FOLDED_SIDEBAR_WIDTH;
	return (
		<Box
			sx={{
				background: 'white',
				position: 'fixed',
				bottom: '0',
				left: '0',
				right: '0',
				marginLeft: `calc(${sidebarWidth} + 1px)`,
				width: `calc(100% - ${sidebarWidth} - 1px)`,
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
