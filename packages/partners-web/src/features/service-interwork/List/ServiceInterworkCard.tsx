import React from 'react';
import {Stack, Box, Typography, Skeleton} from '@mui/material';

import {IcTick} from '@/assets/icon';

interface CardProps {
	name: string;
	title: string;
	subTitle: string | React.ReactElement;
	// 카드 상단 이미지
	InfoComponent: React.ReactElement;
	isLinked: boolean;
	onClick: () => void;
}

interface LoadingProps {
	isLoading: boolean;
}

// 두개의 타입 중에 하나의 타입만 가능하다.
type Only<T, U> = {
	[P in keyof T]: T[P];
} & {
	[P in keyof U]?: never;
};

function ServiceInterworkCard({
	isLoading = false,
	InfoComponent,
	title,
	subTitle,
	isLinked,
	onClick,
}: Only<LoadingProps, CardProps> | Only<CardProps, LoadingProps>) {
	return (
		<Stack
			flexDirection="column"
			{...(!isLoading && {
				className: 'cursor-pointer',
			})}
			sx={{
				maxWidth: '390px',
				width: '100%',
				borderRadius: '8px',
				overflow: 'hidden',
				border: (theme) => `1px solid ${theme.palette.grey[100]}`,
				'&:hover': {
					border: (theme) =>
						`1px solid ${theme.palette.primary.main}`,
					boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.25)',
				},
			}}
			onClick={onClick}>
			<Box
				sx={{
					minHeight: '200px',
					'& > *': {
						minHeight: 'inherit',
					},
				}}>
				{isLoading ? (
					<Skeleton variant="rectangular" height="inherit" />
				) : (
					InfoComponent
				)}
			</Box>
			<Stack flexDirection="column" p="20px" minHeight="114px">
				{isLoading ? (
					<>
						<Skeleton
							variant="text"
							width={160}
							sx={{
								fontSize: '16px',
							}}
						/>
						<Skeleton
							variant="text"
							sx={{
								fontSize: '14px',
							}}
						/>
					</>
				) : (
					<>
						<Typography
							variant="subtitle2"
							color="grey.900"
							mb="4px"
							sx={{
								display: 'flex',
								alignItems: 'center',
							}}>
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
					</>
				)}
			</Stack>
		</Stack>
	);
}

export default ServiceInterworkCard;
