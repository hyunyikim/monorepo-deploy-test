import {Stack, Box, Typography} from '@mui/material';

interface Props {
	title: string;
	value: any;
	Icon: React.ReactElement;
}

function DetailInfoCard({title, value, Icon}: Props) {
	return (
		<Stack
			flexDirection="row"
			justifyContent="space-between"
			alignItems="center"
			minWidth={250}
			sx={{
				borderWidth: '1px',
				borderStyle: 'solid',
				borderColor: 'grey.100',
				borderRadius: '8px',
				padding: '20px',
				height: '80px',
			}}>
			<Box>
				<Typography color="grey.500" variant="caption1" pb={0.5}>
					{title}
				</Typography>
				<Typography variant="subtitle2">{value}</Typography>
			</Box>
			<Box
				sx={{
					width: '48px',
					height: '48px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: '50%',
					backgroundColor: 'grey.50',
				}}>
				{Icon}
			</Box>
		</Stack>
	);
}

export default DetailInfoCard;
