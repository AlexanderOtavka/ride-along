/**
 * @file webpack.config.js
 *
 * Created by Zander Otavka on 6/4/17.
 * Copyright (C) 2016  Grinnell AppDev.
 *
 * @license
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import autoprefixer from "autoprefixer"
import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import ManifestPlugin from "webpack-manifest-plugin"
import CaseSensitivePathsPlugin from "case-sensitive-paths-webpack-plugin"
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin"
import WatchMissingNodeModulesPlugin from "react-dev-utils/WatchMissingNodeModulesPlugin"
import ModuleScopePlugin from "react-dev-utils/ModuleScopePlugin"
import SWPrecacheWebpackPlugin from "sw-precache-webpack-plugin"
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer"
import CompressionPlugin from "compression-webpack-plugin"

import paths from "./paths"
import getClientEnvironment from "./env"

const isProduction = process.env.NODE_ENV === "production"

// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
// In development, we always serve from the root. This makes config easier.
const publicPath = isProduction ? paths.servedPath : "/"
// Some apps do not use client-side routing with pushState.
// For these, "homepage" can be set to "." to enable relative asset paths.
const shouldUseRelativeAssetPaths = publicPath === "./"
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_PATH%xyz.
const publicUrl = publicPath.slice(0, -1)
// Get environment variables to inject into our app.
const env = getClientEnvironment(publicUrl)

// Note: defined here because it will be used more than once.
const cssFilename = "static/css/[name].[contenthash:8].css"

// ExtractTextPlugin expects the build output to be flat.
// (See https://github.com/webpack-contrib/extract-text-webpack-plugin/issues/27)
// However, our output is structured with css, js and media folders.
// To have this structure working with relative paths, we have to use custom options.
const extractTextPluginOptions = shouldUseRelativeAssetPaths
  ? // Making sure that the publicPath goes back to to build folder.
    { publicPath: Array(cssFilename.split("/").length).join("../") }
  : {}

const cssLoaders = [
  {
    loader: require.resolve("css-loader"),
    options: {
      modules: true,
      importLoaders: 1,
      minimize: isProduction,
      sourceMap: isProduction,
    },
  },
  {
    loader: require.resolve("postcss-loader"),
    options: {
      plugins: () => [
        require("postcss-flexbugs-fixes"),
        autoprefixer({
          browsers: [
            ">1%",
            "last 4 versions",
            "Firefox ESR",
            "not ie < 9", // React doesn't support IE8 anyway
          ],
          flexbox: "no-2009",
        }),
      ],
    },
  },
]

const sassLoaders = [
  ...cssLoaders,
  {
    loader: require.resolve("sass-loader"),
    options: {
      indentedSyntax: true,
    },
  },
]

// The notation here is somewhat confusing.
// "style" loader normally turns CSS into JS modules injecting <style>,
// so in development "style" loader enables hot editing of CSS.
// In production, we do something different.
// `ExtractTextPlugin` first applies the "postcss" and "css" loaders
// (second argument), then grabs the result CSS and puts it into a
// separate file in our build process. This way we actually ship
// a single CSS file in production instead of JS code injecting <style>
// tags. If you use code splitting, however, any async bundles will still
// use the "style" loader inside the async code so CSS from them won't be
// in the main CSS file.
const getExtractStyleLoader = loaders =>
  isProduction
    ? // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      ExtractTextPlugin.extract({
        ...extractTextPluginOptions,

        fallback: require.resolve("style-loader"),
        use: loaders,
      })
    : [require.resolve("style-loader"), ...loaders]

export default {
  // In production, don't attempt to continue if there are any errors.
  bail: isProduction,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  // You may want 'eval' instead if you prefer to see the compiled output in DevTools.
  // See the discussion in https://github.com/facebookincubator/create-react-app/issues/343.
  devtool: isProduction ? "source-map" : "cheap-module-source-map",
  // These are the "entry points" to our application.
  // This means they will be the "root" imports that are included in JS bundle.
  // In production, we only want to load the polyfills and the app code.
  entry: [
    ...(isProduction
      ? []
      : [
          // Include an alternative client for WebpackDevServer. A client's job is to
          // connect to WebpackDevServer by a socket and get notified about changes.
          // When you save a file, the client will either apply hot updates (in case
          // of CSS changes), or refresh the page (in case of JS changes). When you
          // make a syntax error, this client will display a syntax error overlay.
          // Note: instead of the default WebpackDevServer client, we use a custom one
          // to bring better experience for Create React App users. You can replace
          // the line below with these two lines if you prefer the stock client:
          // require.resolve('webpack-dev-server/client') + '?/',
          // require.resolve('webpack/hot/dev-server'),
          require.resolve("react-dev-utils/webpackHotDevClient"),
          // Errors should be considered fatal in development
          require.resolve("react-error-overlay"),
        ]),
    // We ship a few polyfills by default:
    require.resolve("./polyfills"),
    // Finally, this is your app's code:
    paths.webIndexJs,
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    // The build folder.  It is not used in dev but WebpackDevServer crashes without it.
    path: paths.webBuild,
    // Add /* filename */ comments to generated require()s in the output.
    pathinfo: !isProduction,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: `static/js/${isProduction
      ? "[name].[chunkhash:8]"
      : "bundle"}.js`,
    chunkFilename: `static/js/[name]${isProduction
      ? ".[chunkhash:8]"
      : ""}.chunk.js`,
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath,
    // Point sourcemap entries to original disk location
    devtoolModuleFilenameTemplate: info =>
      isProduction
        ? // In production, we want a relative path so we don't publish our
          // full file system path to the web eg. /Users/zander/Developer...
          path.relative(paths.appSrc, info.absoluteResourcePath)
        : // In development, we need a full path so external debuggers can connect
          // the real files with the source maps.
          path.resolve(info.absoluteResourcePath),
  },
  resolve: {
    // This allows you to set a fallback for where Webpack should look for modules.
    // We placed these paths second because we want `node_modules` to "win"
    // if there are any conflicts. This matches Node resolution mechanism.
    // https://github.com/facebookincubator/create-react-app/issues/253
    modules: ["node_modules", paths.appNodeModules].concat(
      // It is guaranteed to exist because we tweak it in `env.js`
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    // These are the reasonable defaults supported by the Node ecosystem.
    // We also include JSX as a common component filename extension to support
    // some tools, although we do not recommend using it, see:
    // https://github.com/facebookincubator/create-react-app/issues/290
    extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
    alias: {
      // Support React Native Web
      // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
      "react-native": "react-native-web",
      ...(isProduction
        ? {
            react: "preact-compat",
            "react-dom": "preact-compat",
            "create-react-class": "preact-compat/lib/create-react-class",
          }
        : {}),
    },
    plugins: [
      // Prevents users from importing files from outside of src/ (or node_modules/).
      // This often causes confusion because we only process files within src/ with babel.
      // To fix this, we prevent you from importing files out of src/ -- if you'd like to,
      // please link the files into your node_modules/ and let module-resolution kick in.
      // Make sure your source files are compiled, as they will not be processed in any way.
      new ModuleScopePlugin(paths.appSrc),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },

      // First, run the linter.
      // It's important to do this before Typescript runs.
      {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve("tslint-loader"),
        enforce: "pre",
      },
      {
        test: /\.js$/,
        include: paths.appSrc,
        loader: require.resolve("source-map-loader"),
        enforce: "pre",
      },
      // ** ADDING/UPDATING LOADERS **
      // The "file" loader handles all assets unless explicitly excluded.
      // The `exclude` list *must* be updated with every change to loader extensions.
      // When adding a new loader, you must add its `test`
      // as a new entry in the `exclude` list in the "file" loader.

      // In development, "file" loader makes sure those assets get served by WebpackDevServer.
      // When you `import` an asset, you get its (virtual) filename.
      // In production, they would get copied to the `build` folder.
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.(ts|tsx)$/,
          /\.sass$/,
          /\.css$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.svg$/,
        ],
        include: paths.appSrc,
        loader: require.resolve("file-loader"),
        options: {
          name: "static/media/[name].[hash:8].[ext]",
        },
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        include: paths.appSrc,
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "static/media/[name].[hash:8].[ext]",
        },
      },
      // Compile .tsx?
      {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        loader: require.resolve("ts-loader"),
      },
      {
        test: /\.sass$/,
        use: getExtractStyleLoader(sassLoaders),
      },
      {
        test: /\.css$/,
        use: getExtractStyleLoader(cssLoaders),
      },
      {
        test: /\.svg$/,
        include: paths.appSrc,
        loader: require.resolve("react-svg-loader"),
        options: {
          es5: true,
          svgo: {
            plugins: [{ removeTitle: false }],
            floatPrecision: 2,
          },
        },
      },
      // ** STOP ** Are you adding a new loader?
      // Remember to add the new extension(s) to the "file" loader exclusion list.
    ],
  },
  plugins: [
    // Makes some environment variables available in index.html.
    // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    // In development, this will be an empty string.
    new InterpolateHtmlPlugin(env.raw),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.webHtml,
      minify: isProduction
        ? {
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
          }
        : false,
    }),
    // Makes some environment variables available to the JS code, for example:
    // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
    // For production builds, it is absolutely essential that NODE_ENV was set
    // to production here. Otherwise React will be compiled in the very slow
    // development mode.
    new webpack.DefinePlugin(env.stringified),
    ...(isProduction
      ? [
          // Visualize the bundle contents
          new BundleAnalyzerPlugin({
            analyzerMode: "static",
            reportFilename: path.join(paths.report, "bundle-analyzer.html"),
          }),
          // Move modules shared by all children of main back into main
          new webpack.optimize.CommonsChunkPlugin({
            name: "main",
            children: true,
          }),
          // Minify the code.
          new webpack.optimize.UglifyJsPlugin({
            compress: {
              warnings: false,
              // This feature has been reported as buggy a few times, such as:
              // https://github.com/mishoo/UglifyJS2/issues/1964
              // We'll wait with enabling it by default until it is more solid.
              reduce_vars: false,
            },
            output: {
              comments: false,
            },
            sourceMap: true,
          }),
          // Create gzip files
          new CompressionPlugin({
            test: /\.(js|css|html)$/,
          }),
          // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
          new ExtractTextPlugin({
            filename: cssFilename,
            allChunks: true,
          }),
          // Generate a manifest file which contains a mapping of all asset filenames
          // to their corresponding output file so that tools can pick it up without
          // having to parse `index.html`.
          new ManifestPlugin({
            fileName: "asset-manifest.json",
          }),
          // Generate a service worker script that will precache, and keep up to date,
          // the HTML & assets that are part of the Webpack build.
          new SWPrecacheWebpackPlugin({
            // By default, a cache-busting query parameter is appended to requests
            // used to populate the caches, to ensure the responses are fresh.
            // If a URL is already hashed by Webpack, then there is no concern
            // about it being stale, and the cache-busting can be skipped.
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: "service-worker.js",
            logger(message) {
              if (message.indexOf("Total precache size is") === 0) {
                // This message occurs for every build and is a bit too noisy.
                return
              } else {
                console.info(message)
              }
            },
            minify: true,
            // For unknown URLs, fallback to the index page
            navigateFallback: publicUrl + "/index.html",
            // Ignores URLs starting from /__ (useful for Firebase):
            // https://github.com/facebookincubator/create-react-app/issues/2237#issuecomment-302693219
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            // Don't precache sourcemaps (they're large) and build asset manifest:
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
            // Work around Windows path issue in SWPrecacheWebpackPlugin:
            // https://github.com/facebookincubator/create-react-app/issues/2235
            stripPrefix: paths.webBuild.replace(/\\/g, "/") + "/",
          }),
        ]
      : [
          // This is necessary to emit hot updates (currently CSS only):
          new webpack.HotModuleReplacementPlugin(),
          // Watcher doesn't work well if you mistype casing in a path so we use
          // a plugin that prints an error when you attempt to do this.
          // See https://github.com/facebookincubator/create-react-app/issues/240
          new CaseSensitivePathsPlugin(),
          // If you require a missing module and then `npm install` it, you still have
          // to restart the development server for Webpack to discover it. This plugin
          // makes the discovery automatic so you don't have to restart.
          // See https://github.com/facebookincubator/create-react-app/issues/186
          new WatchMissingNodeModulesPlugin(paths.appNodeModules),
        ]),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: isProduction ? "warning" : false,
    maxAssetSize: 300000, // 300kb
  },
}
