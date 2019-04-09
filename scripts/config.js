
// Rollup plugins
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const postcss = require('rollup-plugin-postcss');
const path = require('path');
// PostCSS plugins
const cssnext = require('postcss-cssnext');
const cssnano = require('cssnano');
const version = process.env.VERSION || require('../package.json').version
const { uglify } = require('rollup-plugin-uglify');

const isProduct = process.env.NODE_ENV === 'production';

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
    plugins: [
      cssnext({ warnForDuplicates: false }),
      cssnano()
    ],
		extract: `${distBasePath}/${type}/dialog.css`,
    extensions: ['.css', '.less']
  });
};

function getBuild (type) {
	const plugins = [];
	const outputFile = {
    globals: {
			vue: 'Vue'
    },
    name: 'dialog',
    banner,
    extend: true,
    sourceMap: true
  };
	const base = {
		input: `${basePath}/src/${type}/dialog.js`,
		external: [
			'vue'
		],
		cssPlugin: getCssPlugin(type)
	};
	const all = [['umd', ''], ['umd', 'min'], ['esm', 'esm'], ['cjs', 'common']];
	const umd = [['umd', '']];
	return (isProduct ? all : umd).map(cur => {
		const output = Object.assign({}, {
			format: cur[0],
			exports: 'named',
			file: `${distBasePath}/${type}/dialog${cur[1] ? '.' + cur[1] : ''}.js`
		}, outputFile);
		let selfPlugin = null;
		if (cur[1].indexOf('min') > -1) {
			selfPlugin = plugins.slice(0);
			selfPlugin.unshift(uglify());
		}
		return Object.assign({}, base, {
			output,
			plugins: selfPlugin ? selfPlugin : plugins
		});
	});
}


function genConfig (opts) {
	return opts.map(config => {
		return {
			input: config.input,
			output: config.output,
			external: config.external,
			plugins: [
				config.cssPlugin,
				resolve(),
				commonjs(),
				buble({
					transforms: {
						dangerousForOf: true
					}
				}),
			].concat(config.plugins || [])
		}
	});
}

const mobileBuild = getBuild('mobile');
const desktopBuild = getBuild('desktop');
module.exports = [].concat(genConfig(mobileBuild)).concat(genConfig(desktopBuild));