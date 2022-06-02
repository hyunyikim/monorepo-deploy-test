module.exports = {
	maxWorkers: 1,
	preset: 'ts-jest',
	testMatch: ['**/*.spec.ts?(x)', '**/*.test.ts?(x)'],
	testEnvironment: 'node',
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: -10,
		},
	},
	coveragePathIgnorePatterns: ['./test/'],
};
