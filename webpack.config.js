var path = require('path');
var webpack = require('webpack');


var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = process.env.WEBPACK_ENV;

var libraryName = 'role-hierarchy';
var plugins = [], outputFile;
if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}



module.exports = {
  entry: {"role-hierarchy": './source/role-hierarchy.js', test: './test/test.js'},
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, 'distribution'),
    filename: '[name].js',
    library: 'role-hierarchy',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  stats: {
    colors: true
  },
  node: {
    fs: "empty"
  },
  externals: {
    config: {
      commonjs: 'config',
      commonjs2: 'config',
      amd: 'config',
      root: 'config'
    },
    winston: {
      commonjs: 'winston',
      commonjs2: 'winston',
      amd: 'winston',
      root: 'winston'
    }
  }

};