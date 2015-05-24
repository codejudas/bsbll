/*Game Parser*/

var http = require("http");
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');

var PITCHER_PATH_PREFIX = "../assets/img/players/";
var GAMES = [];
var team_abbreviation = {
    "Batlimore" : "bal",
    "Boston" : "bos",
    "NY Yankees" : "nyy",
    "Tampa Bay" : "tam",
    "Toronto" : "tor",
    "Chi White Sox": "chw",
    "Cleveland" : "cle",
    "Detroit" : "det",
    "Kansas City" : "kan",
    "Minnesota": "min",
    "Houston" : "hou",
    "LA Angels": "laa",
    "Oakland" : "oak",
    "Seattle" : "sea",
    "Texas" : "tex",
    "Atlanta" : "atl",
    "Miami": "mia",
    "NY Mets": "nym",
    "Philadelphia" : "phi",
    "Washington": "was",
    "Chi Cubs": "chc",
    "Cincinnati": "cin",
    "Milwaukee": "mil",
    "Pittsburgh": 'pit',
    "St. Louis": "stl",
    "Arizona": "ari",
    "Colorado": "col",
    "LA Dodgers": "lad",
    "San Diego": "sdg",
    "San Francisco": "sfo"
}

function load_scores(){
    console.log("Loading scores...");
    // Get todays date first
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd
    if(mm<10) mm='0'+mm
    console.log("Date: "+mm+"/"+dd+"/"+yyyy);

    // Build path
    var p = "/components/game/mlb/year_"+yyyy+"/month_"+mm+"/day_"+dd+"/master_scoreboard.json";
    console.log("using path='"+p+"'");

    // Build http req
    var opts = {
        host: "gd2.mlb.com",
        port: 80,
        path: p
    }

    http.get(opts, function(res) {
      console.log("Got response: " + res.statusCode);
      var resp_content = "";
      res.on("data",function(chunk){
        resp_content += chunk;
      });

      res.on("end",function(){
        // move on to parsing the response
        parse_scores(resp_content);
      });

    }).on('error', function(e) {
      console.log("ERROR: " + e.message);
    });
}

function parse_scores(response_text){
    console.log("Parsing Response...");

    var obj = JSON.parse(response_text);
    var game_data = obj["data"]["games"]["game"];

    for(var i in game_data){
        // Cherry pick information we need
        var g = game_data[i];
        var data = {};
        data["away_team"] = g["away_team_city"];
        data["home_team"] = g["home_team_city"];
        data["away_rec"] = g["away_win"] + " - " +g["away_loss"];
        data["home_rec"] = g["home_win"] + " - " +g["home_loss"];
        data["status"] = g["status"]["status"];

        // Get Data for in progress game
        if(data["status"] === "In Progress" || data["status"] === "Delayed Start"){
            data["status"] = "LIVE";
            data["away_score"] = g["linescore"]["r"]["away"];
            data["home_score"] = g["linescore"]["r"]["home"];

            data["inning"] = g["status"]["inning_state"]+" "+g["status"]["inning"];
            data["pitcher"] = g["pitcher"]["first"] + " " + g["pitcher"]["last"];
        }
        // Get Data for Final Game
        else if(data["status"] === "Game Over" || data["status"] === "Final" || data["status"] === "Completed Early"){
            data["status"] = "FINAL";
            data["away_score"] = g["linescore"]["r"]["away"];
            data["home_score"] = g["linescore"]["r"]["home"];
            // Check if game went to extra innings
            if(parseInt(g["status"]["inning"]) > 9){
                data["status"] += " - " + g["status"]["inning"];
            }
            // Find winning and losing pitchers
            if(parseInt(data["away_score"]) < parseInt(data["home_score"])){
                data["winner"] = "home";
                data["away_pitcher"] = g["losing_pitcher"]["first"] + " " + g["losing_pitcher"]["last"];
                data["away_pitcher_rec"] = g["losing_pitcher"]["wins"] + " - " + g["losing_pitcher"]["losses"];
                data["away_pitcher_era"] = g["losing_pitcher"]["era"];
                data["home_pitcher"] = g["winning_pitcher"]["first"] + " " +g["winning_pitcher"]["last"];
                data["home_pitcher_rec"] = g["winning_pitcher"]["wins"] + " - " + g["winning_pitcher"]["losses"];
                data["home_pitcher_era"] = g["winning_pitcher"]["era"];

            }
            else{
                data["winner"] = "away";
                data["away_pitcher"] = g["winning_pitcher"]["first"] + " " +g["winning_pitcher"]["last"];
                data["away_pitcher_rec"] = g["losing_pitcher"]["wins"] + " - " + g["losing_pitcher"]["losses"];
                data["away_pitcher_era"] = g["losing_pitcher"]["era"];
                data["home_pitcher"] = g["losing_pitcher"]["first"] + " "+ g["losing_pitcher"]["last"];
                data["home_pitcher_rec"] = g["winning_pitcher"]["wins"] + " - " + g["winning_pitcher"]["losses"];
                data["home_pitcher_era"] = g["winning_pitcher"]["era"];
            }
            // Load pitcher images if they havent already been downloaded
            get_pitcher_image(data["away_pitcher"], data["away_team"]);
            get_pitcher_image(data["home_pitcher"], data["home_team"]);
        }
        // Get Data for upcoming game
        else{
            console.log("Game Status = "+data["status"]);
            var away_pitcher, home_pitcher;
            if(data["status"] === "Preview"){
                away_pitcher = "away_probable_pitcher";
                home_pitcher = "home_probable_pitcher";
            }
            else{
                away_pitcher = "pitcher";
                home_pitcher = "oposing_pitcher";
            }
            data["away_pitcher"] = g[away_pitcher]["first"] + " " +g[away_pitcher]["last"];
            data["away_pitcher_rec"] = g[away_pitcher]["wins"] + " - " + g[away_pitcher]["losses"];
            data["away_pitcher_era"] = g[away_pitcher]["era"];
            get_pitcher_image(data["away_pitcher"], data["away_team"]);
            data["home_pitcher"] = g[home_pitcher]["first"] + " "+ g[home_pitcher]["last"];
            data["home_pitcher_rec"] = g[home_pitcher]["wins"] + " - " + g[home_pitcher]["losses"];
            data["home_pitcher_era"] = g[home_pitcher]["era"];
            get_pitcher_image(data["home_pitcher"], data["home_team"]);
            data["status"] = "UPCOMING";
        }

        GAMES.push(data);
    }

    print_scores();
}

function print_scores(){
    console.log("Printing collected data...");
    console.log(GAMES);
}

// Checks if we already have pitcher's image, if not downloads the image from espn
function get_pitcher_image(pitcher_name, team){
    console.log("Looking for pitcher "+pitcher_name);
    var path = PITCHER_PATH_PREFIX + pitcher_name.split(" ").join("").toLowerCase()+".png";
    console.log("path="+path);
    fs.open(path,'r',function(err,fd){
        if (err && err.code=='ENOENT') download_image(pitcher_name, team, path);
        else console.log("Already have file "+path);
    });
}

function download_image(pitcher_name, team, fname){
    var uri = "http://espn.go.com/mlb/teams/roster?team="+ team_abbreviation[team];
    console.log("team uri="+uri);
    // Go to roster page to find player
    request(uri, function(err,res,body){
        if(!err && res.statusCode == 200){
            console.log("success");
            var $ = cheerio.load(body);
            console.log("num pitchers="+$(".evenrow, .oddrow","table").length);
            // Find the player
            $(".evenrow, .oddrow").each(function(i,elem){
                var $pitcher = $(this).find("a");
                if($pitcher.text().toLowerCase() === pitcher_name.toLowerCase()){
                    // Go to player page
                    uri = $pitcher.attr("href");
                    console.log("player uri="+uri);

                    request(uri, function(err, res, body){
                        if(!err && res.statusCode == 200){
                            console.log("success");
                            $ = cheerio.load(body);
                            var $pic = $(".main-headshot").children().first();
                            console.log("pic url="+$pic.attr("src"));
                            if(!$pic.attr("src")){
                                console.log("ERROR: player "+pitcher_name+" has no picture, skipping");
                                return;
                            }
                            uri = $pic.attr("src");
                            var filename = fname;
                            // Download image and save it as a file
                            request.head(uri, function(err, res, body){
                                console.log('content-type:', res.headers['content-type']);
                                console.log('content-length:', res.headers['content-length']);

                                request(uri).pipe(fs.createWriteStream(filename)).on('close', function(){
                                    console.log("Downloaded image for "+pitcher_name + " to "+filename);
                                });
                            });
                        }
                        else{
                            console.log("Error getting to pitcher page");
                        }
                    });

                    // Stop the loop
                    return false;
                }
            });
        }
        else{
            console.log("error response");
        }
    });
    
}

console.log("Starting...");
load_scores();