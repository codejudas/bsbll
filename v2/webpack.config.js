const path = require('path');
const proc = require('process');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

const production = process.env.NODE_ENV === 'production';

const PROD_CONFIG = {
  cache: true,
  entry: './src/web/app.jsx',
  devtool: "source-map", // enable sourcemap for debugging
  output: {
    path: path.resolve(__dirname, 'build/web'),
    publicPath: '/assets/js/',
    filename: 'bundle.js'
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
      inject: 'body',
      alwaysWriteToDisk: true,
    })
  ]
};

const DEV_CONFIG = Object.assign({}, PROD_CONFIG, {
    target: 'web', // default value for something
    module: {
      rules: [
        // All files with a '.js' or '.jsx' extension will be handled by 'babel'.
        { test: /\.jsx?/, loaders: ['react-hot-loader', 'babel-loader'], exclude: /node_modules/ },
        { test: /\.scss/, use: [ 'style-loader', 'css-loader', 'sass-loader' ]},

        // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
        { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        template: './src/web/index.template.ejs',
        filename: 'index.html',
        inject: 'body',
        alwaysWriteToDisk: true,
      }),
    ]
});

module.exports = production ? PROD_CONFIG : DEV_CONFIG;
