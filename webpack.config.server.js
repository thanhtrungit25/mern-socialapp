const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CURRENT_WORKING_DIR = process.cwd();

const config = {
  name: 'server',
  entry: [path.join(CURRENT_WORKING_DIR, './server/server.js')],
  target: 'node', // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  output: {
    path: path.join(CURRENT_WORKING_DIR, '/dist/'),
    filename: 'server.generated.js',
    publicPath: '/dist/',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(ttf|eot|svg|gif|jpg|png)(\?[\s\S]+)?$/,
        use: 'file-loader',
      },
    ],
  },
};

module.exports = config;
