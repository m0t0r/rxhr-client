var path = require('path');

module.exports = {
  context: path.resolve('src'),
  entry: './index.ts',
  output: {
    path: path.resolve('dist/'),
    filename: 'rxhr-client.js'
  },
  module: {
    loaders: [
      { test: /\.ts$/, exclude: /node_modules/, loader: 'ts'}
    ]
  }
};