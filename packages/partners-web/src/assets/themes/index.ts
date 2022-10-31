import {createTheme, Theme} from '@mui/material';

import themePalette from '@/assets/themes/palette';
import themeTypography from '@/assets/themes/typography';
import themeComponent from '@/assets/themes/component';

export function getTheme(): Theme {
	return createTheme({
		palette: themePalette(),
		breakpoints: {
			values: {
				xs: 0,
				sm: 600,
				md: 960,
				lg: 1280,
				xl: 1920,
			},
		},
		typography: themeTypography(),
		components: themeComponent(),
	});
}

export default getTheme;
