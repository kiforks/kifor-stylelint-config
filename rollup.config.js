import typescript from '@rollup/plugin-typescript';

export default {
	input: 'src/index.ts',
	output: {
		file: './.stylelintrc.js',
		format: 'es',
		sourcemap: false,
	},
	plugins: [typescript()],
	external: ['stylelint'],
};
