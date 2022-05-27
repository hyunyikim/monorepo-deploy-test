import {ThemeProvider} from '@emotion/react';
import {DecoratorFn} from '@storybook/react';
import {INITIAL_VIEWPORTS} from '@storybook/addon-viewport';
import {defaultTheme} from '@vircle/styles';

export const decorators: DecoratorFn[] = [
	(Story) => (
		<ThemeProvider theme={defaultTheme}>
			<Story />
		</ThemeProvider>
	),
];

export const parameters = {
	viewport: {
		viewports: INITIAL_VIEWPORTS,
	},
	actions: {argTypesRegex: '^on[A-Z].*'},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	layout: 'fullscreen',
};
