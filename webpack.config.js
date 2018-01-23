const path = require('path');

const context = path.resolve(__dirname, 'src');

module.exports = {
  context,
  entry: './index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'modokdb',
    filename: 'index.js',
  },
  node: {
    fs: 'empty',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: context,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        include: context,
      },
    ],
  },
  externals: [],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
};
