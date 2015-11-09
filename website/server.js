/*
    Main server file for the website using NodeJs and the Express module
 */

var express = require('express');
var fs = require('fs');
var exp_handlebars = require('express-handlebars');
var jsonfile = require('jsonfile');
var game_parser = require('./util/game-parser.js');
var standings_parser = require('./util/standings-parser.js');
var util = require('./util/utils.js');

var app = express();
var port = process.env.PORT || 6969;
var assets_path = "assets";

var REFRESH_RATE = 1 * 60 * 1000; //ms

/*
    Data in json format for rendering each page
 */

var template_data = {
    "index" : {},
    "scoreboard" : {},
    "standings" : {},
    "teams" : {},
    "date": undefined
};

/*
    Helper functions for serving specific pages
 */

function serve_index(req, res, next){
    res.render("index", template_data["index"]);
    next();
}

function serve_scoreboard(req, res, next){
    var date = req.query.date;
    console.log("==>Date: "+date);
    console.log("test");
    if (date) {
        console.log("parsing date");
        var parsed_date = util.parse_date(date);
        console.log("Parsed date:"+JSON.stringify(parsed_date));
        debugger;
        if (parsed_date.error){
            console.log("Error parsing date: "+ error.reason);
            var err = new Error();
            err.status = 400;
            err.msg = "<h1> 400 - Bad Request: " + parsed_date.reason + "</h1>";
            next(err);
        }

        // check if date is today
        if(!util.date_is_today(parsed_date)){
            // check if scoreboard data already downloaded
            var date_filename = util.pad(parsed_date["month"],2) + util.pad(parsed_date["day"],2) + parsed_date["year"].toString() + ".json";
            var relative_path = "assets/games/"+date_filename;
            try{
                var stat = fs.statSync(relative_path);
                if (stat.isFile()){
                    console.log("Found scoreboard data for "+date_filename);
                    var data = jsonfile.readFileSync(relative_path, {throws: false, flags:"r"});
                    if( !data ){
                        console.log(date_filename + " is invalid, redownloading");
                        // delete + redownload
                    }
                    else{
                        console.log(date_filename+" loaded.");
                        res.render("scoreboard", data);
                        next();
                    }
                }
                else{
                    console.log(date_filename + " is not a file.");
                    var err = new Error();
                    err.status = 500;
                    err.msg = "<h1> 500 - Internal Error: " + date_filename + " is not a file.";
                    next(err);
                }
            }
            catch(e){
                console.log(date_filename + " not found, downloading data for that day.");
                res.render("scoreboard", template_data["scoreboard"]);
                next();
            }
        }
        else{
            console.log("Date is TODAY!!");
            res.render("scoreboard", template_data["scoreboard"]);
            next();
        }

    }
    else{
        console.log("No date specified returning todays games");
        res.render("scoreboard", template_data["scoreboard"]);
        next();
    }
}

function serve_standings(req, res, next){
    res.render("standings", template_data["standings"]);
    next();
}

function serve_teams(req,res, next){
    // Teams page never changes
    res.render("teams", template_data["teams"]);
    next();
}

function serve_error(err, req, res){
    console.log("Sending Error Code "+ err.status);
    res.status(err.status);
    console.log(req.method + " " + req.path + " - ip: " + req.ip + " ==> " + res.statusCode);
    res.send(err.msg);
}

/**
 * Periodically checks if the todays scoreboard needs to be refreshed
 */
function update_scoreboard() {
    console.log("Checking if we need to update scoreboard");

    // check if the day has changed
    var today = util.get_todays_date();
    if(util.compare_date(today, template_data.date) != 0){
        template_data.day = today;
        // TODO: Save old day to file
        console.log("==>Its a new day, redownloading data");
        game_parser.load_scoreboard(function(res){
            template_data.scoreboard = res;
            console.log("==> Scoreboard updated");
            setTimeout(update_scoreboard, REFRESH_RATE);
        });
    }
    // check if no games to update
    else if (template_data.scoreboard.games_active && template_data.scoreboard.games_active == 0){
        console.log("==> Nothing to update");
        return setTimeout(update_scoreboard, REFRESH_RATE);
    }

    console.log("==> Updating scoreboard");
    game_parser.load_scoreboard(function(res){
        template_data.scoreboard = res;
        console.log("==> Scoreboard updated");
        setTimeout(update_scoreboard, REFRESH_RATE);
    });
}

/*
    Configure templating
 */
app.engine('hbs', exp_handlebars({ext:".hbs"}));
app.set('view engine', 'hbs');

app.get('/', serve_scoreboard);
app.get('/index', serve_index);
app.get('/scoreboard', serve_scoreboard);
app.get('/standings', serve_standings);
app.get('/teams', serve_teams);

/* Allow access to static files */
app.use('/assets', express.static(assets_path));

/*
    Basic logging for every request
 */
app.use("/", function(req, res, next){
    console.log(req.method + " " + req.path + " - ip: " + req.ip + " ==> " + res.statusCode);
    if (res.status == 200)
        next();
    return;
});

// 404
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

// Set the date
template_data.date = util.get_todays_date();

// Start the server
app.listen(port, function(){
    console.log("===STARTING SERVER===");
    console.log("Listening on port "+port);
    console.log("Refresh rate: "+ (REFRESH_RATE / 1000) + "s");
    console.log("Todays Date: " + JSON.stringify(template_data.date));
    console.log("Root dir: "+__dirname);
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

