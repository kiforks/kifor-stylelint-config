/** @type {import('jest').Config} */
module.exports = {
	preset: 'jest-preset-stylelint',
	transform: {
		'^.+\\.ts$': 'ts-jest',
		'^.+\\.js$': 'babel-jest',
	},
	testMatch: ['**/*.spec.ts', '**/*.spec.js'],
	moduleFileExtensions: ['ts', 'js', 'json'],
};
