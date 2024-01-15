/** @type {import('jest').Config} */
export default {
	preset: 'jest-preset-stylelint',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	testMatch: ['**/*.spec.ts', '**/*.spec.js'],
	moduleFileExtensions: ['ts', 'js', 'json'],
};
