const path = require('path');

module.exports = {
	extends: ['prettier'],
	parser: '@typescript-eslint/parser',
	plugins: ['prettier', 'react-hooks', 'jest', '@typescript-eslint'],
	env: {
		browser: true,
		jest: true,
		es6: true,
		node: true,
	},
	rules: {
		'prettier/prettier': 'warn',
		'react-hooks/rules-of-hooks': 'error',
		'react-hooks/exhaustive-deps': 'warn',
		'react/react-in-jsx-scope': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/function-component-definition': 'off',
	},
	overrides: [
		{
			files: ['**/*.ts?(x)'],
			parser: '@typescript-eslint/parser',
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],
			rules: {
				'@typescript-eslint/no-unused-vars': ['warn'],
				'react/prop-types': 'off',
				'react/require-default-props': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'no-use-before-define': 'off',
				'no-useless-constructor': 'off',
				'@typescript-eslint/no-useless-constructor': 'error',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
				'@typescript-eslint/interface-name-prefix': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/no-explicit-any': 'off',
			},
			parserOptions: {
				project: ['./tsconfig.json', './packages/**/tsconfig.json'],
			},
		},

		{
			files: [
				'packages/ui-component/**/*.ts?(x)',
				'packages/ui-component/**/*.js?(x)',
			],
			settings: {
				'import/resolver': {
					node: {
						project: path.resolve(
							__dirname + '/packages/ui-component/tsconfig.json'
						),
					},
				},
			},
		},

		{
			files: [
				'packages/admin-web/**/*.ts?(x)',
				'packages/admin-web/**/*.js?(x)',
			],
			settings: {
				'import/resolver': {
					node: {
						project: path.resolve(
							__dirname + '/packages/admin-web/tsconfig.json'
						),
					},
				},
			},
		},

		{
			files: [
				'packages/cafe24-interwork/**/*.ts?(x)',
				'packages/cafe24-interwork/**/*.js?(x)',
			],
			settings: {
				'import/resolver': {
					node: {
						project: path.resolve(
							__dirname +
								'/packages/cafe24-interwork/tsconfig.json'
						),
					},
				},
			},
		},
	],
	settings: {
		'import/extensions': ['.js', '.jsx', '.ts', '.tsx', 'spec.js'],
		'import/parsers': {
			'@typescript-eslint/parser': [
				'.ts',
				'.tsx',
				'.d.ts',
				'.js',
				'.jsx',
			],
		},
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
			typescript: {
				alwaysTryTypes: true,
			},
		},
	},
	env: {
		browser: true,
		es6: true,
		'jest/globals': true,
	},
};
