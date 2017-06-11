const path = require('path');
const proc = require('process');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

function devConfig() {
  return {
    cache: true,
    entry: './src/web/index.jsx',
    devtool: "source-map", // enable sourcemap for debugging
    target: 'web', // default value for something
    output: {
      publicPath: 'http://localhost:6969/', // location html expects to find js
      path: '/',  // / Because we are building to memory now
      filename: 'assets/js/index.js'
    },
    module: {
      rules: [
        // All files with a '.js' or '.jsx' extension will be handled by 'babel'.
        { test: /\.jsx?/, loaders: ['react-hot-loader', 'babel-loader'], exclude: /node_modules/ },
        { test: /\.scss/, use: [ 'style-loader', 'css-loader', 'sass-loader' ]},

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/web/index.template.ejs',
        filename: '/index.html',
        inject: 'body'
      }),
      // HMR
      new webpack.HotModuleReplacementPlugin()
    ]
  };
}

function prodConfig() {
  return {
    cache: true,
    entry: './src/web/index.jsx',
    devtool: "source-map", // enable sourcemap for debugging
    output: {
      path: path.resolve(__dirname, 'build/web'),
      publicPath: '/assets/js/',
      filename: 'index.js'
    },
    module: {
      rules: [
        // All files with a '.js' or '.jsx' extension will be handled by 'babel'.
        { test: /\.jsx?/, loaders: ['babel-loader'], exclude: /node_modules/ },
        { test: /\.scss/, use: [ 'style-loader', 'css-loader', 'sass-loader' ]},

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/web/index.template.ejs',
        filename: 'index.html',
        inject: 'body'
      })
    ]
  };
}

if (production) {
  module.exports = prodConfig();
} else {
  module.exports = devConfig();
}