var path = require('path');
require("babel-polyfill");

module.exports = {
  entry: ['babel-polyfill', './src/main.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  module: {
    loaders: [
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
};
