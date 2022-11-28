import {useMemo} from 'react';

import {Button as MuiButton, ButtonProps, SxProps} from '@mui/material';

import style from '@/assets/styles/style.module.scss';

type Color =
	| 'primary'
	| 'blue-50'
	| 'black'
	| 'grey-100'
	| 'grey-50'
	| 'gradient';
type Height = 60 | 48 | 40 | 32;

interface Props extends Omit<ButtonProps, 'color' | 'size'> {
	color?: Color;
	width?: number | string;
	height?: Height;
	onClick?: () => void;
}
/**
 *
 * width가 숫자인 경우, 너비가 고정되어 있는 fixed 버튼
 */
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
		switch (color) {
			case 'blue-50':
				return {
					backgroundColor: 'primary.50',
					color: 'primary.main',
					borderColor: 'primary.main',
					':hover': {
						backgroundColor: 'primary.100',
						boxShadow: 'none',
					},
				};
			case 'black':
				if (variant === 'outlined') {
					return {
						backgroundColor: 'white',
						borderColor: 'grey.100',
						color: 'grey.900',
						':hover': {
							borderColor: 'grey.100',
							backgroundColor: 'grey.50',
						},
					};
				} else {
					return {
						backgroundColor: 'black',
						color: 'white',
						':hover': {
							backgroundColor: 'grey.800',
						},
					};
				}
			case 'grey-100':
				return {
					borderColor: 'grey.100',
					backgroundColor: 'white',
					color: 'black',
					':hover': {
						backgroundColor: 'grey.50',
						borderColor: 'grey.100',
					},
				};
			case 'grey-50':
				return {
					backgroundColor: 'grey.50',
					color: 'grey.300',
				};
			case 'gradient':
				return {
					background:
						'linear-gradient(98.38deg, #5D9BF9 43.58%, #5C3EF6 104.42%)',
					color: 'white',
				};
			// primary 기본 버튼 스타일 속성 사용
			case 'primary':
			default:
				return {};
		}
	}, [variant, color]);

	const sizeSx = useMemo(() => {
		const sx: SxProps = {
			fontWeight: style.bold,
			minHeight: `${height}px`,
			height: `${height}px`,
			lineHeight: `${height}px`,
			width: typeof width === 'number' ? `${width}px` : width,
			...(width !== 'auto' && {
				padding: '0',
				minWidth: '0',
			}),
			...(variant === 'outlined' && {
				// height 48 버튼부터
				borderWidth: height > 40 ? '1.5px' : '1px',
				'&:hover': {
					borderWidth: height > 40 ? '1.5px' : '1px',
				},
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
				// fixed 버튼만
				if (
					color === 'grey-100' &&
					variant === 'outlined' &&
					typeof width === 'number'
				) {
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
