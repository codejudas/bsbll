/** Javascript for the navbar */

/*
    GLOBAL NAVBAR VARIABLES
 */

var CURRENT_TAB;
var CURRENT_TAB_NAME;
var PREV_TAB;
var TAB_IS_ANIMATING;
var BASE_TAB_OFFSET = 163;
var TAB_OFFSETS = {
    "News": -1,
    "Scoreboard": -1,
    "Standings": -1,
    "Teams": -1,
    "Search": -1
};

/*
    INITIALIZATION
 */

$(document).ready(function(){
    // Hide the search modal
    $("#search-container").hide();

    // Calculate the tabs offsets array
    $(".nav-entry").each(function(elem){
        var title = $(this).find("p").html();
        // Each element calculates the next elements offset
        switch(title){
            case "News":
                TAB_OFFSETS["News"] = BASE_TAB_OFFSET;
                TAB_OFFSETS["Scoreboard"] = BASE_TAB_OFFSET + $(this).outerWidth(true)+5;
                break;
            case "Scoreboard":
                TAB_OFFSETS["Standings"] = (TAB_OFFSETS["Scoreboard"] + $(this).outerWidth(true)) +5;
                break;
            case "Standings":
                TAB_OFFSETS["Teams"] = (TAB_OFFSETS["Standings"] + $(this).outerWidth(true))+3;
                break;
            default:
                break;
        }
    });
    TAB_OFFSETS["Search"] = 65; //Position of search from the right
    console.log(TAB_OFFSETS);

    // Detect which tab is selected and move the selector there initially
    var selected_t = $(".nav-selected");
    move_nav_selector(selected_t,false);
    CURRENT_TAB = selected_t;
    CURRENT_TAB_NAME = CURRENT_TAB.children().first().html();
    console.log("Current tab: "+CURRENT_TAB_NAME);

    TAB_IS_ANIMATING = false;

    // Event Listeners for Nav Selector
    $(".nav-entry").hover(function(){
        move_nav_selector($(this),true);
    },
    function(){
        if($(this) !== CURRENT_TAB)
            move_nav_selector(CURRENT_TAB,true);
    });

    $("#nav-search-icon").hover(function(){
        move_nav_selector($(this),true);
    },
    function(){
        if($(this) !== CURRENT_TAB)
            move_nav_selector(CURRENT_TAB,true);
    });

    // NAVBAR SEARCH ICON
    $("#nav-search-icon").click(click_search);

    $("#search-overlay").click(function(){
        CURRENT_TAB = PREV_TAB;
        hide_modal();
        move_nav_selector(CURRENT_TAB,true);
    });

    // Make navbar buttons link to other pages
    $(".nav-entry").click(function(){
        pulse_nav_selector();
        var title = $(this).children().first().html();
        console.log(title);
        if(CURRENT_TAB_NAME === title) return;

        if(title === "News")
            window.location.href = 'index';
        else if(title === "Scoreboard")
            window.location.href = 'scoreboard';
        else if(title === "Standings")
            window.location.href = 'standings';
        else
            window.location.href = 'teams';
    });
});

/*
HELPER FUNCTIONS
 */

function click_search(){
    pulse_nav_selector();
    if(!CURRENT_TAB.is("img")){
        show_modal();
        PREV_TAB = CURRENT_TAB;
        CURRENT_TAB = $("#nav-search-icon");
        console.log("New cur tab: ");
    }
    else{
        hide_modal();
        CURRENT_TAB = PREV_TAB;
    }
}

function show_modal(){
    console.log("Showing search modal");
    $("#search-container").fadeIn(500);
    setTimeout(function(){
        $(".search-modal").removeClass("modal-hidden");
    },250);
}

function hide_modal(){
    console.log("Hiding search modal");
    $(".search-modal").addClass("modal-hidden");
    $("#search-container").fadeOut(500);
}

function move_nav_selector($tab_div, animate){
    //Figure out which tab is selected and get the offset and width
    var title;
    var offs;
    var new_width;
    if($tab_div.is("#nav-search-icon")){
        title = "Search";
        offs = $(window).width() - TAB_OFFSETS[title] - 10;
        new_width = $tab_div.width() + 20;
    }
    else{
        title = $tab_div.children().first().html();
        offs = TAB_OFFSETS[title];
        new_width = $tab_div.width();
    }
    // console.log("Moving selector to "+title);
    // console.log(">>new selector properties: offs:"+offs+",width:"+new_width);
    if(!animate){
        // Resize the selector
        $("#nav-selector").width(new_width+"px");
        // Move it to the correct offset
        $("#nav-selector").css('left',offs);
    }
    else{
        // If another animation is already in progress then stop it
        if(TAB_IS_ANIMATING) $("#nav-selector").stop(true);
        TAB_IS_ANIMATING = true;
        $("#nav-selector").animate({
            width: new_width,
            left: offs
        }, 
        750,
        "swing",
        function(){
            TAB_IS_ANIMATING = false;
        });
    }
}

function pulse_nav_selector(){
    if(!TAB_IS_ANIMATING){
        $("#nav-selector").animate({opacity:0.6},
                                    300,
                                    "swing",
                                    function(){
                                        setTimeout(function(){
                                            $("#nav-selector").animate({opacity:1},300);
                                        });
                                    });
    }
}