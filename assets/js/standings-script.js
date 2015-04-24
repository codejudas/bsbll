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
    });
});

function move_div_selector($elem){

    var title = $elem.html();
    console.log("moving to division:"+title);

    $CUR_DIVISION.removeClass("div-selected");
    $elem.addClass("div-selected");
    $("#division-selector").removeClass($CUR_DIVISION.html().toLowerCase());
    $("#division-selector").addClass(title.toLowerCase());
    $CUR_DIVISION = $elem;


}