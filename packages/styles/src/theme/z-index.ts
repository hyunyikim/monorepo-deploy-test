export interface ZIndex {
	hide: number;
	auto: 'auto';
	base: number;
	docked: number;
	dropdown: number;
	sticky: number;
	banner: number;
	overlay: number;
	modal: number;
	popover: number;
	skipLink: number;
	toast: number;
	tooltip: number;
}

export const zIndex: ZIndex = {
	hide: -1,
	auto: 'auto',
	base: 0,
	docked: 10,
	dropdown: 1000,
	sticky: 1100,
	banner: 1200,
	overlay: 1300,
	modal: 1400,
	popover: 1500,
	skipLink: 1600,
	toast: 1700,
	tooltip: 1800,
};
