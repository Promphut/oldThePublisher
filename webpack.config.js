// https://github.com/diegohaz/arc/wiki/Webpack
const path = require('path')
const devServer = require('@webpack-blocks/dev-server2')
const splitVendor = require('webpack-blocks-split-vendor')
const happypack = require('webpack-blocks-happypack')
const serverSourceMap = require('webpack-blocks-server-source-map')
const nodeExternals = require('webpack-node-externals')
const AssetsByTypePlugin = require('webpack-assets-by-type-plugin')
const ChildConfigPlugin = require('webpack-child-config-plugin')
const SpawnPlugin = require('webpack-spawn-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const fs = require('fs')
const OfflinePlugin = require('offline-plugin')
const WebpackMd5Hash = require('webpack-md5-hash')

const {
  addPlugins,
  createConfig,
  entryPoint,
  env,
  setOutput,
  sourceMaps,
  defineConstants,
  webpack,
  group
} = require('@webpack-blocks/webpack2')

const host = process.env.HOST || 'localhost'
const port = (+ process.env.PORT + 1) || 3001
const sourceDir = process.env.SOURCE || 'src'
const publicPath = `/${process.env.PUBLIC_PATH || ''}/`.replace('//', '/')
const sourcePath = path.join(process.cwd(), sourceDir)
const outputPath = path.join(process.cwd(), 'dist/public')
const assetsPath = path.join(process.cwd(), 'dist/assets.json')
const clientEntryPath = path.join(sourcePath, 'client.js')
const serverEntryPath = path.join(sourcePath, 'server.js')
const devDomain = `https://${host}:${port}/`

const babel = () => () => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  }
})

const assets = () => () => ({
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|svg|woff2?|ttf|eot)$/,
        loader: 'url-loader?limit=8000'
      }
    ]
  }
})

const resolveModules = modules => () => ({
  resolve: {
    modules: [].concat(modules, ['node_modules']),
    alias: {
      'load-image': 'blueimp-load-image/js/load-image.js',
      'load-image-meta': 'blueimp-load-image/js/load-image-meta.js',
      'load-image-exif': 'blueimp-load-image/js/load-image-exif.js',
      'canvas-to-blob': 'blueimp-canvas-to-blob/js/canvas-to-blob.js',
      'jquery-ui/ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      'jquery-ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js',
      'load-image-scale': 'blueimp-file-upload/js/jquery.fileupload-image.js'
    }
  }
})

const base = () => group([
  setOutput({
    filename: process.env.NODE_ENV==='development' ? '[name].js' : '[name].[chunkhash].js',
    chunkFilename: '[name].js',
    path: outputPath,
    publicPath
  }),
  addPlugins([
    new WebpackMd5Hash(),
  ]),
  defineConstants({
    'process.env.NODE_ENV': process.env.NODE_ENV,
    'process.env.PUBLIC_PATH': publicPath.replace(/\/$/, '')
  }),
  addPlugins([
    new webpack.ProgressPlugin(),
    //new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new OfflinePlugin({
      //safeToUseOptionalCaches: true,
      ServiceWorker: {
        events: true
      },
      AppCache: {
        events: true
      }
    })
  ]),
  happypack([babel()]),
  assets(),
  resolveModules(sourceDir),

  env('development', [
    setOutput({
      publicPath: devDomain
    })
  ])
])

const server = createConfig([
  base(),
  entryPoint({
    server: serverEntryPath
  }),
  setOutput({
    filename: '../[name].js',
    chunkFilename: '[name].bundle.js',
    libraryTarget: 'commonjs2'
  }),

  addPlugins([
    new webpack.BannerPlugin({
      banner: 'global.assets = require("./assets.json");',
      raw: true
    }),
  ]),
  () => ({
    target: 'node',
    externals: [
      nodeExternals()
    ],
    stats: 'errors-only'
  }),

  env('development', [
    serverSourceMap(),
    addPlugins([
      new SpawnPlugin('node', ['.']),
    ]),
    () => ({watch: true})
  ])
])

const client = createConfig([
  base(),
  entryPoint({ client: clientEntryPath }),
  () => ({
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'sass-loader']
          })
        }, {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: ['css-loader', 'postcss-loader']
          })
        },
      ],
    },
  }),
  addPlugins([
    new webpack.DefinePlugin({
      "process.env": {
        BROWSER: JSON.stringify(true)
      }
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new ExtractTextPlugin({
      filename: '[name].[chunkhash].css',
      allChunks: true
    }),
    new AssetsByTypePlugin({
      path: assetsPath
    }),
    new ChildConfigPlugin(server)
  ]),

  //clientCssModules(),

  process.env.NODE_ENV==='development' ? env('development', [
    devServer({
      contentBase: 'public',
      stats: 'errors-only',
      historyApiFallback: {
        index: publicPath
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      host,
      port,
      https: {
        key: fs.readFileSync('./private/keys/localhost.key'),
        cert: fs.readFileSync('./private/keys/localhost.crt'),
        passphrase: 'thepublisher'
      }
    }),
    addPlugins([
      new webpack.NamedModulesPlugin(),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
    ])
  ]) : env(process.env.NODE_ENV, [
    //splitVendor({ exclude: [/lodash/, /offline-plugin\/runtime\.js/] }),
    splitVendor(),

    process.env.NODE_ENV==='production' ? addPlugins([
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        },
        comments: false
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true
      }),
    ]) : () => {},
  ]),
])

module.exports = client