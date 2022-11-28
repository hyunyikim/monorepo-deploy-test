import style from '@/assets/styles/style.module.scss';
import {Components} from '@mui/material';

export default function component(): Components {
	return {
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
					marginTop: '8px !important',
				},
				popper: {
					zIndex: 1000,
				},
			},
		},
	};
}
