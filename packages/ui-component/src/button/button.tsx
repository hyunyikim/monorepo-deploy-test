import {
	ButtonHTMLAttributes,
	forwardRef,
	MouseEventHandler,
	useMemo,
} from 'react';

import {css, useTheme} from '@emotion/react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
	type?: 'button' | 'reset' | 'submit';
	variant?: 'contained' | 'outlined' | 'text';
	color?: 'primary' | 'secondary' | 'error' | 'dark' | 'white';
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
	text?: string;
	testId?: string;
};

const buttonStyle = css`
	color: inherit;
	cursor: pointer;
	border: none;
	outline: none;
	background: none;
	&:disabled {
		cursor: default;
	}
`;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			type = 'button',
			variant = 'contained',
			color = 'primary',
			onClick,
			text,
			disabled = false,
			testId,
			children,
			...props
		},
		ref
	) => {
		const theme = useTheme();

		const colors = useMemo(
			() => ({
				primary: theme.color.gradient.primary,
				secondary: theme.color.gradient.secondary,
				error: theme.color.gradient.secondary,
				dark: theme.color.gradient.dark,
				white: theme.color.white,
			}),
			[theme]
		);

		const baseStyle = useMemo(
			() => css`
				border-radius: ${theme.radius.base};
				letter-spacing: ${theme.typo.letterSpacing.tight};
				transition: 200ms opacity;
				&:hover {
					opacity: 0.8;
				}
				&:active {
					opacity: 0.6;
				}
			`,
			[theme]
		);

		const containedStyle = useMemo(
			() => css`
				color: ${theme.color.white};
				background-color: ${colors[color]};
			`,
			[theme, colors, color]
		);

		const invertedStyle = useMemo(
			() => css`
				color: ${colors[color]};
				border: ${variant === 'text' ? 0 : 1}px solid currentColor;
				background-color: ${theme.color.white};
				&:disabled {
					color: ${theme.color.gray[500]};
				}
			`,
			[theme, colors, color, variant]
		);

		const invertedPadding = css`
			padding: 7px 9px;
		`;

		return (
			<button
				ref={ref}
				type={type}
				className={className}
				onClick={onClick}
				disabled={disabled}
				css={[
					buttonStyle,
					baseStyle,
					variant === 'contained' ? containedStyle : invertedStyle,
					variant === 'outlined' && invertedPadding,
				]}
				data-testid={testId}
				{...props}>
				{children ?? text}
			</button>
		);
	}
);

export default Button;
