const path = require('path');
const WebpackUserScript = require('webpack-userscript');
const tampermonkeyHeaders = require('./tampermonkey-headers')
const packageConfiguration = require('./package')

const devMode = process.env.NODE_ENV === "development";

const webpackUserScript = new WebpackUserScript(
    {
        headers: tampermonkeyHeaders,
        pretty: devMode
    }
);

webpackUserScript.options.headers.authorversion = packageConfiguration.author.name;
webpackUserScript.options.headers.version = devMode ? `[version]-build.[buildNo]` : `[version]`
webpackUserScript.options.headers.name = packageConfiguration.name;
webpackUserScript.options.headers.namespace = packageConfiguration.homepage;
webpackUserScript.options.headers.match = packageConfiguration.tampermonkey.match.baseUrl + "/*";

module.exports = {
    plugins: [
        webpackUserScript
    ],
    entry: './src/index.tsx',
    optimization: {
        minimize: !devMode,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }, {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx', '.css']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: `${packageConfiguration.name}.user.js`
    },
};
