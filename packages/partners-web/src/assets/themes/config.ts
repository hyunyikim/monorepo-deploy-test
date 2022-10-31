import {ThemeConfig} from '@/@types';

const config: ThemeConfig = {
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
	].join(','),
	borderRadius: 8,
	outlinedFilled: false,
	theme: 'light', // light, dark
	presetColor: 'theme5', // default, theme1, theme2, theme3, theme4, theme5, theme6
	rtlLayout: false,
};

export default config;
