import {Box} from '@mui/material';

import Header from '@/components/common/layout/Header';
import BottomNavigation from '@/components/common/layout/BottomNavigation';
import {Button} from '@/components';
import {HEADER_HEIGHT} from '@/data';

function TestFullPage() {
	return (
		<>
			<Header backgroundColor="transparent" borderBottom={false} />
			{['burlywood', 'gray', 'yellowgreen', 'yellow'].map((item, idx) => (
				<Box
					key={item}
					sx={{
						width: '100%',
						height: '300px',
						backgroundColor: item,
						paddingTop: idx === 0 ? HEADER_HEIGHT : 0,
					}}>
					hello world {item}
				</Box>
			))}
			<BottomNavigation>
				<>
					<Button>hello</Button>
					<Button>hello</Button>
				</>
			</BottomNavigation>
		</>
	);
}

export default TestFullPage;
