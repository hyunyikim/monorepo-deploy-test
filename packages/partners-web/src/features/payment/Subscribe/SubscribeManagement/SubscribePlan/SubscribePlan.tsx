import {useMemo} from 'react';

import {Box, Stack, Typography} from '@mui/material';

interface Props {
	title: string;
	desc: string;
	isSubscribed?: boolean;
	isTrial: boolean;
	isEnded?: boolean;
	onClick?: () => void;
	children?: React.ReactNode;
}

function SubscribePlan({
	title,
	desc,
	isSubscribed = false,
	isTrial,
	isEnded = false,
	onClick,
	children,
}: Props) {
	return (
		<>
			<Stack
				sx={(theme) => ({
					minWidth: '460px',
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
				})}
				{...(onClick && {
					onClick,
					className: 'cursor-pointer',
				})}>
				<Stack>
					<Stack flexDirection="row" alignItems="center">
						<Typography
							variant="subtitle2"
							fontWeight="bold"
							mr="6px">
							{title}
						</Typography>
						{isSubscribed && (
							<IsSubscribedChip
								isTrial={isTrial}
								isEnded={isEnded}
							/>
						)}
					</Stack>
					<Typography variant="caption3">{desc}</Typography>
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
