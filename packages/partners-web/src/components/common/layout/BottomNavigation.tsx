import {ResponsiveStyleValue} from '@mui/system';

import {Stack, Box} from '@mui/material';

import {FOLDED_SIDEBAR_WIDTH, PAGE_MAX_WIDTH, SIDEBAR_WIDTH} from '@/data';
import {useSidebarControlStore} from '@/stores';

interface Props {
	maxWidth?: string | ResponsiveStyleValue<any>;
	justifyContent?: 'space-between' | 'flex-start' | 'flex-end' | 'center';
	children: React.ReactElement;
}

function BottomNavigation({
	maxWidth = PAGE_MAX_WIDTH,
	justifyContent = 'space-between',
	children,
}: Props) {
	const isSidebarOpen = useSidebarControlStore((state) => state.isOpen);
	const sidebarWidth = isSidebarOpen ? SIDEBAR_WIDTH : FOLDED_SIDEBAR_WIDTH;
	return (
		<Box
			sx={{
				position: 'fixed',
				left: 0,
				bottom: 0,
				marginLeft: `calc(${sidebarWidth} + 1px)`,
				width: `calc(100% - ${sidebarWidth} - 1px)`,
				height: '72px',
				backgroundColor: '#FFF',
				borderTop: (theme) => `1px solid ${theme.palette.grey[100]}`,
				zIndex: 10,
			}}>
			<Stack
				sx={{
					height: 'inherit',
					maxWidth: maxWidth,
					margin: 'auto',
					display: 'flex',
					flexDirection: 'row',
					justifyContent,
					alignItems: 'center',
				}}>
				{children}
			</Stack>
		</Box>
	);
}

export default BottomNavigation;
