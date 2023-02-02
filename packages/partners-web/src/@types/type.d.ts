declare module '*.css';
declare module '*.module.scss' {
	const styles: {[className: string]: string};
	export default styles;
}

declare module '*.scss';

declare module '*.jpg' {
	const src: string;
	export default src;
}
declare module '*.jpeg' {
	const src: string;
	export default src;
}
declare module '*.svg' {
	const ReactComponent: React.FunctionComponent<
		React.SVGProps<SVGSVGElement>
	>;
	export default ReactComponent;
}
declare module '*.png' {
	const src: string;
	export default src;
}

declare global {
	declare module '@mui/material' {
		interface Color {
			10?: string;
		}
		interface Palette {
			red: PaletteColor;
			green: PaletteColor;
		}
		interface PaletteOptions {
			red: PaletteColor;
			green: PaletteColor;
		}
		interface PaletteColor {
			100?: string;
		}
	}

	declare module '@mui/material/styles' {
		interface TypographyVariants {
			header0: React.CSSProperties;
			header1: React.CSSProperties;
			header2: React.CSSProperties;
			body3: React.CSSProperties;
			caption1: React.CSSProperties;
			caption2: React.CSSProperties;
			caption3: React.CSSProperties;
			caption4: React.CSSProperties;
			button1: React.CSSProperties;
			button2: React.CSSProperties;
			button3: React.CSSProperties;
		}

		interface TypographyVariantsOptions {
			header0?: React.CSSProperties;
			header1?: React.CSSProperties;
			header2?: React.CSSProperties;
			body3?: React.CSSProperties;
			caption1?: React.CSSProperties;
			caption2?: React.CSSProperties;
			caption3?: React.CSSProperties;
			caption4?: React.CSSProperties;
			button1?: React.CSSProperties;
			button2?: React.CSSProperties;
			button3?: React.CSSProperties;
		}
	}

	declare module '@mui/material/Typography' {
		interface TypographyPropsVariantOverrides {
			header0: true;
			header1: true;
			header2: true;
			body3: true;
			caption1: true;
			caption2: true;
			caption3: true;
			caption4: true;
			button1: true;
			button2: true;
			button3: true;
		}
	}
}
