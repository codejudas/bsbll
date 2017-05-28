"use strict";

import * as express from 'express';
import * as bunyan from 'bunyan';
import * as proc from 'process';
import * as cron from 'node-cron';

import { loadScores } from './scoreboard/loader';
import { toFileName } from './common/util';

var log = bunyan.createLogger({
    name: 'server',
    level: 'TRACE'
});

/**
 * Setup Web App
 */
const app = express();
const port = proc.env.PORT || 6969;

/**
 * Setup Routes
 */

// GET / 
app.get('/', (req, res, next) => {
    res.send('Hey!');
    next();
});

// GET /api/scoreboard
app.get('/api/scoreboard', (req, res, next) => {
    let date = new Date();
    let url = `/api/scoreboard/${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
    res.redirect(url);
    next();
});

// GET /api/scoreboard/:date
app.get('/api/scoreboard/:date', (req, res, next) => {
    log.info(`DATE: ${req.params.date}`);
    let date = new Date(req.params.date);
    loadScores(date).then(
        (scoreboard) => {
            res.send(scoreboard);
            next();
        },
        (err) => {
            next(err);
        }
    );
});

/**
 * Serve web and img files
 */
app.use('/assets/js/web', express.static('./build/web'));
app.use('/assets/js/common', express.static('./build/common'));
app.use('/assets/img/pitchers', express.static('./data/pitchers'));


/**
 * Log Every Request
 */
app.use((req, res, next) => {
    log.info("%s %s - params:%s ip:%s => %d", req.method, req.path, JSON.stringify(req.query), req.ip, res.statusCode);
    next();
});

/**
 * Start Server
 */
app.listen(port, () => {
    log.info("===STARTING SERVER===");
    log.info("Listening on port %d", port);
});

/**
 * Job to update scores
 */
// cron.schedule('0 * * * * *', () => {
//     let date = new Date();
//     log.info(`Updating scoreboard for date: ${date.toISOString()}...`);
//     loadScores(date, true).then(
//         (scoreboard) => {},
//         (err) => { log.error(`Failed to update scoreboard for date ${date.toISOString()}`)}
//     );
// });

