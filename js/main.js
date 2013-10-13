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
    $('a.internal').bind('click', function() {
        var hash = $(this).attr('href').replace(/^#/,'');
        state_change(hash);
    });
}

pages = $(".page");
pageNames = [];
pages.each(function () {
    pageNames.push($(this).attr("name"));
});

state_change(window.location.hash.replace(/^#/,''));

function state_change(newPage) {
    var currPageIndex;
    for (var i = 0; i < pages.length; i++) {
        var page = $(pages[i]);
        if (page.is(":visible") && page.offset().left === 0)
            currPageIndex = i;
    }
    var nextPageIndex = isNaN(newPage) ? pageNames.indexOf(newPage) : newPage;
    if (nextPageIndex === -1)
        nextPageIndex = 0;
    if (!isNaN(currPageIndex) && nextPageIndex !== currPageIndex)
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

/*
$('[name="blog"]').on("pageShow", function() {
    loader.resume();
});

$('[name="blog"]').on("pageHide", function() {
    loader.pause();
});

function Loadr(id) {
    // # Defines
    const max_size = 24;
    const max_particles = 1500;
    const min_vel = 20;
    const max_generation_per_frame = 10;

    // #Variables
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext('2d');
    var height = canvas.height;
    var center_y = height/2;
    var width = canvas.width;
    var center_x = width / 2;
    var animate = true;
    var particles = [];
    var last = Date.now(),now = 0;
    var died = 0,len = 0,dt;
    
    // #State Variables
    var pause = false;

    function isInsideHeart(x,y){
        x = ((x - center_x) / (center_x)) * 3;
        y = ((y - center_y) / (center_y)) * -3;
        // Simplest Equation of lurve
        var x2 = x * x;
        var y2 = y * y;
        // Simplest Equation of lurve
        return (Math.pow((x2 + y2 - 1), 3) - (x2 * (y2 * y)) < 0);
    }
    function random(size,freq){
        var val = 0;
        var iter = freq;
        do{
            size /= iter;
            iter += freq;
            val += size * Math.random();
        }while( size >= 1);
        return val;
    }
    function Particle(){
        var x = center_x;
        var y = center_y;
        var size = ~~random(max_size,2.4);
        var x_vel = ((max_size + min_vel) - size)/2 - (Math.random() * ((max_size + min_vel) - size));
        var y_vel = ((max_size + min_vel) - size)/2 - (Math.random() * ((max_size + min_vel) - size));
        var nx = x;
        var ny = y;
        var r,g,b,a = 0.05 * size;
        
        this.draw = function(){
            r = ~~( 255 * ( x / width));
            g = ~~( 255 * (1 - ( y / height)));
            b = ~~( 255 - r );
            ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
            ctx.beginPath();
            ctx.arc(x,y,size,0, Math.PI*2, true); 
            ctx.closePath();
            ctx.fill();
        }

        this.move = function(dt){

            nx += x_vel * dt;
            ny += y_vel * dt;
            if( !isInsideHeart(nx,ny)){
                if( !isInsideHeart(nx,y)){
                        x_vel *= -1;
                        return;
                }
                if( !isInsideHeart(x,ny)){
                        y_vel *= -1;
                        return;
                }
                // Lets do the crazy furbidden
                x_vel = -1 * y_vel;
                y_vel = -1 * x_vel;
                return;
            }
            x = nx;
            y = ny;
        }

    }
    function movementTick(){
        if (!pause) {
            var len = particles.length;
            dead = max_particles - len;
            for( var i = 0; i < dead && i < max_generation_per_frame; i++ ){
                particles.push(new Particle());
            }
            
            // Update the date
            now = Date.now();
            dt = last - now;
            dt /= 1000;
            particles.forEach(function(p){
                p.move(dt);
            });
        }
        last = now;
    }
    function tick(){

        ctx.clearRect(0,0,width,height);
        particles.forEach(function(p){
            p.draw();
        });
        
        if (!pause)
            requestAnimationFrame(tick);
    }
    this.start = function(){
        setInterval(movementTick,16);
        tick();
    }
    this.done = function(){

    }
    this.pause = function(){
        pause = true;
        console.log("paused");
    }
    this.resume = function(){
        pause = false;
        console.log("resumed");         
        tick();      
    }
}
var loader = new Loadr("loader");
loader.start();*/