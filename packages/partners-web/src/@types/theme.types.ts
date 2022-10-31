export interface ThemeConfig {
	fontFamily: string;
	borderRadius: number;
	outlinedFilled: boolean;
	theme: 'light' | 'dark';
	presetColor: 'theme5'; // default, theme1, theme2, theme3, theme4, theme5, theme6
	rtlLayout: boolean;
}

export interface ThemeOption {
	colors: {
		[className: string]: string;
	};
	heading: string;
	paper: string;
	backgroundDefault: string;
	background: string;
	darkTextPrimary: string;
	darkTextSecondary: string;
	textDark: string;
	menuSelected: string;
	menuSelectedBack: string;
	divider: string;
	customization: ThemeConfig;
}
