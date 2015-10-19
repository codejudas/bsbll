/*
    Main server file for the website using NodeJs and the Express module
 */

var express = require('express');
var exp_handlebars = require('express-handlebars');
var game_parser = require('./util/game-parser.js');
var standings_parser = require('./util/standings-parser.js');
var app = express();
var port = process.env.PORT || 6969;
var assets_path = "assets";

/*
    Data in json format for rendering each page
 */

var template_data = {
    "index" : {},
    "scoreboard" : {},
    "standings" : {},
    "teams" : {}
}

/*
    Helper functions for serving specific pages
 */

function serve_index(req, res){
    console.log("Received request for index.html");
    res.render("index", template_data["index"]);
}

function serve_scoreboard(req, res){
    console.log("Received request for scoreboard.html");
    res.render("scoreboard", template_data["scoreboard"]);
}

function serve_standings(req, res){
    console.log("Received request for standings.html");
    res.render("standings", template_data["standings"]);
}

function serve_teams(req,res){
    console.log("Received request for teams.html");
    // Teams page never changes
    res.render("teams", template_data["teams"]);
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

/* Load current data */
game_parser.load_scoreboard(function(res){
    template_data.scoreboard = res;

    /* Load standings next */
    standings_parser.load_standings(function(res){
        template_data.standings = res;

        // Start the server
        app.listen(port, function(){
            console.log("===STARTING SERVER===");
            console.log("Listening on port "+port);
            console.log("Root dir: "+__dirname);
        });
    });
});

