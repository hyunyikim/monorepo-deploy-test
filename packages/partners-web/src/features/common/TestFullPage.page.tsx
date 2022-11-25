import {Box} from '@mui/material';

import Header from '@/components/common/layout/Header';
import BottomNavigation from '@/components/common/layout/BottomNavigation';
import {Button, Dialog} from '@/components';
import {HEADER_HEIGHT} from '@/data';
import {useChildModalOpen} from '@/utils/hooks';

function TestFullPage() {
	const {open, onOpen, onClose} = useChildModalOpen({});
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
					<Button onClick={onOpen}>자식 모달 열기</Button>
					<Button onClick={onClose}>자식 모달 닫기</Button>
				</>
			</BottomNavigation>
			<Dialog open={open} onClose={onClose}>
				<>자식 모달</>
			</Dialog>
		</>
	);
}

export default TestFullPage;
