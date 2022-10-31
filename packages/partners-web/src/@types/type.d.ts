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
		interface PaletteOptions {
			red: PaletteColor;
			green: PaletteColor;
		}
	}
}
