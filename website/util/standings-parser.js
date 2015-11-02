/*Standings Parser
    
    Should be called by the server script periodically.
    Downloads the current mlb standings from erikberg.com in json formats and cherry picks necessary information.
    Thanks to Erik Berg for making his API available for free.
*/

var https = require("https");
var request = require('request');

var api_host = "erikberg.com";
var reg_standings_path = "/mlb/standings.json";
var wildcard_path = "/mlb/wildcard.json";
var user_agent_str = "Evan Fossier (evan.fossier@yahoo.com)";

var poll_interval = 500; // ms
var poll_timeout = 10 * 1000; //s * 1000 = ms

var result = {
    nl: {
        west: [],
        central:[],
        east:[],
        wildcard: []
    },
    al: {
        west: [],
        central: [],
        east: [],
        wildcard: []
    }
}

var team_abbreviation = {
    "Baltimore Orioles" : "bal",
    "Boston Red Sox" : "bos",
    "New York Yankees" : "nyy",
    "Tampa Bay Rays" : "tam",
    "Toronto Blue Jays" : "tor",
    "Chicago White Sox": "chw",
    "Cleveland Indians" : "cle",
    "Detroit Tigers" : "det",
    "Kansas City Royals" : "kan",
    "Minnesota Twins": "min",
    "Houston Astros" : "hou",
    "Los Angeles Angels": "laa",
    "Oakland Athletics" : "oak",
    "Seattle Mariners" : "sea",
    "Texas Rangers" : "tex",
    "Atlanta Braves" : "atl",
    "Miami Marlins": "mia",
    "New York Mets": "nym",
    "Philadelphia Phillies" : "phi",
    "Washington Nationals": "was",
    "Chicago Cubs": "chc",
    "Cincinnati Reds": "cin",
    "Milwaukee Brewers": "mil",
    "Pittsburgh Pirates": 'pit',
    "St. Louis Cardinals": "stl",
    "Arizona Diamondbacks": "ari",
    "Colorado Rockies": "col",
    "Los Angeles Dodgers": "lad",
    "San Diego Padres": "sdg",
    "San Francisco Giants": "sfo"
};

/*
    PRIVATE METHODS
 */

function get_standings(path){
    console.log("Downloading standings data from: " + api_host + path);

    // Build http req
    var opts = {
        host: api_host,
        port: 443,
        path: path,
        headers:{
            'User-Agent': user_agent_str
        }
    }

    https.get(opts, function(res) {
      console.log("Got response: " + res.statusCode);
      if (res.statusCode >= 300){
        console.log("ERROR: Received " + res.statusCode + " on  URL: " + api_host + path);
        return;
      }
      var resp_content = "";
      res.on("data",function(chunk){
        resp_content += chunk;
      });

      res.on("end",function(){
        // move on to parsing the response
        parse_standings(resp_content);
      });

    }).on('error', function(e) {
      console.log("ERROR: " + e.message);
    });
}

function parse_standings(response_text){
    console.log("Parsing Response...");
    var obj = JSON.parse(response_text);
    var standings = obj["standing"];

    // standings should be an array containing every team not necessarily in correct order
    for(var i in standings){
        var t = standings[i];
        var entry = {};
        entry["rank"] = t["rank"];
        entry["won"] = t["won"];
        entry["lost"] = t["lost"];
        entry["disp_name"] = t["first_name"] + " " + t["last_name"];
        entry["team_abbrv"] = team_abbreviation[entry["disp_name"]];
        entry["streak"] = t["streak"];
        entry["games_back"] = t["games_back"];
        entry["win_percent"] = t["win_percentage"];

        // Place the entry into correct position in its division/league
        var league;
        if(t["conference"] === "AL") league = result.al;
        else league = result.nl;

        var div;
        if(t["division"] === "W") division = league.west;
        else if(t["division"] === "C") division = league.central;
        else if(t["division"] === "E") division = league.east;
        else division = leage.wildcard;

        // Insert into regular standings
        var index = entry["rank"] - 1;
        if(index < division.length)
            division.splice(index,0,entry);
        else
            division.push(entry);

        // Insert into wildcard standings
        if (entry["rank"] > 1){
            var copy_entry = JSON.parse(JSON.stringify(entry));
            league.wildcard.push(copy_entry);
        }
    }
}

function print_results(){
    console.log("NL:");
    console.log(result.nl.west);
    console.log(result.nl.central);
    console.log(result.nl.east);
    console.log(result.nl.wildcard);
    
    console.log("AL:");
    console.log(result.al.west);
    console.log(result.al.central);
    console.log(result.al.east);
    console.log(result.al.wildcard);
}

function fix_gamesback(standing){
    var top_win = standing[1]["won"];
    var top_loss = standing[1]["lost"];

    standing[0]["games_back"] = 0.0;
    standing[1]["games_back"] = 0.0;

    for (var i = 2; i < standing.length; i++){
        var team = standing[i];
        var games_back = 0.0;
        games_back = games_back + ((top_win - team["won"])/2);
        games_back = games_back + ((team["lost"] - top_loss)/2);
        team["games_back"] = games_back;
    }
}

/**
 * Sort the wildcard standings into order and fix games back
 * @return {[type]} [description]
 */
function process_wildcards(){
    var comparator = function(a, b){
        if (a["win_percent"] === b["win_percent"])
            return 0;
        else
            return parseFloat(a["win_percent"]) > parseFloat(b["win_percent"]) ? -1 : 1;
    }

    // Calculate correct GBs
    var leagues = ["nl", "al"];
    for (var i in leagues){
        var league = leagues[i];
        result[league].wildcard.sort(comparator);
        fix_gamesback(result[league]["wildcard"]);
    }
}

/**
 * Polls the results until the standings are ready then calls the callback which will pass the result back to the main server script
 * @param  {Function} callback receives 
 * @return {[type]}            [description]
 */
function wait_til_standings_ready(callback){
    var is_ready = result.nl.west.length > 0;
    is_ready = is_ready && result.nl.central.length > 0;
    is_ready = is_ready && result.nl.east.length > 0;
    is_ready = is_ready && result.nl.wildcard.length > 0;

    is_ready = is_ready && result.al.west.length > 0;
    is_ready = is_ready && result.al.central.length > 0;
    is_ready = is_ready && result.al.east.length > 0;
    is_ready = is_ready && result.al.wildcard.length > 0;

    if (is_ready) {
        console.log("===Done Loading Standings Information===");
        process_wildcards();
        print_results();
        callback(result);
    }
    else{
        if (poll_timeout <= 0) {
            console.log("===Timed Out Loading Standings Information===")
            callback(result);
            return;
        }
        poll_timeout = poll_timeout - poll_interval; //not exactly precise but good enough.
        setTimeout(function(){ wait_til_standings_ready(callback); }, poll_interval);
    }
}

/*
    PUBLIC METHOD CALLED BY SERVER SCRIPT
 */

exports.load_standings = function(callback){
    console.log("===Loading Standings Information===");
    get_standings(reg_standings_path);

    // Poll the result object to verify completion
    wait_til_standings_ready(callback);
}
