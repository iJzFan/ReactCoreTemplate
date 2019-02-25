const path = require('path');
const webpack = require('webpack');

// variables
const sourcePath = path.join(__dirname, '../src');
const outPath = path.join(__dirname, '../build');

// plugins
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const extractMoudleScssPlugin = new ExtractTextPlugin('module.[md5:contenthash:hex:20].css');
const extractGlobalScssPlugin = new ExtractTextPlugin('global.[md5:contenthash:hex:20].css');

// utils
const resolveSassRules = require('./utils/resolveSassRules');

const resolveSource = (...args) => path.resolve(sourcePath, ...args);
const resolveAlias = {
    '@shared': resolveSource('shared'),
    '@styles': resolveSource('styles'),
    '@utils': resolveSource('utils'),
    '@store': resolveSource('store'),
    '@components': resolveSource('components'),
    '@services': resolveSource('services')
}

// style files regexes
const sassRegex = /\[^.module].(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = {
    context: sourcePath,
    entry: {
        app: './boot-client.tsx'
    },
    output: {
        path: outPath,
        filename: 'bundle.js',
        chunkFilename: '[name].[hash].bundle.js',
        publicPath: '/'
    },
    target: 'web',
    resolve: {
        extensions: ['.js', 'jsx', '.json', '.ts', '.tsx'],
        alias: resolveAlias
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: ['ts-loader'],
                exclude: /node_modules/
            },
            resolveSassRules({
                test: sassModuleRegex,
                cssLoader: 'typings-for-css-modules-loader',
                localIdentName: '[name]__[local]___[hash:base64:5]',
                extractPlugin: extractMoudleScssPlugin
            }),
            resolveSassRules({
                test: sassRegex,
                cssLoader: 'typings-for-css-modules-loader',
                localIdentName: '[name]',
                extractPlugin: extractGlobalScssPlugin
            })
        ]
    },
    plugins: [
        new webpack.WatchIgnorePlugin([/css\.d\.ts$/]),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin(),
        new WebpackCleanupPlugin(),
        extractMoudleScssPlugin,
        extractGlobalScssPlugin,
    ]
};