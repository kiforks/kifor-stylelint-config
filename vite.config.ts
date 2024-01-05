import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		outDir: 'dist', // temporary folder
		minify: false,
		lib: {
			entry: './src/index.ts',
			name: 'kifor-stylelint-config',
			formats: ['es'],
			fileName: () => `.stylelintrc.js`,
		},
	},
});
