import {PaletteOptions} from '@mui/material';

import palette from '@/assets/styles/style.module.scss';

export default function themePalette(): PaletteOptions {
	return {
		primary: {
			main: palette.vircleBlue500,
			400: palette.vircleBlue400,
			200: palette.vircleBlue200,
			100: palette.vircleBlue100,
			50: palette.vircleBlue50,
		},
		red: {
			main: palette.vircleRed500,
			400: palette.vircleRed400,
			100: palette.vircleRed100,
			50: palette.vircleRed50,
		},
		green: {
			main: palette.vircleGreen500,
			400: palette.vircleGreen400,
			100: palette.vircleGreen100,
			50: palette.vircleGreen50,
		},
		grey: {
			800: palette.vircleGrey800,
			700: palette.vircleGrey700,
			600: palette.vircleGrey600,
			500: palette.vircleGrey500,
			400: palette.vircleGrey400,
			300: palette.vircleGrey300,
			200: palette.vircleGrey200,
			100: palette.vircleGrey100,
			50: palette.vircleGrey50,
			10: palette.vircleGrey10,
		},
		common: {
			black: palette.vircleBlack,
			white: palette.vircleWhite,
		},
		error: {
			main: palette.vircleRed500,
		},
	};
}
