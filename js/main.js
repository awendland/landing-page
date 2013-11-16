/* 
 * ###########################
 * Shims/Fixes/Browser Support
 * ###########################
 */

/* onHashChange fix for IE and other ... unsatisfactory... browsers */
jQuery.browser={};(function(){jQuery.browser.msie=false;
jQuery.browser.version=0;if(navigator.userAgent.match(/MSIE ([0-9]+)\./)){
jQuery.browser.msie=true;jQuery.browser.version=RegExp.$1;}})();

if (("onhashchange" in window) && !($.browser.msie)) { 
    $(window).bind('hashchange', function() { //modern browsers 
        state_change(getHash());
    });
} else {
    state_change(getHash());
    $('a.hash').bind('click', function() { //IE and browsers that don't support hashchange
        changeHash($(this).attr('href').replace(/^#/,''));
    });
}

function changeHash(hash) {
    window.location.hash = "#" + hash;
    if (!("onhashchange" in window) || ($.browser.msie))
        $(window).trigger("onHashChange", {newHash: hash});
}

/**
 * Link vendor prefixed or create a setTimeout based shim for browsers that don't support requestAnimationFrame.
 */
(function(){var e=0;var t=["webkit","moz"];for(var n=0;n<t.length&&!window.requestAnimationFrame;++n){window.requestAnimationFrame=window[t[n]+"RequestAnimationFrame"];window.cancelAnimationFrame=window[t[n]+"CancelAnimationFrame"]||window[t[n]+"CancelRequestAnimationFrame"]}if(!window.requestAnimationFrame)window.requestAnimationFrame=function(t,n){var r=(new Date).getTime();var i=Math.max(0,16-(r-e));var s=window.setTimeout(function(){t(r+i)},i);e=r+i;return s};if(!window.cancelAnimationFrame)window.cancelAnimationFrame=function(e){clearTimeout(e)}}());

/**
 * Returns the current URL hash
 */
function getHash() {
    return window.location.hash.replace(/^#/,'');
}

/*
 * #############
 * Website logic
 * #############
 */

/* Handle Hash Change events */
$(window).on('onHashChange', function (e, o) {
    state_change(o.newHash);
});

/* Handle swipe events. Change swipe_veolicty to 0.15 to make swiping more natural on mobile. */
$('html').hammer({swipe_velocity: 0.15}).on("swiperight swipeleft", function(event) {
    if (event.type.indexOf("right") !== -1 && getHash() !== "portfolio")
        changeHash("portfolio");
    else if (event.type.indexOf("left") !== -1 && getHash() !== "blog" ) 
        changeHash("blog");
});

/* Build list of pages in sliding container */
pages = $(".page");
pageNames = [];
pages.each(function () {
    pageNames.push($(this).attr("name"));
});

/* Update displayed page to current hash on page load, if it hasn't already occurred */
//state_change(getHash());

/**
 * Wrapper for easily controlling page transitions/flow.
 */
function state_change(newPage) {
    var currPageIndex;
    for (var i = 0; i < pages.length; i++) {
        var page = $(pages[i]);
        if (page.is(":visible") && page.offset().left === 0)
            currPageIndex = i;
    }
    var nextPageIndex = isNaN(newPage) ? pageNames.indexOf(newPage) : newPage;
    if (!/[0-9]+/.test(nextPageIndex))
        nextPageIndex = 0;
    if (!isNaN(currPageIndex) && nextPageIndex !== currPageIndex && nextPageIndex > -1) {
        slide($(pages[currPageIndex]), $(pages[nextPageIndex]), currPageIndex - nextPageIndex > 0 ? 1 : -1);
    }
}

/**
 * Transition between pages.
 */
function slide(currPage, nextPage, direction) {
    currPage.animate({
            left: String(direction*100) + '%',
            opacity: '0'
        }, 500, function() {
            currPage.removeClass('present');
            currPage.trigger("pageHide");
        });
    nextPage.offset({left: String(direction*100) + "%"});
    nextPage.addClass('transition');
    nextPage.animate({
            left: '0%',
            opacity: '1',
        }, 500, function() {
            nextPage.addClass('present');
            currPage.removeClass('transition');
            nextPage.trigger("pageShow");
        });
}

/* ###############
 * OnBlogPage Show
 * ###############
 */

// Experiencing errors with unloaded DOM and double-triggers
var countdown = new CountdownCircle(document.getElementById("countdown"));
countdown.onDelayedEnd(function() {
    window.location.href = "http://alexwendland.com/blog";
}, 1000);
countdown.create(5000);
$('[name="blog"]').on("pageShow", function() {
    console.log(Date.now());
    countdown.delayedStart(5000, 1000);
});

$('[name="blog"]').on("pageHide", function() {
    countdown.pause();
    countdown.create(5000);
});

/**
 * Timer
 */
function CountdownCircle(elem, opt) {
    var self = this;

    self.main = elem;
    // Setup element DOM
    self.bg = document.createElement('canvas');
    self.bg.className = "countdown-canvas";
    self.main.appendChild(self.bg);
    self.rt = document.createElement('span');
    self.rt.className = "countdown-text";
    self.main.appendChild(self.rt);
    // Get canvas context
    self.ctx = self.bg.getContext('2d');
    // Generate constants
    self.circ = Math.PI * 2;
    self.quart = Math.PI / 2;
    
    self.devicePixelRatio = window.devicePixelRatio;
    
    self.parentDisplayRecursion = function (item, hiddenList) {
        if (item.offsetHeight === 0 || item.offsetWidth === 0) {
            hiddenList.push(item);
            item.style.display = "block";
        }
        if (item.parentElement)
            self.parentDisplayRecursion(item.parentElement, hiddenList);
    }
    
    //Temporarily display to far left to measure dimens
    self.hiddenParentNodes = new Array();
    self.parentDisplayRecursion(self.main, self.hiddenParentNodes);
    
    // Get config
    opt = opt || {};
    self.conf = {
        color: opt.color || '#bc360a',
        lineWidth: opt.lineWidth || 25.0 * (self.devicePixelRatio || 1),
        height: opt.height || self.main.offsetHeight,
        width: opt.width || self.main.offsetWidth
    };
    
    self.conf.hdHeight = opt.hdHeight || self.conf.height * (self.devicePixelRatio || 1);
    self.conf.hdWidth = opt.hdHeight || self.conf.width * (self.devicePixelRatio || 1);
    
    // Setup generated element layout-styles
    self.main.height = self.conf.height;
    self.main.width = self.conf.width;
    self.bg.width = self.conf.hdWidth;
    self.bg.height = self.conf.hdHeight;
    self.bg.style.width = String(self.conf.width) + "px";
    self.bg.style.height = String(self.conf.height) + "px";
    self.rt.style.position = "absolute";
    console.log(self.rt.style.fontSize);
    self.rt.style.top = String((self.conf.height - self.rt.offsetHeight) / 2) + "px";
    self.rt.style.left = "0px"
    self.rt.style.textAlign = "center";
    self.rt.style.width = "100%";
    
    // Return temporarily hidden/moved
    for (var i = 0; i < self.hiddenParentNodes.length; i++) {
        self.hiddenParentNodes[i].style.display = "";
    }
    
    // Setup canvas styles
    self.ctx.beginPath();
    self.ctx.strokeStyle = self.conf.color;
    self.ctx.closePath();
    self.ctx.fill();
    self.ctx.lineWidth = self.conf.lineWidth;
    
    // Store blank canvas data
    self.imd = self.ctx.getImageData(0, 0, self.conf.hdWidth, self.conf.hdHeight);

    // Countdown timers
    self.timeLeft;
    self.totalTime;
    self.prevTime;
    
    // Function to trigger on callback
    self.endCallback;
    
    // Setup pause/resume onClick handler
    self.main.addEventListener('click', function() {
        if (self.paused)
            self.resume();
        else
            self.pause();
    }, false);

    self.onEnd = function (f) {
        self.endCallback = f;
    };
    
    self.onDelayedEnd = function (f, delay) {
        self.endCallback = function() {
            setTimeout(function() {
                if (!self.paused)
                    f();
            }, delay);
        };
    };

    self.create = function (time) {
        self.updateCircle(0, -1);
        self.updateText(time);
    };

    self.delayedStart = function (totalTime, delay) {
        setTimeout(function () {
            self.start(totalTime)
        }, delay);
    }

    self.start = function (totalTime) {
        self.timeLeft = totalTime - 1;
        self.totalTime = totalTime;
        self.paused = false;
        self.prevTime = null;
        self.countdown();
    };

    self.paused = false;

    self.pause = function () {
        self.paused = true;
    };
    
    self.set = function(progress, max) {
        self.updateCircle(progress, max);
        self.updateText(progress);
    }

    self.resume = function () {
        self.paused = false;
        self.prevTime = Date.now();
        self.countdown();
    };

    self.countdown = function () {
        if (!self.paused) {
//            var prevSelfTime = self.timeLeft;
            self.timeLeft = self.timeLeft - (self.prevTime ? (Date.now() - self.prevTime) : 17);
            self.prevTime = Date.now();
            self.updateCircle(self.totalTime - self.timeLeft, self.totalTime);
//            console.log(String(self.timeLeft) + "," + String(prevSelfTime))
//            if (prevSelfTime < self.timeLeft)
//                alert(self.timeLeft);
            self.updateText(self.timeLeft);
            if (self.timeLeft > 0) requestAnimationFrame(self.countdown);
            else if (self.endCallback) self.endCallback();
        }
    };

    self.updateCircle = function (progress, max) {
        var percent = max == -1 ? 1 : (progress / max < 1 ? progress / max : 0);
        self.ctx.putImageData(self.imd, 0, 0);
        self.ctx.beginPath();
        self.ctx.arc(self.conf.hdWidth / 2, self.conf.hdWidth / 2, Math.min(self.conf.hdWidth, self.conf.hdHeight) / 3, -(self.quart), ((self.circ) * percent) - self.quart, true);
        self.ctx.stroke();
    };

    self.updateText = function (remainder) {
        var text = remainder > 0 ? Math.ceil(remainder / 1000) : 0;
        self.rt.innerHTML = text;
    };
}