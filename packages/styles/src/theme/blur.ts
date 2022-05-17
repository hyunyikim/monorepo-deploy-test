export interface Blur {
	none: 0;
	xs: string;
	sm: string; // small
	base: string;
	md: string; // medium
	lg: string; // large
	xl: string; // extra large
	'2xl': string;
	'3xl': string;
}

export const blur: Blur = {
	none: 0,
	xs: '2px',
	sm: '4px',
	base: '8px',
	md: '12px',
	lg: '16px',
	xl: '24px',
	'2xl': '40px',
	'3xl': '64px',
};
