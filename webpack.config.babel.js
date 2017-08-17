import path from 'path'

export default {
  entry: ['babel-polyfill', './src/index.js'],

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'build'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
}
