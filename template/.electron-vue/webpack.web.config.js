'use strict'

process.env.BABEL_ENV = 'web'

const path = require('path')
const webpack = require('webpack')

const BabiliWebpackPlugin = require('babili-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

{{#isEnabled plugins 'standard-settings'}}
const settings = require('standard-settings').getSettings()
{{/isEnabled}}

{{#if serviceWorker}}
var addAssetListInSW = function () {}
addAssetListInSW.prototype.apply = function (compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    let filename = 'service-worker.js'
    let swCode = compilation.assets[filename].source()
    delete compilation.assets[filename]
    let assets = ['./', ...Object.keys(compilation.assets)]
    const source = `
            let compilationAssets = ${JSON.stringify(assets)}
            ${swCode}
          `.trim()

    compilation.assets[filename] = {
      source: () => source,
      size: () => Buffer.byteLength(source, 'utf8')
    }
    callback()
  })
}
{{/if}}

let webConfig = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    web: path.join(__dirname, '../src/renderer/main.js')
  },
  module: {
    rules: [
{{#if eslint}}
      {
        test: /\.(js|vue)$/,
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
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        include: [ path.resolve(__dirname, '../src/renderer') ],
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            extractCSS: true,
            loaders: {
              sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
              scss: 'vue-style-loader!css-loader!sass-loader'
            }
          }
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name].[ext]'
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name].[ext]'
          }
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      nodeModules: false
    }),
    new webpack.DefinePlugin({
      {{#isEnabled plugins 'standard-settings'}}
      SETTINGS: JSON.stringify(settings),
      {{/isEnabled}}
      'process.env.IS_WEB': 'true'
    }),
    new webpack.HotModuleReplacementPlugin(),
    {{#if serviceWorker}}
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/renderer/lib/service-worker.js'),
        to: path.join(__dirname, '../dist/web/')
      }
    ]),
    new addAssetListInSW()
    {{else}}
    new webpack.NoEmitOnErrorsPlugin()
    {{/if}}
  ],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist/web')
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  target: 'web'
}

/**
 * Adjust webConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  webConfig.devtool = ''

  webConfig.plugins.push(
    new BabiliWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../static'),
        to: path.join(__dirname, '../dist/web/static'),
        ignore: ['.*']
      }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  )
}

module.exports = webConfig
