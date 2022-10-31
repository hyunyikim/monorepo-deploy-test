import {useMemo} from 'react';

import {Button as MuiButton, ButtonProps, SxProps} from '@mui/material';

import style from '@/assets/styles/style.module.scss';

type Color = 'primary' | 'blue-50' | 'black' | 'grey-100' | 'grey-50';
type Height = 60 | 48 | 40 | 32;

interface Props extends Omit<ButtonProps, 'color' | 'size'> {
	color?: Color;
	width?: number | 'auto';
	height?: Height;
	onClick?: () => void;
}

function Button({
	variant = 'contained',
	color = 'primary',
	width = 'auto',
	height = 40,
	sx,
	children,
	onClick,
	...props
}: Props) {
	const colorSx = useMemo(() => {
		const sx: SxProps = {
			...(variant === 'outlined' && {
				borderWidth: '1.5px',
			}),
		};
		switch (color) {
			// primary 기본 버튼 스타일 속성 사용
			case 'primary':
				return sx;
			case 'blue-50':
				sx.backgroundColor = 'primary.50';
				sx.color = 'primary.main';
				sx.borderColor = 'primary.main';
				return {
					...sx,
				};
			case 'black':
				sx.backgroundColor = 'black';
				sx.color = 'white';
				return {
					...sx,
					':hover': {
						backgroundColor: 'grey.800',
					},
				};
			case 'grey-100':
				sx.borderColor = 'grey.100';
				sx.backgroundColor = 'white';
				sx.color = 'black';
				return {
					...sx,
					':hover': {
						backgroundColor: 'grey.50',
						borderColor: 'grey.100',
					},
				};
			case 'grey-50':
				sx.backgroundColor = 'grey.50';
				sx.color = 'grey.300';
				return {
					...sx,
				};
		}
	}, [variant, color]);

	const sizeSx = useMemo(() => {
		const sx: SxProps = {
			fontWeight: style.bold,
			minHeight: `${height}px`,
			height: `${height}px`,
			width: typeof width === 'number' ? `${width}px` : width,
			...(width !== 'auto' && {
				padding: '0',
				minWidth: '0',
			}),
		};
		switch (height) {
			case 60:
				sx.paddingRight = '40px';
				sx.paddingLeft = '40px';
				sx.fontSize = '16px';
				sx.borderRadius = '6px';
				break;
			case 48:
				sx.paddingRight = '32px';
				sx.paddingLeft = '32px';
				sx.fontSize = '14px';
				sx.borderRadius = '4px';
				break;
			case 40:
				sx.paddingRight = '20px';
				sx.paddingLeft = '20px';
				sx.fontSize = '14px';
				sx.borderRadius = '4px';
				break;
			case 32:
				if (color === 'grey-100' && variant === 'outlined') {
					sx.fontWeight = style.medium;
				}
				sx.borderRadius = '4px';
				sx.fontSize = '13px';
				break;
		}
		return sx;
	}, [variant, color, width, height]);

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
			{children}
		</MuiButton>
	);
}

export default Button;
