/** Javascript for the news page */

// GLOBALS
var window_width;
var num_stories;
var cur_tab;
var margin_limit;
var SLIDESHOW_IS_ANIMATING;

$(document).ready(function(){
    SLIDESHOW_IS_ANIMATING = false;
    cur_story = 1;
    window_width = $(".splash-img").first().width();
    console.log("image width "+window_width);

    num_stories=0;
    $(".news-story-splash").each(function(){
        num_stories++;
    });

    // Handle clicking on left arrow
    $("#splash-left-arrow").click(slideshow_move_right);
    $("#splash-right-arrow").click(slideshow_move_left);

    // Set width of story container to be num_Stories*windows width
    $("#story-container").css("width", window_width*(num_stories+1));
    console.log(window_width*num_stories);

    margin_limit = -1 * (window_width*(num_stories-1));

    display_arrows();

    // Clicking the bottom arrow scrolls the page down
    $("#splash-bottom-arrow").click(function(){
        $('html, body').animate({scrollTop: ($("#news-list").offset().top - 85)}, 1000);
    });
});

function slideshow_move_left(){
    if(SLIDESHOW_IS_ANIMATING) return;
    SLIDESHOW_IS_ANIMATING = true;
    console.log("moving slideshow left");
    var cur_margin_left = parseInt($("#story-container").css("margin-left").replace("px",""));
    console.log("margin left before: "+cur_margin_left);
    if(cur_margin_left > margin_limit){
        cur_margin_left = cur_margin_left - window_width;
        $("#story-container").css("margin-left",cur_margin_left);
        // Prevent switching to another story before weve finished moving the previous one
        setTimeout(function(){
            SLIDESHOW_IS_ANIMATING = false;
        }, 1000);
        console.log("margin left after: "+cur_margin_left);
        cur_story++;
        display_arrows();
    }
}

function slideshow_move_right(){
    if(SLIDESHOW_IS_ANIMATING) return;
    SLIDESHOW_IS_ANIMATING = true;
    console.log("moving slideshow right");
    var cur_margin_left = parseInt($("#story-container").css("margin-left").replace("px",""));
    console.log("margin left before: "+cur_margin_left);
    if(cur_margin_left < 0){
        cur_margin_left = cur_margin_left + window_width;
        $("#story-container").css("margin-left",cur_margin_left);
        // Prevent switching to another story before weve finished moving the previous one
        setTimeout(function(){
            SLIDESHOW_IS_ANIMATING = false;
        }, 1000);
        console.log("margin left after: "+cur_margin_left);
        cur_story--;
        display_arrows();
    }

}

function display_arrows(){
    if(cur_story == num_stories)
        $("#splash-right-arrow").addClass("off");
    else
        $("#splash-right-arrow").removeClass("off");

    if(cur_story == 1)
        $("#splash-left-arrow").addClass("off");
    else
        $("#splash-left-arrow").removeClass("off");
}