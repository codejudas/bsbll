const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: './src/web/index.jsx',
  devtool: "source-map", // enable sourcemap for debugging
  output: {
    path: path.resolve(__dirname, 'build/web'),
    filename: 'index.js'
  },
  module: {
    rules: [
      // All files with a '.js' or '.jsx' extension will be handled by 'babel'.
      { test: /\.jsx?/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.scss/, use: [ 'style-loader', 'css-loader', 'sass-loader' ]},

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
      ]
  },
  plugins: [
    new CopyWebpackPlugin([
      // index.html
      {from: './src/web/index.html', to: './index.html'},
      
      // dependencies
      {from: './node_modules/react/dist/react.min.js', to: './vendor/react.min.js'},
      {from: './node_modules/react-dom/dist/react-dom.min.js', to: './vendor/react-dom.min.js'},

    ])
  ]
};
