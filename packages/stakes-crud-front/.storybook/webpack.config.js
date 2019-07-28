const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = async ({config, mode}) => {

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
  config.resolve.extensions.push('.ts', '.tsx', '.js', '.json')


  config.resolve.plugins =[new TsconfigPathsPlugin()]

  config.module.rules.push(
    {
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader',
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
      use: ['style-loader', CSSModuleLoader, postCSSLoader, 'sass-loader'],
    },
    {
      test: /.ts?$|.tsx?$/,
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
  )

  // Extend it as you need.

  // For example, add typescript loader:
  /* config.module.rules.push({
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, '../src'),
        loader: require.resolve('awesome-typescript-loader'),
        options: {
            configFileName: 'tsconfig.frontend.json'
        },
    });
    config.resolve.extensions.push('.ts', '.tsx');*/
  config.module.rules.push({
    test: /\.(png|woff|woff2|eot|ttf|svg)$/,
    loaders: ['file-loader'],
    include: path.resolve(__dirname, '../'),
  })

  return config
}
