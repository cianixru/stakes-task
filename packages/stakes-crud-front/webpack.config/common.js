const path = require('path')
const webpack = require('webpack')
const ip = require('ip')
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  entry: {
    app: './src/main.tsx',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },

  plugins: [],

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    // plugins: [new TsconfigPathsPlugin()],
  },

  module: {
    rules: [
      {
        test: /.ts?$|.tsx?$/,
        exclude: /\.story\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true,
              allowTsInNodeModules: true,
            },
          },
        ],
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loader: 'image-webpack-loader',
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          },
        },
      },
    ],
  },
}
