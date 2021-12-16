const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
    return {
        mode: argv.mode || 'development',
        entry: './src/index.js',
        output: {
            filename: 'dataLayer.min.js',
            path: path.resolve(__dirname, 'dist'),
        },
        plugins: [new webpack.DefinePlugin({
            WEBPACK_MODE: JSON.stringify(argv.mode),
        })],        
    }
};