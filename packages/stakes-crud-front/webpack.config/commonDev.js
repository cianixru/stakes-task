const merge = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./common.js')

const host = '0.0.0.0'
const port = 8081

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
  mode: 'development',

  module: {
    rules: common.module.rules.concat([
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
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
        use: ['style-loader', CSSModuleLoader, postCSSLoader, 'sass-loader'],
      },
      {
        test: /\.scss$/,
        exclude: /\.module\.scss$/,
        use: [
          'style-loader',
          CSSLoader,
          'resolve-url-loader',
          postCSSLoader,
          'sass-loader',
        ],
      },
    ]),
  },

  plugins: common.plugins.concat([
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../template/index.html'),
      filename: path.resolve(__dirname, '../public/index.html'),
      hash: true,
    }),
  ]),

  devServer: {
    contentBase: [path.join(__dirname, '..', 'public'), 'C:/poker-ru-wp-assets/'],
    port,
    disableHostCheck: true,
    allowedHosts: [
      '192.168.0.113:8081',
      '192.168.0.113',
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:3001/',
      },
    },
    //  hot: true,
    inline: true,
    host,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
})
