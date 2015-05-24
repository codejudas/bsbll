/*
    Main server file for the website using NodeJs and the Express module
 */

var express = require('express');
var handlebars = require('handlebars');
var app = express();
var port = 6969;
var assets_path = "assets";

/*
    Helper functions for serving specific pages
 */

function serve_index(req, res){
    console.log("Received request for index.html");
    res.sendFile("index.html", {root: __dirname+"/.."});
}

function serve_scoreboard(req, res){
    console.log("Received request for scoreboard.html");
    res.sendFile("scoreboard.html", {root: __dirname+"/.."});
}

function serve_standings(req, res){
    console.log("Received request for standings.html");
    res.sendFile("standings.html", {root: __dirname+"/.."});
}

function serve_teams(req,res){
    console.log("Received request for teams.html");
    res.sendFile("teams.html", {root: __dirname+"/.."});
}

app.get('/', serve_index);
app.get('/index', serve_index);
app.get('/index.html', serve_index);
app.get('/scoreboard', serve_scoreboard);
app.get('/scoreboard.html', serve_scoreboard);
app.get('/standings', serve_standings);
app.get('/standings.html', serve_standings);
app.get('/teams', serve_teams);
app.get('/teams.html', serve_teams);

/* Allow access to static files */
app.use('/assets', express.static(assets_path));

app.listen(port, function(){
    console.log("Listening on port "+port);
});
