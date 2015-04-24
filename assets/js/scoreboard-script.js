/* JAVASCRIPT FOR SCOREBOARD PAGE
        REQUIRE JQUERY AND MASONRY
*/

/*
    SCOREBOARD GLOBAL VARIABLES
 */
var $MASONRY_CONTAINER;

/*
    INITIALIZATION
 */
$(document).ready(function(){

    // Set the margin-left for the cards so that they are centered on the screen
    calc_card_margin();
    // Recalculate margin when screen is resized
    $(window).resize(calc_card_margin);

    // Hover effect for game cards
    $(".game-card").hover(function(){
        // Change pointer to clickable
        
        // hilight animation
        hilight_game_card(this);
    })

    // NL/AL filter buttons effects
    $(".nl-circle, .al-circle").click(function(){
        if($(this).hasClass("on")){
            $(this).removeClass("on");
            $(this).addClass("off");
        }
        else{
            $(this).removeClass("off");
            $(this).addClass("on");
        }
    })
});

function hilight_game_card(elem){
    console.log(elem);
    var $hilight_bar = $(elem).find(".card-highlight");
    console.log($hilight_bar);
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