import {ThemeProvider} from '@emotion/react';
import {DecoratorFn} from '@storybook/react';

import {defaultTheme} from '@vircle/styles';

export const decorators: DecoratorFn[] = [
	(Story) => (
		<ThemeProvider theme={defaultTheme}>
			<Story />
		</ThemeProvider>
	),
];

export const parameters = {
	actions: {argTypesRegex: '^on[A-Z].*'},
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
	layout: 'fullscreen',
};
