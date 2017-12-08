const autoprefixer = require('autoprefixer');

module.exports = {
	loader: 'postcss-loader',
	plugins: [
		autoprefixer()
	]
};
