const path = require('path');

module.exports = {
    entry: path.join(__dirname, 'public' ,'client.js'),
    output: {
        filename: 'client.build.js',
        path: path.join(__dirname, 'public'),
    },
    resolve: {
        extensions: ['.json', '.js', '.jsx', '.css']
    },
    devtool: 'source-map',
    mode: 'development'
};