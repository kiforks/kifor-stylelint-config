const gulp = require('gulp');
const fs = require('fs');
const tsNode = require('ts-node');

gulp.task('generate-stylelintrc', function (done) {
	tsNode.register();

	delete require.cache[require.resolve('./src/index.ts')];

	const configModule = require('./src/index.ts');
	const configContent = `module.exports = ${JSON.stringify(configModule.CONFIG, null, 2)};`;

	fs.writeFileSync('.stylelintrc.js', configContent, 'utf-8');

	done();
});


gulp.task('watch', function () {
	gulp.watch('src/**/*.ts', gulp.series('build'));
});

gulp.task('build', gulp.series('generate-stylelintrc'));
gulp.task('start', gulp.series('build', 'watch'));
