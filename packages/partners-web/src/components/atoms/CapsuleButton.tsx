import {useMemo} from 'react';

import {Button as MuiButton, ButtonProps, SxProps} from '@mui/material';

import style from '@/assets/styles/style.module.scss';

type Height = 60 | 48 | 40 | 32;

interface Props extends Omit<ButtonProps, 'color' | 'size'> {
	width?: number | string;
	height?: Height;
	startIcon?: React.ReactNode;
	onClick?: () => void;
}
/**
 *
 * width가 숫자인 경우, 너비가 고정되어 있는 fixed 버튼
 */
function Button({
	variant = 'contained',
	width = 'max-content',
	height = 32,
	sx,
	children,
	onClick,
	startIcon,
	...props
}: Props) {
	const colorSx = useMemo(() => {
		switch (variant) {
			case 'contained':
				return {
					backgroundColor: 'grey.50',
					color: 'grey.900',
					'&:hover': {
						backgroundColor: 'grey.100',
						boxShadow: 'none',
					},
				};
			case 'outlined':
				return {
					borderWidth: '1px',
					borderColor: 'grey.100',
					backgroundColor: 'white',
					color: 'grey.900',
					'&:hover': {
						borderColor: 'grey.100',
						backgroundColor: 'grey.50',
						boxShadow: 'none',
					},
				};
			default:
				return {};
		}
	}, [variant]);

	const sizeSx = useMemo(() => {
		const sx: SxProps = {
			fontWeight: style.bold,
			minHeight: `${height}px`,
			height: `${height}px`,
			width: typeof width === 'number' ? `${width}px` : width,
			borderRadius: '62px',
			lineHeight: `${height}px`,
			fontSize: '14px',
			...(width !== 'auto' &&
				{
					// padding: '0',
					// minWidth: '0',
				}),
		};
		return sx;
	}, [variant, width, height]);

	return (
		<MuiButton
			variant={variant}
			onClick={onClick}
			sx={{
				...colorSx,
				...sizeSx,
				...sx,
			}}
			{...props}>
			{startIcon && startIcon}
			{children}
		</MuiButton>
	);
}

export default Button;
