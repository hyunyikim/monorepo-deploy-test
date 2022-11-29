import {Stack, Box} from '@mui/material';

import {PAGE_MAX_WIDTH} from '@/data';

interface Props {
	maxWidth?: string;
	children: React.ReactElement;
}

function BottomNavigation({maxWidth = PAGE_MAX_WIDTH, children}: Props) {
	return (
		<Box
			sx={{
				position: 'fixed',
				left: 0,
				bottom: 0,
				width: '100%',
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
					justifyContent: 'space-between',
					alignItems: 'center',
				}}>
				{children}
			</Stack>
		</Box>
	);
}

export default BottomNavigation;
