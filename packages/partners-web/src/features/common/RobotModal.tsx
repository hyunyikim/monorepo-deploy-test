import {useRef} from 'react';

import {Box, Typography} from '@mui/material';
import Lottie from 'react-lottie';

import {Dialog} from '@/components';
import animationData from '@/assets/etc/lottie_onboarding_welcome_fireworks.json';

interface Props {
	open: boolean;
	onClose: () => void;
	title: string;
	subTitle: string;
	children: React.ReactElement;
	ActionComponent: React.ReactElement;
	useLottieAnimation?: boolean;
}

const lottieDefaultOptions = {
	loop: true, // or 1
	autoplay: true,
	animationData: animationData,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

// 로봇이 가운데 있고 타이틀, 서브타이틀로 구성된 모달
// 도메인의 성격이 더 강한듯 하여 component가 아닌 feature 폴더에 위치시킴
function RobotModal({
	open,
	onClose,
	children,
	title,
	subTitle,
	ActionComponent,
	useLottieAnimation,
}: Props) {
	const ref = useRef<HTMLDivElement | null>(null);
	return (
		<Dialog
			open={open}
			showCloseButton={true}
			width={780}
			height={490}
			padding={32}
			onClose={onClose}
			ActionComponent={ActionComponent}>
			<>
				<Box
					sx={{
						position: 'relative',
						display: 'flex',
						justifyContent: 'center',
						height: {
							xs: '250px',
							sm: '300px',
						},
					}}>
					{useLottieAnimation && (
						<Box
							sx={{
								position: 'absolute',
								zIndex: -1,
								width: '80%',
								height: 'inherit',
							}}>
							<Lottie
								ref={ref}
								options={lottieDefaultOptions}
								width={'inherit'}
								height={'inherit'}
								speed={0.5}
								isClickToPauseDisabled={true}
							/>
						</Box>
					)}
					{/* 로봇 이미지  */}
					<Box
						className="flex-center"
						sx={{
							width: {
								xs: '70%',
								sm: 'auto',
							},
							minWidth: '250px',
							'& > *': {
								width: 'inherit',
							},
						}}>
						{children}
					</Box>
				</Box>
				<Typography
					variant="h2"
					fontSize={{
						xs: 20,
						sm: 32,
					}}
					fontWeight={700}
					mt="16px"
					mb="10px"
					textAlign={'center'}
					sx={{
						wordBreak: 'keep-all',
					}}>
					{title}
				</Typography>
				<Typography
					variant="h4"
					fontSize={16}
					fontWeight={700}
					textAlign={'center'}
					sx={{
						wordBreak: 'keep-all',
					}}>
					{subTitle}
				</Typography>
			</>
		</Dialog>
	);
}

export default RobotModal;
