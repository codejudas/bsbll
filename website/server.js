/*
    Main server file for the website using NodeJs and the Express module
 */

var express = require('express');
var fs = require('fs');
var exp_handlebars = require('express-handlebars');
var jsonfile = require('jsonfile');
var bunyan = require('bunyan');

var handlebar_helpers = require('./util/handlebars-helpers.js');
var game_parser = require('./util/game-parser.js');
var standings_parser = require('./util/standings-parser.js');
var util = require('./util/utils.js');

/**
 * CONSTANTS
 */
var REFRESH_RATE = 5 * 60 * 1000; //ms

/**
 * Server variables
 */
var app = express();
var port = process.env.PORT || 6969;
var hbs = exp_handlebars.create({
    partialsDir: 'views/partials',
    extname: '.hbs',
    helpers: handlebar_helpers.load_helpers()
});

var log = bunyan.createLogger({
    name: 'server',
    level: 'TRACE'
});


/**
 * Data in json format for rendering each page
 */
var template_data = {
    "index" : {},           // always empty for now
    "scoreboard" : {},      // populated by game_parser.load_scoreboard
    "standings" : {},       // populated by standings_parser.load_standings
    "teams" : {},           // always empty
    "date": undefined
};

/*
    Helper functions for serving specific pages
 */

/**
 * GET /index
 */
function serve_index(req, res, next){
    res.render("index", template_data["index"]);
    next();
}

/**
 * GET /
 * GET /scoreboard
 * GET /scoreboard?date=mmddyyyy
 */
function serve_scoreboard(req, res, next){
    var date = req.query.date;
    if (date) {
        var parsed_date = util.parse_date(date);
        debugger;
        if (parsed_date.error){
            log.warn("Error parsing date: %s", parsed_date.reason);
            var err = new Error();
            err.status = 400;
            err.msg = "<h1> 400 - Bad Request: " + parsed_date.reason + "</h1>";
            return next(err);
        }

        // check if date is today
        if(!util.date_is_today(parsed_date)){
            log.info("Date is not today");
            // check if scoreboard data already downloaded
            var date_filename = util.pad(parsed_date["month"],2) + util.pad(parsed_date["day"],2) + parsed_date["year"].toString() + ".json";
            var relative_path = "assets/games/"+date_filename;
            try{
                var stat = fs.statSync(relative_path);
                // check if file exists
                if (stat.isFile()){
                    log.info("Found scoreboard data for %s (%s)", date, relative_path);
                    var data = JSON.parse(jsonfile.readFileSync(relative_path, {throws: false, flags:"r"}));
                    if( !data ){
                        // delete + redownload
                        log.warn("%s invalid, re-downloading data.", date_filename);
                        var data = game_parser.load_scoreboard(function(scoreboard){
                            log.debug({scoreboard: scoreboard}, "Loaded scoreboard for %s",date);
                            // save the scoreboard data to the file
                            jsonfile.writeFileSync(relative_path, JSON.stringify(scoreboard));
                            res.render("scoreboard", scoreboard);
                            next();
                        }, parsed_date);
                    }
                    else{
                        // render the loaded data from file
                        log.info("Loaded %s", date_filename);
                        res.render("scoreboard", data);
                        next();
                    }
                }
                else{
                    // 500
                    log.error("%s is not a file.", date_filename);
                    var err = new Error();
                    err.status = 500;
                    err.msg = "<h1> 500 - Internal Error: " + date_filename + " is not a file.";
                    next(err);
                }
            }
            catch(e){
                // File not found exception => need to download that days data
                log.info("%s not found, downloading data for that day.", date_filename);
                // DOWNLOAD DATA FOR THAT DAY
                var data = game_parser.load_scoreboard(function(scoreboard){
                    log.debug({scoreboard: scoreboard}, "Loaded scoreboard for %s", date);
                    // save the scoreboard data to the file
                    jsonfile.writeFileSync(relative_path, JSON.stringify(scoreboard));
                    res.render("scoreboard", scoreboard);
                    next();
                }, parsed_date);
            }
        }
        else{
            log.info("Date is TODAY!!");
            res.render("scoreboard", template_data["scoreboard"]);
            next();
        }

    }
    else{
        log.info("No date specified returning todays games");
        res.render("scoreboard", template_data["scoreboard"]);
        next();
    }
}

/**
 * GET /standings
 */
function serve_standings(req, res, next){
    res.render("standings", template_data["standings"]);
    next();
}

/**
 * GET /teams
 */
function serve_teams(req,res, next){
    // Teams page never changes
    res.render("teams", template_data["teams"]);
    next();
}

/**
 * Returns error page
 */
function serve_error(err, req, res){
    err.status = err.status || 500;
    res.status(err.status);
    log.warn("%s %s - params:%s ip:%s => %d", req.method, req.path, JSON.stringify(req.query), req.ip, res.statusCode);
    res.send(err.msg || "500 - Internal Server Error");
}

/**
 * Periodically checks if the todays scoreboard needs to be refreshed
 */
function update_scoreboard() {
    log.info("Checking if we need to update scoreboard");

    var today = util.get_todays_date();

    // check if the day has changed
    if(util.compare_date(today, template_data.date) != 0){
        template_data.day = today;
        // TODO: Save old day to file
        log.info("==>Its a new day, downloading data for %s", JSON.stringify(today));
        game_parser.load_scoreboard(function(res){
            template_data.scoreboard = res;
            log.info("==> Scoreboard updated");
            setTimeout(update_scoreboard, REFRESH_RATE);
        });
    }
    // check if no games to update
    else if (template_data.scoreboard.games_active == 0){
        log.info("==> Nothing to update");
        setTimeout(update_scoreboard, REFRESH_RATE);
    }
    // there are games that may have changed, do update
    else{
        log.info("==> Updating scoreboard");
        game_parser.load_scoreboard(function(res){
            template_data.scoreboard = res;
            log.info("==> Scoreboard updated");
            setTimeout(update_scoreboard, REFRESH_RATE);
        });
    }
}

/**
 * Configure templating
 */
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

/**
 * Configure routes
 */
app.get('/', serve_scoreboard);
app.get('/index', serve_index);
app.get('/scoreboard', serve_scoreboard);
app.get('/standings', serve_standings);
app.get('/teams', serve_teams);

/* Allow access to static files */
app.use('/assets', express.static("assets/"));
/* favicon */
app.use('/favicon.ico', express.static('favicon.ico'));

/* Basic logging for every request */
app.use('/', function(req, res, next){
    // console.log(req.method + " " + req.path + " - ip: " + req.ip + " ==> " + res.statusCode);
    log.info("%s %s - params:%s ip:%s => %d", req.method, req.path, JSON.stringify(req.query), req.ip, res.statusCode);
    if (res.status == 200)
        next();
    return;
});

/* Handle 404 */
app.get('*', function(req, res, next) {
    var err = new Error();
    err.status = 404;
    err.msg = "<h1> 404 - " + req.path + " Not Found</h1>";
    next(err);
});

/* Error Handler */
app.use(function(err, req, res, next){
    serve_error(err, req, res);
    return;
});

/**
 * Start the Server
 */

// Set the current date
template_data.date = util.get_todays_date();

// Start the server
app.listen(port, function(){
    log.info("===STARTING SERVER===");
    log.info("Listening on port %d", port);
    log.info("Scoreboard refresh rate: %d s", (REFRESH_RATE / 1000));
    log.info("Todays Date: %s", JSON.stringify(template_data.date));
    log.info("Root dir: %s", __dirname);
});

// Asynchronously get scoreboard
game_parser.load_scoreboard(function(res){
    template_data.scoreboard = res;

    setTimeout(update_scoreboard, REFRESH_RATE);
});

// Asynchronously get standings
standings_parser.load_standings(function(res){
    template_data.standings = res;
});

