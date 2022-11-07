import style from '@/assets/styles/style.module.scss';

export default function themeTypography() {
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
	};
}
