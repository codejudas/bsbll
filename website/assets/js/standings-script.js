/*
    Javascript for the standings page
 */

// GLOBAL VARIABLES
var CUR_STANDING;               // one of "west", "central", "east", "wildcard" 
var STANDINGS_MODE = "division";
var MODE_ANIM_SPEED = 200;      // ms

$(document).ready(function(){
    CUR_STANDING = $(".div-selected").html();
    console.log("Current mode = "+STANDINGS_MODE);
    console.log("Current division = "+CUR_STANDING);

    $(".mode-arrow.left-arrow").hide();
    $("#wildcard-text").hide();

    $(".mode-arrow").click(function(){
        switch_standings_mode(MODE_ANIM_SPEED);
    });

    $(".div-button").click(function(){
        if($(".div-selected") == $(this)) return;

        move_div_selector($(this));
        switch_standings($(this).html());
    });


});

/**
 * move the visual selector indicator
 */
function move_div_selector($elem){

    var title = $elem.html();
    console.log("moving to division:"+title);

    var $cur_division = $(".div-selected");
    var cur_div_name = $cur_division.html().toLowerCase();
    $cur_division.removeClass("div-selected");
    $elem.addClass("div-selected");
    $("#division-selector").removeClass(cur_div_name);
    $("#division-selector").addClass(title.toLowerCase());
};

/**
 * switch between divisions or wildcard
 * @param  {jquery obj} target.html() is division name to switch to or 'wildcard'
 */
function switch_standings(target){
    console.log(CUR_STANDING);
    var $cur_standings = $("#"+CUR_STANDING.toLowerCase()+"-rankings");
    var $new_standings = $("#"+target.toLowerCase()+"-rankings");
    console.log("switching standings from "+"#"+CUR_STANDING.toLowerCase()+"-rankings"+" to "+"#"+target.toLowerCase()+"-rankings");

    // start fading out the current card
    $cur_standings.removeClass("active");
    $cur_standings.addClass("inactive");
    // fade in the new card
    $new_standings.removeClass("inactive");
    $new_standings.addClass("active");

    if (target !== "wildcard")
        $("#standings-container").removeClass("wildcard");
    else
        $("#standings-container").addClass("wildcard");

    CUR_STANDING = target;
    console.log(CUR_STANDING);
};

/**
 * switch between division standings and wildcard standings
 * @param  int  speed animation speed in ms
 */
function switch_standings_mode(speed){
    var log_str = "Switching mode from "+STANDINGS_MODE+" to ";

    $("#division-text").toggle(speed);
    $("#wildcard-text").toggle(speed);

    $(".mode-arrow.right-arrow").toggle(speed);
    $(".mode-arrow.left-arrow").toggle(speed);

    // hide or show the division selectors
    $(".div-button").toggle(speed);
    $("#division-selector").toggle(speed);

    if (CUR_STANDING === "wildcard")
        STANDINGS_MODE = $(".div-selected").html();
    else
        STANDINGS_MODE = "wildcard";

    log_str = log_str + STANDINGS_MODE;
    console.log(log_str);
    
    switch_standings(STANDINGS_MODE);
} 
