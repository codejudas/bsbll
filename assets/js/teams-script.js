/*
    JAVASCRIPT FOR THE TEAMS PAGE
 */

$(document).ready(function(){
    // Team info popup when hovering over map
    $(".team-circle").hover(function(){
        var $popup = $(this).next();
        if($popup.hasClass("inactive")){
            $(this).addClass("active");
            $popup.removeClass("inactive");
        }
        else{
            $(this).removeClass("active");
            $popup.addClass("inactive");
        }
    })

    // Toggle displaying NL/AL teams
    $(".league-circle").click(function(){
        if($(this).hasClass("off")){
            $(this).removeClass("off");
            filter_league($(this).html(), true);
        }
        else{
            $(this).addClass("off");
            filter_league($(this).html(), false);
        }
    })

    // Hovering over teams icon also highlights team on map
    $(".team-img").hover(function(){
        var team_name = $(this).attr("src").split("/")[3];
        team_name = team_name.slice(0,team_name.length-4);
        console.log(team_name);
        var $popup = $("#"+team_name+">.team-popup");
        var $circle = $("#"+team_name+">.team-circle");
        console.log($popup);
        if($popup.hasClass("inactive")){
            $circle.addClass("active");
            $popup.removeClass("inactive");
        }
        else{
            $circle.removeClass("active");
            $popup.addClass("inactive");
        }
    });

});

function filter_league(league, show){
    console.log("filtering "+league+" show="+show);
    if(league === "AL"){
        if(!show){
            $(".team-img.al").addClass("fade");
            $(".team-entry.al").fadeOut(400);
        }
        else{
            $(".team-img.al").removeClass("fade");
            $(".team-entry.al").fadeIn(400);
        }
    }
    else{
        if(!show){
            $(".team-img.nl").addClass("fade");
            $(".team-entry.nl").fadeOut(400);
        }
        else{
            $(".team-img.nl").removeClass("fade");
            $(".team-entry.nl").fadeIn(400);
        }
    }
}