import {Typography} from '@mui/material';

interface Props {
	title: string;
}

function ListTitle({title}: Props) {
	return (
		<Typography component="h1" className="head-1" mb="40px">
			{title}
		</Typography>
	);
}

export default ListTitle;
