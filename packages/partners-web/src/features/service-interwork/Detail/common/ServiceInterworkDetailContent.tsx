import {Stack, Box, Typography} from '@mui/material';

interface Props {
	imgSrcList: [string[], string[]];
	children: React.ReactElement;
	mt?: string;
}

function ServiceInterworkDetailContent({
	imgSrcList,
	children,
	mt = '0px',
}: Props) {
	return (
		<Stack mt={mt}>
			<Typography variant="subtitle1" mb="12px">
				서비스 소개
			</Typography>
			<Stack
				flexDirection={{
					xs: 'column',
					sm: 'row',
				}}
				pb="32px"
				mb="24px"
				sx={{
					'& > *': {
						flex: 1,
					},
					gap: '16px',
					borderBottom: (theme) =>
						`1px solid ${theme.palette.grey[100]}`,
				}}>
				{imgSrcList.map((item, idx) => (
					<ImageBox key={idx} img={item} />
				))}
			</Stack>
			<Stack
				sx={{
					lineHeight: 1.45,
					'& h3': {
						fontSize: 21,
						fontWeight: 'bold',
						marginBottom: '8px',
					},
					'& h4': {
						fontSize: 16,
						fontWeight: 'bold',
					},
					'& p': {
						fontSize: 16,
						fontWeight: 400,
						marginBottom: '20px',
					},
					'& .arrow': {
						fontFamily: 'sans-serif',
					},
				}}>
				{children}
			</Stack>
		</Stack>
	);
}

const ImageBox = ({img}: {img: string[]}) => {
	return (
		<Box
			sx={{
				borderRadius: '8px',
				overflow: 'hidden',
			}}>
			<img
				src={img[0]}
				style={{
					width: '100%',
					height: '100%',
				}}
			/>
		</Box>
	);
};

export default ServiceInterworkDetailContent;
