const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
	mode: 'development',
	devServer: {
		hot: true,
		historyApiFallback: true,
	},
	devtool: 'eval-source-map',
	plugins: [
		new ReactRefreshWebpackPlugin({
			overlay: false,
		}),
	],
};
