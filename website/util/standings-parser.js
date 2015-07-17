/*Standings Parser
    
    Should be called by the server script periodically.
    Downloads the current mlb standings from erikberg.com in json formats and cherry picks necessary information.
    Thanks to Erik Berg for making his API available for free.
*/

var https = require("https");
var request = require('request');

var api_host = "erikberg.com";
var api_path = "/mlb/standings.json";
var user_agent_str = "Evan Fossier (evan.fossier@yahoo.com)";
var result = {
    nl: {
        west: [],
        central:[],
        east:[]
    },
    al: {
        west: [],
        central: [],
        east: []
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

function get_standings(callback){
    console.log("Downloading standings data from: "+api_host+api_path);

    // Build http req
    var opts = {
        host: api_host,
        port: 443,
        path: api_path,
        headers:{
            'User-Agent': user_agent_str
        }
    }

    https.get(opts, function(res) {
      console.log("Got response: " + res.statusCode);
      var resp_content = "";
      res.on("data",function(chunk){
        resp_content += chunk;
      });

      res.on("end",function(){
        // move on to parsing the response
        parse_standings(resp_content, callback);
      });

    }).on('error', function(e) {
      console.log("ERROR: " + e.message);
    });
}

function parse_standings(response_text, callback){
    console.log("Parsing Response...");
    console.log(response_text);
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
        else division = league.east;

        var index = entry["rank"] - 1;
        if(index < division.length)
            division.splice(index,0,entry);
        else
            division.push(entry);
    }

    console.log("===Done Loading Score Board Information===");
    print_results();
    callback(result);
}

function print_results(){
    console.log("NL:");
    console.log(result.nl.west);
    console.log(result.nl.central);
    console.log(result.nl.east);
    
    console.log("AL:");
    console.log(result.al.west);
    console.log(result.al.central);
    console.log(result.al.east);
}

/*
    PUBLIC METHOD CALLED BY SERVER SCRIPT
 */

exports.load_standings = function(callback){
    console.log("===Loading Standings Information===");
    get_standings(callback);
}