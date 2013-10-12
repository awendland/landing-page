jQuery.browser={};(function(){jQuery.browser.msie=false;
jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)\./)){
jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();

if (("onhashchange" in window) && !($.browser.msie)) { 
    //modern browsers 
    $(window).bind('hashchange', function() {
        var hash = window.location.hash.replace(/^#/,'');
        state_change(hash);
    });
} else {
    //IE and browsers that don't support hashchange
    $('a.hash-changer').bind('click', function() {
        var hash = $(this).attr('href').replace(/^#/,'');
        state_change(hash);
    });
}

pages = $(".page");
pageNames = [];
pages.each(function () {
    pageNames.push($(this).attr("name"));
});

function state_change(newPage) {
    var currPageIndex;
    for (var i = 0; i < pages.length; i++) {
        var page = $(pages[i]);
        if (page.is(":visible") && page.offset().left === 0)
            currPageIndex = i;
    }
    var nextPageIndex = isNaN(newPage) ? pageNames.indexOf(newPage) : newPage;
    if (nextPageIndex !== currPageIndex)
        slide($(pages[currPageIndex]), $(pages[nextPageIndex]), currPageIndex - nextPageIndex > 0 ? 1 : -1);
}

function slide(currPage, nextPage, direction) {
    currPage.animate({
            left: String(direction*100) + '%',
            opacity: '0',
            display: 'none',
        }, 500, function() {
            currPage.removeClass('present');
            currPage.css("display", "");
            currPage.trigger("pageHide");
        });
    nextPage.offset({left: String(direction*100) + "%"});
    nextPage.css('display', 'block');
    nextPage.animate({
            left: '0%',
            opacity: '1',
        }, 500, function() {
            nextPage.addClass('present');
            nextPage.trigger("pageShow");
        });
}

/*##############################################################################################*/

$('[name="blog"]').on("pageShow", function() {
});

$('[name="blog"]').on("pageHide", function() {
});