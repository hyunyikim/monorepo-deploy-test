/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {create} from '@storybook/theming';

const logo =
	'data:image/png;base64,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';

const theme = create({
	base: 'light',
	brandTitle: 'Vircle',
	brandUrl: 'https://mass-adoption.com',
	brandImage: logo,
	brandTarget: '_self',

	colorPrimary: 'black',
	colorSecondary: 'deepskyblue',

	// UI
	appBg: 'white',
	appContentBg: 'rgba(200,200,200,0.5)',
	appBorderColor: 'black',
	appBorderRadius: 4,

	// Typography
	fontBase: '"Open Sans", sans-serif',
	fontCode: 'monospace',

	// Text colors
	textColor: 'black',
	textInverseColor: 'rgba(255,255,255,0.9)',

	// Toolbar default and active colors
	barTextColor: 'black',
	barSelectedColor: 'black',
	barBg: 'white',

	// Form colors
	inputBg: 'white',
	inputBorder: 'black',
	inputTextColor: 'black',
	inputBorderRadius: 4,
});

export default theme;
