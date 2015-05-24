/*
    Main server file for the website using NodeJs and the Express module
 */

var express = require('express');
var exp_handlebars = require('express-handlebars');
var app = express();
var port = 6969;
var assets_path = "assets";

/*
    Helper functions for serving specific pages
 */

function serve_index(req, res){
    console.log("Received request for index.html");
    res.render("index", {});
}

function serve_scoreboard(req, res){
    console.log("Received request for scoreboard.html");
    res.render("scoreboard", {});
}

function serve_standings(req, res){
    console.log("Received request for standings.html");
    res.render("standings", {});
}

function serve_teams(req,res){
    console.log("Received request for teams.html");
    // Teams page never changes
    res.render("teams", {});
}

/*
    Configure templating
 */
app.engine('hbs', exp_handlebars({ext:".hbs"}));
app.set('view engine', 'hbs');

app.get('/', serve_index);
app.get('/index', serve_index);
app.get('/scoreboard', serve_scoreboard);
app.get('/standings', serve_standings);
app.get('/teams', serve_teams);

/* Allow access to static files */
app.use('/assets', express.static(assets_path));

app.listen(port, function(){
    console.log("Listening on port "+port);
    console.log("Root dir: "+__dirname);
});
