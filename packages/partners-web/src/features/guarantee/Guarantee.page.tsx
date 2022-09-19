import {useNavigate} from 'react-router-dom';
import {Container} from '@mui/material';

import {Button} from '@/components';

function Guarantee() {
	const navigate = useNavigate();
	return (
		<Container>
			<h1>hello, I'm Guarantee page</h1>
			<Button onClick={() => navigate(-1)}>Let's go back !</Button>
		</Container>
	);
}

export default Guarantee;
