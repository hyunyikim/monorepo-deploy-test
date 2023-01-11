import {Stack, Box, Typography} from '@mui/material';

import {IcTick} from '@/assets/icon';

interface Props {
	title: string;
	subTitle: string;
	isLinked: boolean;
	mb?: string;
	titleImgBackgroundColor: string;
	TitleImg: React.ReactElement;
	Button: React.ReactElement;
}

function ServiceInterworkDetailTitle({
	title,
	subTitle,
	isLinked,
	mb,
	// mb = '60px',
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
			mb={mb}
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
						{isLinked && (
							<IcTick
								style={{
									marginLeft: '8px',
								}}
							/>
						)}
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
