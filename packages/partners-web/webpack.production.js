const {ESBuildMinifyPlugin} = require('esbuild-loader');
const MiniCssExtractionPlugin = require('mini-css-extract-plugin');

module.exports = {
	mode: 'production',
	devtool: 'source-map',
	output: {
		publicPath: './',
	},
	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [MiniCssExtractionPlugin.loader, 'css-loader'],
			},
		],
	},
	optimization: {
		minimizer: [
			new ESBuildMinifyPlugin({
				target: 'es2015',
				css: true,
			}),
		],
	},
	plugins: [new MiniCssExtractionPlugin()],
};
