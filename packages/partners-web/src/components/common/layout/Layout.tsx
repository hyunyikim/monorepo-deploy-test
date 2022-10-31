import {Outlet} from 'react-router-dom';
import {Box, AppBar, Toolbar, Theme, useTheme} from '@mui/material';
import styled from '@emotion/styled';

import {headerHeight} from '@/data';

import Header from '@/components/common/layout/Header';
import Sidebar from '@/components/common/layout/Sidebar';
import {useBackgroundColorStore} from '@/stores';

function Layout() {
	const theme = useTheme();
	const bgColor = useBackgroundColorStore((state) => state.backgroundColor);

	const Main = styled('main')(({theme}: {theme: Theme}) => ({
		width: '100%',
		height: `calc(100vh - ${headerHeight})`,
		position: 'relative',
		top: headerHeight,
		padding: '40px',
		[theme.breakpoints.down('sm')]: {
			marginLeft: 0,
			marginRight: 0,
			width: '100%',
			padding: '20px',
			height: '100%',
		},
		backgroundColor: bgColor ?? theme.palette.background.default,
	}));

	return (
		<Box
			sx={{
				display: 'flex',
			}}>
			<AppBar
				sx={{borderBottom: '1px solid #E6E9EC', height: headerHeight}}
				enableColorOnDark
				position="fixed"
				color="inherit"
				elevation={0}>
				<Toolbar
					sx={{
						padding: '10px 20px',
						justifyContent: 'space-between',
					}}>
					<Header />
				</Toolbar>
			</AppBar>
			<Sidebar />
			<Main theme={theme}>
				<Outlet />
			</Main>
		</Box>
	);
}

export default Layout;
