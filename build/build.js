const gulp = require('gulp');
const buildEntry = require('./rollupBuild')
const builds = require('./config');
const buildDemoes = require('./config-demo');

const build = function (cfg) {
	return Promise.all(cfg.map(buildCfg => {
		return buildEntry(buildCfg)
	}));
};
gulp.task('copy',  function() {
  return gulp.src(['../src/font/**/*'])
    .pipe(gulp.dest('../dist/font'))
});

gulp.task('copy-html',  function() {
  return gulp.src(['../src/examples/**/*.html'])
    .pipe(gulp.dest('../dist/examples'))
});

gulp.task('build-mobile',  function() {
	return build(builds.getMobile());
});

gulp.task('build-desktop', function () {
	return build(builds.getDesktop());
});

gulp.task('build-mobile-demo', function () {
	return build(buildDemoes.getMobile());
});

gulp.task('build-desktop-demo', function () {
	return build(buildDemoes.getDesktop());
})
// 这里需要注意，rollup-plugin-vue有bug，他的mere option会修改deftopt，会导致多次配置的编译会被重复覆盖
gulp.task('default', ['copy', 'copy-html', 'build-mobile', 'build-desktop', 'build-desktop-demo', 'build-mobile-demo'])

if (process.env.NODE_ENV === 'develop') {
	gulp.watch(['../src/**/*'], ['build-mobile', 'build-desktop', 'build-mobile-demo', 'build-desktop-demo']);
}


