const path = require('path');
const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
	const mode = env.mode;
	console.log('env, argv :>> ', env, argv);

	const envMode = 'stage' === mode ? 'production' : mode;
	const envConfig = require(`./webpack.${envMode}`);

	const config = {
		entry: './src/App.tsx',
		output: {
			filename: '[name].js?v=[chunkhash]',
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/',
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'esbuild-loader',
					options: {
						loader: 'tsx',
						target: 'es2015',
					},
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.s[ac]ss$/i,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.svg$/,
					issuer: /\.[t]sx?$/,
					use: ['@svgr/webpack'],
				},
				{
					test: /\.(jpe?g|gif|png|ico)$/i,
					type: 'asset/inline',
				},
				{
					test: /\.(jpe?g|gif|png|ico)$/i,
					type: 'asset/resource',
				},
				{
					test: /\.(jpe?g|gif|png|ico)$/i,
					type: 'asset',
					parser: {
						dataUrlCondition: {
							maxSize: 10 * 1024, // 10kb
						},
					},
				},
			],
		},
		optimization: {
			splitChunks: {
				chunks: 'all',
				automaticNameDelimiter: '.',
			},
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.jsx', '.js'],
			// TODO: @도 없이, 아예 src 폴더가 루트가 되도록?
			alias: {
				'@': path.resolve(__dirname, 'src'),
			},
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: './src/index.html',
				filename: 'index.html',
			}),
			new CleanWebpackPlugin(),
			new Dotenv({
				path: `.env.${mode}`,
			}),
		],
	};
	return merge(config, envConfig);
};
