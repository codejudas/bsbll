/*
    Javascript for the standings page
 */

// GLOBAL VARIABLES
var $CUR_DIVISION; //contains the jquery element of the currently selected division

$(document).ready(function(){
    $CUR_DIVISION = $(".div-selected");
    console.log("Current division = "+$CUR_DIVISION.html());

    $(".div-button").click(function(){
        if($CUR_DIVISION == $(this)) return;

        move_div_selector($(this));
        switch_standings($(this).html());
        $CUR_DIVISION = $(this);
    });
});

function move_div_selector($elem){

    var title = $elem.html();
    console.log("moving to division:"+title);

    $CUR_DIVISION.removeClass("div-selected");
    $elem.addClass("div-selected");
    $("#division-selector").removeClass($CUR_DIVISION.html().toLowerCase());
    $("#division-selector").addClass(title.toLowerCase());
}

function switch_standings(division){
    var $cur_standings = $("#"+$CUR_DIVISION.html().toLowerCase()+"-rankings");
    var $new_standings = $("#"+division.toLowerCase()+"-rankings");
    console.log("switching standings from "+"#"+$CUR_DIVISION.html().toLowerCase()+"-rankings"+" to "+"#"+division.toLowerCase()+"-rankings");

    // start fading out the current card
    $cur_standings.removeClass("active");
    $cur_standings.addClass("inactive");
    // fade in the new card
    $new_standings.removeClass("inactive");
    $new_standings.addClass("active");

}