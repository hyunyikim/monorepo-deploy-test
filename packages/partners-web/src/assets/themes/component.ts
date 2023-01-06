import style from '@/assets/styles/style.module.scss';
import {Components} from '@mui/material';

export default function component(): Components {
	return {
		MuiTypography: {
			defaultProps: {
				variantMapping: {
					header0: 'h1',
					header1: 'h1',
					header2: 'h2',
					subtitle1: 'h3',
					subtitle2: 'h4',
					body1: 'p',
					body2: 'p',
					body3: 'p',
					caption1: 'span',
					caption2: 'span',
					caption3: 'span',
					caption4: 'span',
				},
			},
			styleOverrides: {
				root: {
					lineHeight: 1.45,
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					fontSize: '14px',
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
					'&.Mui-disabled': {
						backgroundColor: style.vircleGrey50,
						color: style.vircleGrey300,
					},
				},
			},
		},
		MuiSelect: {
			styleOverrides: {
				standard: {
					fontSize: '14px',
				},
			},
		},
		MuiInputBase: {
			styleOverrides: {
				root: {
					backgroundColor: style.vircleWhite,
					// focused border style
					'&.MuiInputBase-root.Mui-focused fieldset': {
						borderWidth: '1px',
						borderColor: style.vircleBlack,
					},
					'& fieldset': {
						borderColor: style.vircleGrey100,
					},
				},
				input: {
					fontSize: '14px',
					'&:placeholder': {
						color: style.vircleGrey300,
					},
				},
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					backgroundColor: 'rgba(0, 0, 0, 0.6)',
					padding: 0,
					marginTop: '0px !important',
				},
				popper: {
					zIndex: 1000,
					marginTop: '8px !important',
				},
			},
		},
	};
}
