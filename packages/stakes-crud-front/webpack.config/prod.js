const merge = require('webpack-merge')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const common = require('./common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


const TerserPlugin = require('terser-webpack-plugin');



const CSSModuleLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    sourceMap: true,
    localIdentName: '[local]__[hash:base64:5]',
    minimize: true,
  },
}

const CSSLoader = {
  loader: 'css-loader',
  options: {
    modules: false,
    sourceMap: true,
    minimize: true,
  },
}

const postCSSLoader = {
  loader: 'postcss-loader',
  options: {
    config: {
      path: './',
    },
  },
}

module.exports = merge(common, {
  mode: 'production',
  /*
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  */
  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, '../public'),
    publicPath: '/',
  },

  module: {
    rules: common.module.rules.concat([
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: './',
              },
            },
          },
        ],
      },
      {
        test: /\.module\.scss$/,
        use: [MiniCssExtractPlugin.loader, CSSModuleLoader, postCSSLoader, 'sass-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          CSSLoader,
          'resolve-url-loader',
          postCSSLoader,
          'sass-loader',
        ],
      },
    ]),
  },

  plugins: common.plugins.concat([
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/index.html'),
      filename: path.resolve(__dirname, '../public/index.html'),
      hash: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new BundleAnalyzerPlugin(),
    new Dotenv({
      path: './.env.prod',
      safe: true,
      systemvars: true,
    }),
  ]),
})
