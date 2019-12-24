const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  target: 'node',
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'index.min.js',
    libraryTarget: "umd"
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}
