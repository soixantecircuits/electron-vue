'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')

{{#isEnabled plugins 'standard-settings'}}
var NoOperationPlugin = function (pattern) {
  const apply = function (compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      compilation.fileDependencies.push(...pattern.path)
      callback()
    })
  }
  return {
    apply
  }
}
{{/isEnabled}}

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
{{#if eslint}}
      {
        test: /\.(js)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        use: {
          loader: 'eslint-loader',
          options: {
            formatter: require('eslint-friendly-formatter')
          }
        }
      },
{{/if}}
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
  {{#isEnabled plugins 'standard-settings'}}
  let settings = require('standard-settings').getSettings()
  let settingsFiles = [
    path.join(__dirname, '../settings/settings.default.json'),
    path.join(__dirname, '../settings/settings.json')
  ]
  if (settings.settings) {
    let customFilePath = path.resolve(path.join(__dirname, '../'), settings.settings)
    settingsFiles.push(customFilePath)
  }
  mainConfig.plugins.push(
    new NoOperationPlugin(
      {
        path: settingsFiles
      }
    )
  )
  {{/isEnabled}}
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = mainConfig
