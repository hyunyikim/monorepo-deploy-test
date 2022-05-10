const path = require('path');

module.exports = {
	extends: ['prettier'],
	plugins: ['prettier', 'react-hooks'],
	env: {
		browser: true,
		jest: true,
		es6: true,
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
				'@typescript-eslint/no-use-before-define': [
					'error',
					{variables: false},
				],
				'no-useless-constructor': 'off',
				'@typescript-eslint/no-useless-constructor': 'error',
				'@typescript-eslint/no-floating-promises': 'off',
				'@typescript-eslint/no-use-before-define': 'off',
			},
			parserOptions: {
				project: [
					'./tsconfig.base.json',
					'./packages/**/tsconfig.json',
				],
			},
		},
		{
			files: [
				'packages/testmono/**/*.ts?(x)',
				'packages/testmono/**/*.js?(x)',
			],
			settings: {
				'import/resolver': {
					node: {
						project: path.resolve(
							__dirname + '/packages/testmono/tsconfig.json'
						),
					},
				},
			},
		},
	],
};
