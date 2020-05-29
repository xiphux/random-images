const path = require('path');
const slsw = require('serverless-webpack');
const webpack = require('webpack');
const fs = require('fs');

const fallback = slsw.lib.serverless.service.custom.fallbackImage || undefined;

module.exports = {
    entry: slsw.lib.entries,
    resolve: {
        extensions: ['.mjs', '.js', '.json', '.ts', '.tsx'],
        alias: {
            '@': path.join(__dirname, '..'),
        }
    },
    mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, '.webpack'),
        filename: '[name].js',
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    },
                ],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            IMAGE_LIST: JSON.stringify({
                images: fs.readdirSync('public/images').filter((f) => f !== fallback && !f.startsWith('.')),
                fallback,
            }),
            IMAGE_REFERERS: JSON.stringify(slsw.lib.serverless.service.custom.referers || []),
        }),
    ]
};