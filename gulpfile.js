const gulp = require('gulp');
const fs = require('fs');

require('ts-node').register();

gulp.task('prettify', function () {
	return import('gulp-prettier').then(prettierModule => {
		const prettier = prettierModule.default;
		return gulp.src('.stylelintrc.js').pipe(prettier({})).pipe(gulp.dest('.'));
	});
});

gulp.task('generate-stylelintrc', function (done) {
	delete require.cache[require.resolve('./src/index.ts')];
	const config = require('./src/index.ts');
	const configContent = `module.exports = ${JSON.stringify(config.CONFIG, null, 2)};`;
	fs.writeFileSync('.stylelintrc.js', configContent, 'utf8');
	done();
});

gulp.task('watch', function () {
	gulp.watch('src/**/*.ts', gulp.series('generate-stylelintrc', 'prettify'));
});

gulp.task('build', gulp.series('generate-stylelintrc', 'prettify'));
gulp.task('start', gulp.series('build', 'watch'));
