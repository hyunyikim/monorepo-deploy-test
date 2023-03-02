import {
	DialogContent,
	DialogActions,
	Box,
	Stack,
	Typography,
	Button,
} from '@mui/material';
import Lottie from 'react-lottie';

import animationData from '@/assets/etc/lottie_onboarding_welcome_fireworks.json';

import Dialog from '@/components/common/Dialog';
import {
	ImgRobotWelcoming,
	ImgRobotWelcoming2x,
	ImgRobitWithPencil,
	ImgRobitWithPencil2x,
} from '@/assets/images';

interface Props {
	open: boolean;
	onClose?: () => void;
}

function DashboardDialog({open, onClose}: Props) {
	return (
		<Dialog
			open={open}
			onClose={onClose}
			showCloseButton={true}
			sx={{
				borderRadius: '8px',
				'& .MuiPaper-root': {
					padding: '50px',
				},
			}}>
			<>
				<DialogContent
					sx={{
						padding: 0,
					}}>
					<Stack>
						<Box
							sx={{
								position: 'absolute',
								top: '60px',
								left: 0,
								right: 0,
								margin: 'auto',
								zIndex: 0,
								height: '354px',
								width: '530px',
							}}>
							<Lottie
								options={{
									loop: true, // or 1
									autoplay: true,
									animationData,
									rendererSettings: {
										preserveAspectRatio: 'xMidYMid slice',
									},
								}}
								speed={0.5}
								isClickToPauseDisabled={true}
							/>
						</Box>
						<img
							src={ImgRobotWelcoming}
							srcSet={`${ImgRobotWelcoming} 1x ${ImgRobotWelcoming2x} 2x`}
							alt="dialog-robot-img"
							style={{
								margin: 'auto',
								position: 'relative',
							}}
						/>
						<Typography
							variant="h2"
							align="center"
							fontWeight={700}
							fontSize="32px"
							marginBottom="10px">
							{/* {`${partnershipData?.companyName || '회원'}님, 버클가입을 축하드려요!`} */}
							{`${'회원'}님, 버클가입을 축하드려요!`}
						</Typography>
						<Typography
							variant="subtitle1"
							align="center"
							fontWeight={500}
							fontSize={16}
							marginBottom="50px">
							이용 가이드를 통해 버클의 기능들을 미리
							경험해보세요!
						</Typography>
					</Stack>
				</DialogContent>
				<DialogActions
					sx={{
						justifyContent: 'center',
					}}>
					{/* TODO: onClick */}
					<DialogButton variant="outlined" title="버튼1" />
					<DialogButton variant="contained" title="버튼1" />
				</DialogActions>
			</>
		</Dialog>
	);
}

const DialogButton = ({
	variant,
	title,
}: {
	variant: 'outlined' | 'contained';
	title: string;
}) => (
	<Button
		variant={variant}
		sx={{
			width: '236px',
			height: '60px',
			fontWeight: 700,
			fontSize: '18px',
			'&.MuiButton-outlined': {
				border: '1.5px solid',
			},
		}}>
		{title}
	</Button>
);

export default DashboardDialog;
