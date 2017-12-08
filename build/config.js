
// Rollup plugins
// const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
// rollup.config.js
const multidest = require('rollup-plugin-multi-dest');
const less = require('less');
const path = require('path');
// PostCSS plugins
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const version = process.env.VERSION || require('../package.json').version
const uglify = require('rollup-plugin-uglify');
const banner =
  '/*!\n' +
  ' * dialog.js v' + version + '\n' +
  ' * (c) 2014-' + new Date().getFullYear() + ' jianxcao\n' +
  ' * Released under the MIT License.\n' +
	' */'

const basePath = path.resolve(__dirname, '../');
const distBasePath = path.resolve(basePath, 'dist');

const getCssPlugin = function (type) {
		return postcss({
				preprocessor: function (code, id) {
						return new Promise(function (resolve, reject) {
								return less
										.render(code, {})
										.then(function (output) {
												resolve({code: output.css, id});
										}, function (error) {
												reject(error);
												throw error;
										});
						});
				},
				plugins: [
						cssnext({warnForDuplicates: false}),
						cssnano()
				],
				extract: `${distBasePath}/${type}/dialog.css`,
				extensions: ['.css', '.less']
		})
};

function getBuild (type) {
	const plugins = [];
	if (process.env.NODE_ENV !== 'develop') {
		plugins.push(
			multidest([
				{
						entry: `${basePath}/src/${type}/dialog.js`,
						dest: `${distBasePath}/${type}/dialog.common.js`,
						format: 'cjs'
				}, {
						entry: `${basePath}/src/${type}/dialog.js`,
						dest: `${distBasePath}/${type}/dialog.esm.js`,
						format: 'es'
				}, {
						entry: `${basePath}/src/${type}/global.js`,
						dest: `${distBasePath}/${type}/dialog.min.js`,
						format: 'umd',
						plugins: [
							uglify()
						]
				}
			])
		);
	}
	const build = {
		'es': {
			entry: `${basePath}/src/${type}/global.js`,
			dest: `${distBasePath}/${type}/dialog.js`,
			format: 'umd',
			banner,
			external: [
				'vue'
			],
			paths: {
				vue: 'vue'
			},
			globals: {
				vue: 'Vue'
			},
			plugins,
			cssPlugin: getCssPlugin(type)
		}
	}
	return build;
}


function genConfig (opts) {
  const config = {
    entry: opts.entry,
    dest: opts.dest,
		external: opts.external,
		paths: opts.paths,
    format: opts.format,
		banner: opts.banner,
		moduleName: opts.moduleName || 'dialog',
		globals: opts.globals,
		sourceMap: process.env.NODE_ENV === 'develop',
    plugins: [
			opts.cssPlugin,
			resolve({jsnext: true, main: true, browser: true}),
			commonjs(),
			buble({
				transforms: {
					dangerousForOf: true
				}
			}),
			// babel({
			// 	exclude: 'node_modules/**',
			// 	runtimeHelpers: false
			// }),
    ].concat(opts.plugins || [])
  }

  if (opts.env) {
    config.plugins.push(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }
  return config
}

const mobileBuild = getBuild('mobile');
const desktopBuild = getBuild('desktop');

exports.getMobile = () => Object.keys(mobileBuild).map(name => genConfig(mobileBuild[name]))

exports.getDesktop = () => Object.keys(desktopBuild).map(name => genConfig(desktopBuild[name]))
