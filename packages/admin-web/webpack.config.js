const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/main.tsx',
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'esbuild-loader',
				options: {
					loader: 'tsx', // Or 'ts' if you don't need tsx
					target: 'es2015',
				},
			},
			{
				test: /\.(jpg|jpeg|gif|png|svg|ico)$/,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name].[hash][ext]',
				},
			},
			{
				test: /\.css/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/',
		filename: 'bundle.[name].js?v=[chunkhash]',
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: 'vircle 관리자 어플리케이션',
			meta: {
				viewport:
					'width=device-width, initial-scale=1, shrink-to-fit=no',
			},
			template: './assets/index.html',
			filename: './index.html',
			favicon: `./assets/favicon.png`,
			hash: true,
		}),
	],
};
