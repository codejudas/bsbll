/*
    JAVASCRIPT FOR THE TEAMS PAGE
 */

$(document).ready(function(){
    $(".team-circle").hover(function(){
        var $popup = $(this).next();
        if($popup.hasClass("inactive")){
            $popup.removeClass("inactive");
        }
        else{
            $popup.addClass("inactive");
        }
    })
});