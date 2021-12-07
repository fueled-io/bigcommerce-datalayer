const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
    return {
        mode: argv.mode || 'development',
        entry: './src/index.js',
        output: {
            filename: 'dataLayer.min.js',
            path: path.resolve(__dirname, 'dist'),
            clean: true,
        },
        plugins: [new webpack.DefinePlugin({
            WEBPACK_MODE: JSON.stringify(argv.mode),
        })],
        optimization: {
            minimizer: [new TerserPlugin()]
        }
    }
};