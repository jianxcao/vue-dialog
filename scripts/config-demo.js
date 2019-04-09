// Rollup plugins
const buble = require('rollup-plugin-buble');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const path = require('path');
const basePath = path.resolve(__dirname, '../');
const distBasePath = path.resolve(basePath, 'dist');
const vue = require('rollup-plugin-vue');

function getDemoBuild (type) {
	return {
		input: `${basePath}/examples/${type}/demo.js`,
		output: {
			file: `${distBasePath}/examples/${type}/demo.js`,
			format: 'iife',
			exports: 'named',
			globals: {
				vue: "Vue"
			},
			name: 'demo',
			sourceMap: true,
		},
		external: [
			'vue'
		],
    plugins: [
			vue({ compileTemplate: true, css: `${distBasePath}/examples/${type}/demo.css`}),
			resolve(),
			commonjs(),
			buble({
				transforms: {
					dangerousForOf: true
				}
			}),
    ]
	}
};


const mobileBuild = getDemoBuild('mobile');

const desktopBuild = getDemoBuild('desktop');

module.exports = [mobileBuild, desktopBuild];