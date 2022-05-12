console.log('Jest Config load');

module.exports = {
	preset: 'ts-jest',
	testMatch: ['**/*.spec.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
	testEnvironment: 'js-dom',
};
