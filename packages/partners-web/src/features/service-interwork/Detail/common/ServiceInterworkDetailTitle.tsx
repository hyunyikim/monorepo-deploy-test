import {Stack, Box, Typography} from '@mui/material';

interface Props {
	title: string;
	subTitle: string;
	titleImgBackgroundColor: string;
	TitleImg: React.ReactElement;
	Button: React.ReactElement;
}

function ServiceInterworkDetailTitle({
	title,
	subTitle,
	titleImgBackgroundColor,
	TitleImg,
	Button,
}: Props) {
	return (
		<Stack
			flexDirection={{
				xs: 'column',
				sm: 'row',
			}}
			justifyContent="space-between"
			alignItems="center"
			pb="40px"
			mb="60px"
			gap={{
				xs: '12px',
				sm: 0,
			}}
			sx={{
				borderBottom: (theme) => `1px solid ${theme.palette.grey[900]}`,
			}}>
			<Stack
				flexDirection={{
					xs: 'column',
					sm: 'row',
				}}
				gap={{
					xs: '12px',
					sm: 0,
				}}>
				<Box
					className="flex-center"
					sx={{
						width: '100px',
						height: '100px',
						borderRadius: '16px',
						backgroundColor: titleImgBackgroundColor,
						marginRight: '24px',
						position: 'relative',
					}}>
					{TitleImg}
				</Box>
				<Stack flexDirection="column" justifyContent="center">
					<Typography variant="header1" mb="8px">
						{title}
					</Typography>
					<Typography variant="body3" color="grey.500">
						{subTitle}
					</Typography>
				</Stack>
			</Stack>
			{Button}
		</Stack>
	);
}

export default ServiceInterworkDetailTitle;
