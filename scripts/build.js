const gulp = require('gulp');
const buildEntry = require('./rollupBuild')
const builds = require('./config');
const buildDemoes = require('./config-demo');
console.log(buildDemoes);
gulp.task('copy',  function() {
  return gulp.src(['../src/font/**/*'])
    .pipe(gulp.dest('../dist/font'))
});

gulp.task('copy-html',  function() {
  return gulp.src(['../examples/**/*.html'])
    .pipe(gulp.dest('../dist/examples'))
});

gulp.task('build', function() {
	return buildEntry(builds);
});

gulp.task('build-demo', function() {
	return buildEntry(buildDemoes);
});

// 这里需要注意，rollup-plugin-vue有bug，他的mere option会修改deftopt，会导致多次配置的编译会被重复覆盖
gulp.task('default', gulp.parallel('copy', 'copy-html', 'build', 'build-demo', function all(cb) {
	cb();
}));

if (process.env.NODE_ENV === 'development') {
	gulp.watch(['../src/**/*'], gulp.parallel('copy', 'copy-html', 'build', function all(cb) {
		cb();
	}));
	gulp.watch(['../examples/**/*'], gulp.parallel('build-demo', function all(cb) {
		cb();
	}))
}


