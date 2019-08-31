const path = require('path');
const WebpackUserScript = require('webpack-userscript');

module.exports = {
    plugins: [
        new WebpackUserScript(
            {
                headers: path.join(__dirname, 'tampermonkey-headers.json'),
                pretty: true
            }
        )
    ],
    entry: './src/bookingSummarizer.js',
    optimization: {
        minimize: false,

    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
};