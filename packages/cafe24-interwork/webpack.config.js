const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

const lazyImports = [
	'@nestjs/microservices/microservices-module',
	'@nestjs/websockets/socket-module',
	'class-transformer/storage',
];

module.exports = {
	target: 'node',
	mode: 'production',
	externals: [nodeExternals()], // removes node_modules from your final bundle
	entry: './dist/main.js', // make sure this matches the main root of your code
	output: {
		path: path.join(__dirname, 'bundle'), // this can be any path and directory you want
		filename: `main.js`,
	},
	optimization: {
		minimize: false, // enabling this reduces file size and readability
	},
	plugins: [
		new webpack.IgnorePlugin({
			resourceRegExp: /^pg-native$/,
		}),
		// new webpack.IgnorePlugin({
		//   resourceRegExp: /^aws-sdk$/,
		// }),
		// new webpack.IgnorePlugin({
		//   resourceRegExp: /^aws-lambda$/,
		// }),
		new webpack.IgnorePlugin({
			checkResource(resource) {
				if (lazyImports.includes(resource)) {
					try {
						require.resolve(resource);
					} catch (err) {
						return true;
					}
				}
				return false;
			},
		}),
	],
};
