var webpack = require('webpack')
var path = require('path')

module.exports = {
    entry: __dirname + '/src/js/app.js',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: __dirname + '/public/dist',
        publicPath: __dirname + '/public',
        filename: 'bundle.js'
    },
    watchOptions: {
        ignored: /node_modules/
    }
}