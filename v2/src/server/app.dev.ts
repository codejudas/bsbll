import * as bunyan from 'bunyan';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';

const webpackConfig = require('../../webpack.config.dev.js');
const webpackCompiler = webpack(webpackConfig);

/* Enable webpack middleware for hot-reloads in development */
export function enableWebpackHMR(app) {
    app.use(webpackDevMiddleware(webpackCompiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
            colors: true,
            /* chunks: false, // this reduces the amount of stuff I see in my terminal; configure to your needs*/
            'errors-only': true
        }
    }));

    var log = bunyan.createLogger({
        name: 'webpack-hmr',
        level: 'TRACE'
    });

    app.use(webpackHotMiddleware(webpackCompiler, {
        log: log.info
    }));
 
    return app;
}