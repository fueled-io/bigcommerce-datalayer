const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {},
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};
