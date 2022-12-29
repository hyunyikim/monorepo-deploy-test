import {Typography} from '@mui/material';

interface Props {
	title: string;
}

function TitleTypography({title}: Props) {
	return (
		<Typography variant="header1" mb="24px">
			{title}
		</Typography>
	);
}

export default TitleTypography;
