import {Outlet} from 'react-router-dom';
import styled from '@emotion/styled';

import {HEADER_HEIGHT, PARTIAL_PAGE_MAX_WIDTH} from '@/data';

import Header from '@/components/common/layout/Header';
import Sidebar from '@/components/common/layout/Sidebar';

interface Props {
	hasHeader?: boolean;
	hasSidebar?: boolean;
}

function Layout({hasHeader = true, hasSidebar = true}: Props) {
	const Main = styled('main')(({hasHeader}: {hasHeader: boolean}) => ({
		display: 'flex',
		justifyContent: 'center',
		alignContent: 'center',
		width: '100%',
		maxWidth: PARTIAL_PAGE_MAX_WIDTH,
		height: hasHeader ? `calc(100vh - ${HEADER_HEIGHT})` : '100vh',
		position: 'relative',
		top: hasHeader ? HEADER_HEIGHT : 0,
		padding: '0 10px',
		margin: 'auto',
	}));

	return (
		<>
			{hasHeader && <Header />}
			{hasSidebar && <Sidebar />}
			<Main hasHeader={hasHeader}>
				<Outlet />
			</Main>
		</>
	);
}

export default Layout;
