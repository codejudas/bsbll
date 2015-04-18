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