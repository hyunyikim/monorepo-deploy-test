module.exports = {
	core: {
		builder: 'webpack5',
	},
	stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
	addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
	framework: '@storybook/react',
	typescript: {
		check: true,
	},

	webpackFinal: async (config) => {
		config.module.rules.push({
			test: /\.(ts|tsx)$/,
			loader: require.resolve('ts-loader'),
		});
		return config;
	},
};
