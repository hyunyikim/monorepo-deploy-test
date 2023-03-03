import {useNavigate} from 'react-router-dom';

import {Stack, Typography} from '@mui/material';

import {Button} from '@/components';
import {HEADER_HEIGHT} from '@/data';

function Error() {
	const navigate = useNavigate();
	return (
		<Stack
			sx={{
				minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
				justifyContent: 'center',
				alignItems: 'center',
			}}>
			<Typography
				fontSize={24}
				fontWeight="bold"
				sx={{
					marginBottom: '24px',
				}}>
				일시적인 오류가 발생했습니다.
			</Typography>
			<Button
				onClick={() => {
					navigate('/');
				}}>
				메인 페이지로 돌아가기
			</Button>
		</Stack>
	);
}

export default Error;
