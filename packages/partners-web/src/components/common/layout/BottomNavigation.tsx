import {Stack, Box} from '@mui/material';

import {PAGE_MAX_WIDTH} from '@/data';

function BottomNavigation({children}: {children: React.ReactElement}) {
	return (
		<Box
			sx={{
				position: 'fixed',
				bottom: 0,
				width: '100%',
				height: '72px',
				backgroundColor: '#FFF',
			}}>
			<Stack
				sx={{
					height: 'inherit',
					maxWidth: PAGE_MAX_WIDTH,
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
