export interface FontSize {
	xs: string;
	sm: string;
	md: string;
	lg: string;
	xl: string;
	'2xl': string;
	'3xl': string;
	'4xl': string;
	'5xl': string;
	'6xl': string;
	'7xl': string;
	'8xl': string;
	'9xl': string;
}

export const fontSize: FontSize = {
	xs: '0.75rem',
	sm: '0.875rem',
	md: '1rem',
	lg: '1.125rem',
	xl: '1.25rem',
	'2xl': '1.5rem',
	'3xl': '1.875rem',
	'4xl': '2.25rem',
	'5xl': '3rem',
	'6xl': '3.75rem',
	'7xl': '4.5rem',
	'8xl': '6rem',
	'9xl': '8rem',
};

export interface LetterSpacing {
	tighter: string;
	tight: string;
	normal: string;
	wide: string;
	wider: string;
	widest: string;
}

export const letterSpacing: LetterSpacing = {
	tighter: '-0.05em',
	tight: '-0.025em',
	normal: '0',
	wide: '0.025em',
	wider: '0.05em',
	widest: '0.1em',
};

export interface LineHeight {
	normal: number | string;
	none: number | string;
	shorter: number | string;
	short: number | string;
	base: number | string;
	tall: number | string;
	taller: number | string;
}

export const lineHeight: LineHeight = {
	normal: 'normal',
	none: 1,
	shorter: 1.25,
	short: 1.375,
	base: 1.5,
	tall: 1.625,
	taller: 2,
};

export interface FontFamily {
	heading: string;
	body: string;
	mono: string;
}

export const fontFamily: FontFamily = {
	heading: `Metropolis, SUIT, sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto ,Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue"`,
	body: `Metropolis, SUIT, sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto ,Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue"`,
	mono: `Metropolis, SUIT, sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto ,Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue"`,
};

export interface FontWeight {
	hairline: number;
	thin: number;
	light: number;
	normal: number;
	medium: number;
	semibold: number;
	bold: number;
	extrabold: number;
	black: number;
}

export const fontWeight: FontWeight = {
	hairline: 100,
	thin: 200,
	light: 300,
	normal: 400,
	medium: 500,
	semibold: 600,
	bold: 700,
	extrabold: 800,
	black: 900,
};
