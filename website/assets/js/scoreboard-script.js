/* JAVASCRIPT FOR SCOREBOARD PAGE
        REQUIRE JQUERY AND MASONRY
*/

/*
    SCOREBOARD GLOBAL VARIABLES
 */
var $MASONRY_CONTAINER;
var DISPLAY_NL;
var DISPLAY_AL;
var team_leagues = {
    "tam": "al",
    "nyy": "al",
    "bos": "al",
    "bal": "al",
    "tor": "al",
    "kan": "al",
    "det": "al",
    "chw": "al",
    "min": "al",
    "cle": "al",
    "hou": "al",
    "laa": "al",
    "oak": "al",
    "sea": "al",
    "tex": "al",
    "stl": "nl",
    "chc": "nl",
    "pit": "nl",
    "cin": "nl",
    "mil": "nl",
    "lad": "nl",
    "col": "nl",
    "sdg": "nl",
    "ari": "nl",
    "sfo": "nl",
    "nym": "nl",
    "atl": "nl",
    "mia": "nl",
    "was": "nl",
    "phi": "nl"

};
/*
    INITIALIZATION
 */
$(document).ready(function(){
    DISPLAY_AL = true;
    DISPLAY_NL = true;

    // Masonry initialization
    $MASONRY_CONTAINER = $("#game-cards-masonry");
    $MASONRY_CONTAINER.masonry({
        itemSelector: '.game-card',
    });

    // Set the margin-left for the cards so that they are centered on the screen
    calc_card_margin();
    // Recalculate margin when screen is resized
    $(window).resize(calc_card_margin);

    // Hover effect for game cards
    $(".game-card").hover(function(){
        // hilight animation
        highlight_game_card(this);
    });

    // Get games for previous day
    $("#date-left-arrow").click(function(){
        load_prev_day();
    });

    // Get games for next day
    $("#date-right-arrow").click(function(){
        load_next_day();
    });

    // NL/AL filter buttons effects
    $(".nl-circle, .al-circle").click(function(){
        if($(this).hasClass("on")){
            $(this).removeClass("on");
            $(this).addClass("off");
            if($(this).hasClass("nl-circle") ){
                DISPLAY_NL = false;
            }else{
                DISPLAY_AL = false;
            }
            update_game_filter();
        }
        else{
            $(this).removeClass("off");
            $(this).addClass("on");
            if($(this).hasClass("nl-circle")){
                DISPLAY_NL = true;
            }else{
                DISPLAY_AL = true;
            }
            update_game_filter();
        }
    });
});

function highlight_game_card(elem){
    if($(elem).hasClass("fade")) return;
    var $hilight_bar = $(elem).find(".card-highlight");
    if($hilight_bar.hasClass("highlighted")) $hilight_bar.removeClass("highlighted");
    else $hilight_bar.addClass("highlighted");
}

function calc_card_margin(){
    // Calculate game card left-margins, assumes you can fit atleast 3 cards on the screen
    var curWidth;
    if($(window).width() > 1440) curWidth = 1440;
    else curWidth = $(window).width();
    var leftMarg = (curWidth - 900) / 4;
    console.log("New margin: "+leftMarg);
    $(".game-card").css("margin-left",leftMarg+"px");
}

//update filtered games
function update_game_filter(){
    $(".game-card").each(function(i, elem){
        var team1 = $(elem).find(".away-team").attr("src").split("/")[3];
        team1 = team1.slice(0,team1.length-4);
        if(team1.length == 4) team1 = team1.slice(0,3);

        var team2 = $(elem).find(".home-team").attr("src").split("/")[3];
        team2 = team2.slice(0,team2.length-4);
        if(team2.length == 4) team2 = team2.slice(0,3);
        console.log(team1+" v "+team2);

        var team1_league = team_leagues[team1];
        var team2_league = team_leagues[team2];

        // Only hide a game if both teams's leagues are turned off
        var bothOff = 0;
        if(!DISPLAY_AL){
            if(team1_league === "al") bothOff++;
            if(team2_league === "al") bothOff++;
        }
        if(!DISPLAY_NL){
            if(team1_league === "nl") bothOff++;
            if(team2_league === "nl") bothOff++;
        }
        console.log("both off="+bothOff);
        if(bothOff < 2)
            $(elem).removeClass("fade");
        else
            $(elem).addClass("fade");
    });
}

function load_prev_day(){
    var thatDate = get_current_date();
    var prevDate = new Date(thatDate.setDate(thatDate.getDate() - 1));

    load_day(prevDate);
}

function load_next_day(){
    var thatDate = get_current_date();
    var nextDate = new Date(thatDate.setDate(thatDate.getDate() + 1));

    load_day(nextDate);
}

function get_current_date() {
    /* Get date from hidden elem in html */
    var unparsedDate = $("#date-data").html().split(",");
    var mm = parseInt(unparsedDate[0]);
    var dd = parseInt(unparsedDate[1]);
    var yyyy = parseInt(unparsedDate[2]);

    return new Date(yyyy, mm, dd);
}

/**
 * Load scoreboard data for a day, can be used to change the displayed day or update the current days scores
 * @param  {Date} date object representing date to load
 */
function load_day(date){
    var mm = date.getMonth(); //jan is 0
    var dd = date.getDate();
    var yyyy = date.getFullYear();

    var dateQueryString = (mm < 10) ? '0' + mm : '' + mm;
    dateQueryString += (dd < 10) ? '0' + dd : '' + dd;
    dateQueryString += yyyy;
    console.log("Switching day to: "+dateQueryString);
    /*update current day scoreboard */
    window.location.href = "/scoreboard?date="+dateQueryString;
}
