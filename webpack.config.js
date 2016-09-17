var path = require('path');

module.exports = {
  context: path.resolve('src'),
  entry: './hello-world.ts',
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