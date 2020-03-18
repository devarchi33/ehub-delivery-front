const path = require('path');
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CompressionPlugin = require("compression-webpack-plugin"); // @See https://github.com/webpack-contrib/compression-webpack-plugin
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

const srcRoot = path.resolve(__dirname, 'src');
const appRoot = path.resolve(srcRoot, 'app');
const adminRoot = path.resolve(srcRoot, 'admin');

module.exports = (env) => {
    const isDev = env === 'development';
    return {
        context: path.resolve(__dirname),
        entry: {
            main: './src/app/main.js',
            admin: './src/admin/main.js',
            vendor: ['antd','js-cookie','jwt-decode','lodash','prop-types','xlsx'],
            react: ['react','react-dom','react-router-dom','react-redux','react-router','react-router-redux','react-tap-event-plugin','redux','redux-thunk'],
        },
        output: {
            path: path.resolve(__dirname, './build'),
            filename: '[name].[chunkhash].js',
            publicPath: '/'
        },
        module: { // @See https://webpack.js.org/configuration/module/#module-contexts
            rules: [
                {
                    test: /\.js?$/, // A regexp to test the require path. accepts either js or jsx
                    loader: 'babel-loader',
                    options: {
                        // Webpack understands the native import syntax, and uses it for tree shaking
                        presets: [
                            ['env', { targets: { browsers: ["last 2 versions", "safari >= 7"] } }],
                            //See https://github.com/babel/babel-preset-env
                            'stage-2',
                            // Specifies what level of language features to activate.
                            // State 2 is 'draft', 4 is finished, 0 is strawman.
                            // See https://tc39.github.io/process-document/
                            'react',
                            // Transpile React components to JS
                        ],
                        plugins: [
                            ['import', { libraryName: 'antd', style: 'css' }],
                            // `style: true` for less
                        ]
                    },
                    exclude: /node_modules/
                },
                { test: /\.css$/, loader: 'style-loader!css-loader' },
                { test: /\.json$/, loader: 'json-loader' },
                {
                    test: /\.(jpe?g|png|gif)$/,
                    loader: 'file-loader',
                    query:{ name: 'assets/img/[name].[ext]' }
                },
            ]
        },
        resolve: {
            extensions: ['.js', '.jsx'],
            modules: [ appRoot, adminRoot, 'node_modules' ]
        },
        devServer: {
            // historyApiFallback: true,
            contentBase: path.join(__dirname, 'build'),
            port: 2200,
            // hot: true,
            compress: true,
            publicPath: '/',
            stats: 'minimal'
        },
        stats: 'minimal',
        performance: { hints: false },
        devtool: isDev ? 'eval' : 'cheap-module-source-map', //false, //isDev ? 'eval' : 'cheap-source-map',
        plugins: [
            new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } }),
            new CleanWebpackPlugin(['build']),
            new CopyWebpackPlugin([
                {from: './src/index.html'},
                {from: './src/assets', to: './assets'},
            ]),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/, /lodash$/),
            new HtmlWebpackPlugin({
                template: path.resolve(srcRoot, 'index.html'),
                chunksSortMode: 'dependency'
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'vendor',
                filename: 'vendor.[chunkhash].js',
                minChunks: Infinity,
            }),
            new webpack.DefinePlugin({
                'global.GENTLY': false,
                process: { env: { NODE_ENV: '"development"' } }
            }),
        ]
    }
};
