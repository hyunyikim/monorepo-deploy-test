import {useMemo} from 'react';

import {Box, Stack, Theme, Typography} from '@mui/material';
import {SxProps} from '@mui/system';

interface Props {
	title: string;
	desc: string | null;
	showSubscribedChip?: boolean;
	isTrial: boolean;
	isEnded?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
	sx?: SxProps<Theme>;
}

function SubscribePlan({
	title,
	desc,
	showSubscribedChip = false,
	isTrial,
	isEnded = false,
	onClick,
	children,
	sx,
}: Props) {
	return (
		<>
			<Stack
				sx={[
					(theme) => ({
						justifyContent: 'center',
						minWidth: '460px',
						minHeight: '80px',
						padding: '20px',
						borderRadius: '8px',
						border: isEnded
							? `1px solid ${theme.palette.grey[100]}`
							: `1px solid ${theme.palette.primary.main}`,
						color: theme.palette.grey[900],
						'& .subscribe-chip': {
							backgroundColor: 'primary.50',
							color: 'primary.main',
						},
					}),
					...(Array.isArray(sx) ? sx : [sx]),
				]}
				{...(onClick && {
					onClick,
					className: 'cursor-pointer',
				})}>
				<Stack
					flexDirection="row"
					justifyContent="space-between"
					alignItems="center">
					<Stack>
						<Stack flexDirection="row" alignItems="center">
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								mr="6px">
								{title}
							</Typography>
							{showSubscribedChip && (
								<IsSubscribedChip
									isTrial={isTrial}
									isEnded={isEnded}
								/>
							)}
						</Stack>
						{desc && (
							<Typography variant="caption1" mt="4px">
								{desc}
							</Typography>
						)}
					</Stack>
				</Stack>
				{children && children}
			</Stack>
		</>
	);
}

const IsSubscribedChip = ({
	isTrial,
	isEnded,
}: {
	isTrial: boolean;
	isEnded: boolean;
}) => {
	const message = useMemo(() => {
		if (isEnded) {
			return '이용종료';
		}
		return isTrial ? '이용중' : '구독중';
	}, [isTrial, isEnded]);
	return (
		<Box
			sx={{
				height: '16px',
				fontSize: 11,
				fontWeight: 700,
				padding: '0px 5px',
				borderRadius: '4px',
				color: isEnded ? 'red.main' : 'primary.main',
				backgroundColor: isEnded ? 'red.50' : 'primary.50',
			}}>
			{message}
		</Box>
	);
};

export default SubscribePlan;
