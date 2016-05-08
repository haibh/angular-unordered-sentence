var webpack           = require('webpack'),
    path              = require('path'),
    pathNodeModules   = path.resolve(__dirname, 'node_modules'),
    pathVendor        = path.resolve(__dirname, './'),
    PluginExtractText = require("extract-text-webpack-plugin");

module.exports = function (options) {
    options         = options || {};
    var
        bowerPath   = options.bowerPath || './www/lib/',
        pathAngular = path.resolve(__dirname, bowerPath),
        plugins = [
            new PluginExtractText('[name].css', {allChunks: true}),
            new webpack.NoErrorsPlugin()
        ];

    if (options.minify) {
        plugins.push(new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        }));
    }

    return [{
        entry  : {
            vendor   : [path.resolve(__dirname, './vendor.js')],
            directive: [
                path.resolve(__dirname, bowerPath + 'sortable/ng-sortable.js'),
                path.resolve(__dirname, './directive.js')
            ]
        },
        output : {
            path      : path.resolve(__dirname, './dist'),
            publicPath: './dist',
            filename  : '[name].js'
        },
        resolve: {
            root: [
                pathVendor,
                pathNodeModules,
                pathAngular
            ]
        },
        module : {
            loaders: [
                {
                    test   : /\.jsx?$/,
                    loader : 'babel',
                    exclude: pathNodeModules,
                    query  : {
                        presets: ['es2015', 'stage-0', 'react'],
                        compact: false
                    }
                },
                {
                    test  : /\.css$/,
                    loader: PluginExtractText.extract('style-loader', 'css-loader')
                },
                {
                    test   : /\.scss$/,
                    include: [
                        path.resolve(__dirname, './node_modules/compass-mixins/lib'),
                        path.resolve(__dirname, './sass/')
                    ],
                    loader : PluginExtractText.extract('style-loader', 'raw-loader!sass-loader')
                },
                {
                    test  : /\.(png|jpg|gif|bmp|jpeg|svg)$/,
                    loader: 'file-loader?limit=25000&name=images/[name].[ext]'
                },
                {
                    test  : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "file-loader?limit=10000&name=fonts/[name].[ext]"
                },
                {
                    test  : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    loader: "file-loader?limit=10000&name=fonts/[name].[ext]"
                }
            ]
        },
        plugins: plugins
    }]
};
