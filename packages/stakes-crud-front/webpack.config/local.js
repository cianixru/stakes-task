const merge = require('webpack-merge')
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const common = require('./commonDev.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = merge(common, {
  plugins: common.plugins.concat(
      [
          new Dotenv({
            path: './.env.local',
            safe: true,
            systemvars: true,
          }),
      ]
  ),
})
