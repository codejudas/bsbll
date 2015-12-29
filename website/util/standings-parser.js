/**
    Standings Parser
    
    Should be called by the server script periodically.
    Downloads the current mlb standings from erikberg.com in json formats and cherry picks necessary information.
    Thanks to Erik Berg for making his API available for free.
*/

var request = require('request');

/* Constants */
var USER_AGENT = "Evan Fossier (evan.fossier@yahoo.com)";
var HTTP_TIMEOUT = 5 * 1000; //ms
var STANDINGS_URI = "https://erikberg.com/mlb/standings.json";

/* The standings data structure */
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

/**
 * Makes http request to load standings from erikberg.com
 */
function get_standings(callback){
    console.log("Downloading standings data from: " + STANDINGS_URI);

    var opts = {
        timeout: HTTP_TIMEOUT,
        headers: {'User-Agent': USER_AGENT}
    }
    request.get(STANDINGS_URI, opts, function(err, res, body){
        if (err || res.statusCode !== 200) { 
            if (res) console.log("ERROR: Received " + res.statusCode + " while trying to load standings");
            else console.log(err);
            // return empty standings
            callback(result);
        }
        else{
            parse_standings(body);
            process_wildcards();
            console.log("===Done Loading Standings Information===");
            print_results();
        }

        // return standings to caller
        callback(result);
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

/*
    PUBLIC METHOD CALLED BY SERVER SCRIPT
 */

exports.load_standings = function(callback){
    console.log("===Loading Standings Information===");
    get_standings(callback);
}
