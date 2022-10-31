import style from '@/assets/styles/style.module.scss';

export default function themeTypography() {
	return {
		allVariants: {
			color: style.vircleBlack,
			fontWeight: style.medium as 'medium',
		},
		fontWeightBold: 700,
		fontWeightMedium: 500,
	};
}
