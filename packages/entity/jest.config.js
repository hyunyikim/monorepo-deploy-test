console.log('Jest Config load');

module.exports = {
	maxWorkers: 1,
	preset: 'ts-jest',
	testMatch: ['**/*.spec.[jt]s?(x)', '**/*.test.[jt]s?(x)'],
	testEnvironment: 'node',
};
