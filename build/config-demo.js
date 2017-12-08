// Rollup plugins
// const babel = require('rollup-plugin-babel');
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const less = require('less');
const path = require('path');
// PostCSS plugins
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const basePath = path.resolve(__dirname, '../');
const distBasePath = path.resolve(basePath, 'dist');
const vue = require('rollup-plugin-vue');

function getDemoBuild (type) {
	const build = {
		'es': {
			entry: `${basePath}/src/examples/${type}/demo.js`,
			dest: `${distBasePath}/examples/${type}/demo.js`,
			format: 'umd',
			external: [
				'vue'
			],
			paths: {
				vue: 'vue'
			},
			globals: {
				vue: "Vue"
			}

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
		exports: "named",
		moduleName: 'demo',
		globals: opts.globals,
		sourceMap: true,
    plugins: [
			vue({compileTemplate: true, css: opts.dest.replace(/js$/i, 'css')}),
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

const mobileBuild = getDemoBuild('mobile');

const desktopBuild = getDemoBuild('desktop');

exports.getMobile = () => Object.keys(mobileBuild).map(name => genConfig(mobileBuild[name]))

exports.getDesktop = () => Object.keys(desktopBuild).map(name => genConfig(desktopBuild[name]))
