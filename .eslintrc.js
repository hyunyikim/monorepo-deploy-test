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
	root: true,
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
			files: ['./packages/naver-store/**/*.ts?(x)'],
			//TODO: 각 프로젝트의 file로 빼고싶다.
			parser: '@typescript-eslint/parser',
			parserOptions: {
				project: path.resolve(
					__dirname + '/packages/naver-store/tsconfig.json'
				),
				sourceType: 'module',
			},
			plugins: ['@typescript-eslint/eslint-plugin', 'import'],
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:prettier/recommended',
				'plugin:import/typescript',
				'plugin:import/recommended',
			],
			env: {
				node: true,
				jest: true,
			},
			settings: {
				'import/parsers': {'@typescript-eslint/parser': ['.ts']},
				'import/resolver': {
					typescript: {
						alwaysTryTypes: true,
						project: path.resolve(
							__dirname + '/packages/naver-store/tsconfig.json'
						),
					},
				},
			},
			rules: {
				'import/order': [
					'warn',
					{
						groups: [
							['builtin', 'external'],
							'internal',
							['parent', 'sibling'],
							'index',
						],
						pathGroups: [],
						alphabetize: {
							caseInsensitive: true,
						},
						'newlines-between': 'always',
					},
				],
			},
		},
		{
			files: ['**/*.ts?(x)'],
			parser: '@typescript-eslint/parser',
			extends: [
				'plugin:@typescript-eslint/recommended',
				'plugin:@typescript-eslint/recommended-requiring-type-checking',
			],
			rules: {
				'@typescript-eslint/require-await': 'off',
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
				// 'packages/ui-component/**/*.js?(x)',
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
				// 'packages/admin-web/**/*.js?(x)',
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
				// 'packages/cafe24-interwork/**/*.js?(x)',
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
		{
			files: [
				'packages/payment/**/*.ts?(x)',
				//'packages/payment/**/*.js?(x)',
			],
			rules: {
				'@typescript-eslint/no-unsafe-member-access': 'warn',
				'@typescript-eslint/no-unsafe-call': 'warn',
				'@typescript-eslint/no-unsafe-assignment': 'warn',
				'@typescript-eslint/no-unsafe-return': 'warn',
			},
			settings: {
				'import/resolver': {
					node: {
						project: path.resolve(
							__dirname + '/packages/payment/tsconfig.json'
						),
					},
				},
			},
		},
		{
			files: ['packages/partners-web/**/*.ts?(x)'],
			rules: {
				'@typescript-eslint/no-misused-promises': [
					'warn',
					{
						checksVoidReturn: false,
					},
				],
				'@typescript-eslint/no-empty-interface': 'warn',
				'@typescript-eslint/no-unsafe-assignment': 'warn',
				'@typescript-eslint/no-unsafe-member-access': 'warn',
				'@typescript-eslint/require-await': 'warn',
				'@typescript-eslint/no-unsafe-return': 'warn',
				'@typescript-eslint/no-unsafe-call': 'warn',
				'@typescript-eslint/no-unsafe-argument': 'warn',
				'@typescript-eslint/restrict-plus-operands': 'warn',
			},
			settings: {
				'import/resolver': {
					node: {
						project: path.resolve(
							__dirname + '/packages/partners-web/tsconfig.json'
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
