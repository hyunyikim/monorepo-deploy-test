import {Suspense} from 'react';
import {useNavigate} from 'react-router-dom';

import {Container} from '@mui/material';
import {css} from '@emotion/react';

import {Button} from '@/components';

function Dashboard() {
	const navigate = useNavigate();
	return (
		<Suspense fallback={<div>loading</div>}>
			<Container>
				<h1>hello, I'm dashboard</h1>
				<Button
					onClick={() => navigate('/guarantee')}
					emStyle={css`
						background-color: yellow;
						&:hover {
							background: green;
						}
					`}>
					Let's go to Guarantee page !
				</Button>
			</Container>
		</Suspense>
	);
}

export default Dashboard;
