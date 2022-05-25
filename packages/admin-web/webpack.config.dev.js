const path = require('path');
const config = require('./webpack.config');

config.devServer = {
	static: {
		directory: path.join(__dirname, 'assets'),
	},
	port: 3003,
	hot: true,
	open: true,
};

module.exports = config;
