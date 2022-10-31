import style from '@/assets/styles/style.module.scss';
import {Components} from '@mui/material';

export default function component(): Components {
	return {
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
					border: `1px solid ${style.vircleGrey100}`,
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
				},
				input: {
					fontSize: '14px',
					'&:placeholder': {
						color: style.vircleGrey300,
					},
				},
			},
		},
	};
}
