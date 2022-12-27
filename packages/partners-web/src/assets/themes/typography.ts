import {TypographyOptions} from '@mui/material/styles/createTypography';

import style from '@/assets/styles/style.module.scss';

export default function themeTypography(): TypographyOptions {
	return {
		allVariants: {
			color: style.vircleBlack,
			fontWeight: style.medium as 'medium',
		},
		fontWeightBold: 700,
		fontWeightMedium: 500,
		fontFamily: [
			'Metropolis',
			'SUIT',
			'sans-serif',
			'-apple-system',
			'BlinkMacSystemFont',
			'Segoe UI',
			'Roboto',
			'Oxygen',
			'Ubuntu',
			'Cantarell',
			'Fira Sans',
			'Droid Sans',
			'Helvetica Neue',
			'Noto Sans',
		].join(','),
		header0: {
			fontSize: 36,
			fontWeight: style.fontWeightBold,
		},
		header1: {
			fontSize: 28,
			fontWeight: style.fontWeightBold,
		},
		header2: {
			fontSize: 24,
			fontWeight: style.fontWeightBold,
		},
		subtitle1: {
			fontSize: 21,
			fontWeight: style.fontWeightBold,
		},
		subtitle2: {
			fontSize: 18,
			fontWeight: style.fontWeightBold,
		},
		body1: {
			fontSize: 16,
		},
		body2: {
			fontSize: 15,
		},
		body3: {
			fontSize: 14,
		},
		caption1: {
			fontSize: 13,
		},
		caption2: {
			fontSize: 12,
		},
		caption3: {
			fontSize: 11,
		},
		caption4: {
			fontSize: 9,
		},
		button1: {
			fontSize: 16,
			fontWeight: style.fontWeightBold,
		},
		button2: {
			fontSize: 14,
			fontWeight: style.fontWeightBold,
		},
		button3: {
			fontSize: 13,
			fontWeight: style.fontWeightBold,
		},
	};
}
