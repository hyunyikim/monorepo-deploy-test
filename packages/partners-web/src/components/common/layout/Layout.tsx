import {Outlet} from 'react-router-dom';

import {FOLDED_SIDEBAR_WIDTH, HEADER_HEIGHT, SIDEBAR_WIDTH} from '@/data';

import Header from '@/components/common/layout/Header';
import Sidebar from '@/components/common/layout/Sidebar';
import {Stack} from '@mui/material';
import {useSidebarControlStore} from '@/stores';

interface Props {
	hasHeader?: boolean;
	hasSidebar?: boolean;
}

function Layout({hasHeader = true, hasSidebar = true}: Props) {
	return (
		<>
			{hasHeader && <Header />}
			<Stack
				flexDirection="row"
				sx={{
					...(hasHeader && {
						marginTop: HEADER_HEIGHT,
					}),
				}}>
				{hasSidebar && <Sidebar />}
				<Main hasSidebar={hasSidebar}>
					<Outlet />
				</Main>
			</Stack>
		</>
	);
}

const Main = ({
	hasSidebar,
	children,
}: {
	hasSidebar: boolean;
	children: React.ReactNode;
}) => {
	const isSidebarOpen = useSidebarControlStore((state) => state.isOpen);
	return (
		<Stack
			component="main"
			sx={{
				flexGrow: 1,
				width: '100%',
				maxWidth: '100%',
				...(hasSidebar && {
					marginLeft: isSidebarOpen
						? SIDEBAR_WIDTH
						: FOLDED_SIDEBAR_WIDTH,
					transition: 'margin 200ms ease-in-out',
					overflowX: 'hidden',
				}),
			}}>
			{children}
		</Stack>
	);
};

export default Layout;
