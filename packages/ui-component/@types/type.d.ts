import {Theme as ITheme} from '@vircle/styles';

declare module '@emotion/react' {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	export interface Theme extends ITheme {}
}
