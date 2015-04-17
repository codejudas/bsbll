/** Javascript for the news page */

$(document).ready(function(){
    // Clicking the bottom arrow scrolls the page down
    $("#splash-bottom-arrow").click(function(){
        $('html, body').animate({scrollTop: ($("#news-list").offset().top - 85)}, 1000);
    });
});