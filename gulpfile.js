const gulp = require('gulp');
const fs = require('fs');
const tsNode = require('ts-node');
const prettier = require('gulp-prettier');

gulp.task('prettify', function () {
	return gulp.src('.stylelintrc.js')
		.pipe(prettier({ /* ваші налаштування prettier, якщо вони відмінні від конфігураційного файлу */ }))
		.pipe(gulp.dest('.'));
});

gulp.task('generate-stylelintrc', gulp.series(function (done) {
	tsNode.register();

	// Видалити кешовану версію модуля
	delete require.cache[require.resolve('./src/index.ts')];

	const configModule = require('./src/index.ts');
	const configContent = `module.exports = ${JSON.stringify(configModule.CONFIG, null, 2)};`;

	fs.writeFileSync('.stylelintrc.js', configContent, 'utf-8');

	done();
}, 'prettify'));

gulp.task('watch', function () {
	gulp.watch('src/**/*.ts', gulp.series('build'));
});

gulp.task('build', gulp.series('generate-stylelintrc'));
gulp.task('start', gulp.series('build', 'watch'));
