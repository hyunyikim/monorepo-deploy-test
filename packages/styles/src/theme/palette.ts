export type Color = string;

export const black: Color = '#000000';

export const white: Color = '#ffffff';

export interface ColorGrade {
	10: Color;
	50: Color;
	100: Color;
	200: Color;
	300: Color;
	400: Color;
	500: Color;
	600: Color;
	700: Color;
	800: Color;
	900: Color;
}

export interface SimpleColorGrade {
	50: Color;
	100: Color;
	400: Color;
	500: Color;
}

export const whiteAlpha: ColorGrade = {
	10: 'rgba(255, 255, 255, 0.01)',
	50: 'rgba(255, 255, 255, 0.04)',
	100: 'rgba(255, 255, 255, 0.06)',
	200: 'rgba(255, 255, 255, 0.08)',
	300: 'rgba(255, 255, 255, 0.16)',
	400: 'rgba(255, 255, 255, 0.24)',
	500: 'rgba(255, 255, 255, 0.36)',
	600: 'rgba(255, 255, 255, 0.48)',
	700: 'rgba(255, 255, 255, 0.64)',
	800: 'rgba(255, 255, 255, 0.80)',
	900: 'rgba(255, 255, 255, 0.92)',
};

export const blackAlpha: ColorGrade = {
	10: 'rgba(0, 0, 0, 0.01)',
	50: 'rgba(0, 0, 0, 0.04)',
	100: 'rgba(0, 0, 0, 0.06)',
	200: 'rgba(0, 0, 0, 0.08)',
	300: 'rgba(0, 0, 0, 0.16)',
	400: 'rgba(0, 0, 0, 0.24)',
	500: 'rgba(0, 0, 0, 0.36)',
	600: 'rgba(0, 0, 0, 0.48)',
	700: 'rgba(0, 0, 0, 0.64)',
	800: 'rgba(0, 0, 0, 0.80)',
	900: 'rgba(0, 0, 0, 0.92)',
};

export const gray: ColorGrade = {
	10: '#FCFCFC',
	50: '#F3F3F5',
	100: '#E2E2E9',
	200: '#CACAD3',
	300: '#AEAEBA',
	400: '#8E8E98',
	500: '#7B7B86',
	600: '#5C5C65',
	700: '#47474F',
	800: '#333339',
	900: '#222227',
};

export interface Gradient {
	primary: Color;
	secondary: Color;
	error: Color;
	dark: Color;
}

export const gradient: Gradient = {
	primary: 'linear-gradient(98.38deg, #5D9BF9 43.58%, #5C3EF6 104.42%)',
	secondary:
		'linear-gradient(102.53deg, #FFFFFF 0.86%, #5D97F9 39.5%, #5C40F6 90.55%)',
	error: 'linear-gradient(76.68deg, #FF8459 19.14%, #F8434E 76.14%)',
	dark: 'linear-gradient(0deg, #000000 60.04%, #222227 89.22%)',
};

export const blue: SimpleColorGrade = {
	50: '#EDF0FF',
	100: '#D6DCFF',
	400: '#98A8FF',
	500: '#526EFF',
};

export const red: SimpleColorGrade = {
	50: '#FFE3E5',
	100: '#FFC3C7',
	400: '#FFA5AA',
	500: '#F8434E',
};

export const green: SimpleColorGrade = {
	50: '#EDF9F7',
	100: '#DBF2EE',
	400: '#A6DFD5',
	500: '#00C29F',
};
