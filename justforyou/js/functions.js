var $window = $(window), gardenCtx, gardenCanvas, $garden, garden,x,y;
var clientWidth = $(window).width();
var clientHeight = $(window).height();
$(function () {
    var $loveHeart = $("#loveHeart");
    $loveHeart.css("height",$loveHeart.width()*0.96);
    var a = $loveHeart.width() / 2;
    var b = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $('#loveHeart').width();
    gardenCanvas.height = $("#loveHeart").height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    gardenCtx.scale($('#loveHeart').width()/650,$('#loveHeart').height()/625);
    gardenCtx.translate((1-$('#loveHeart').width()/650)*335,0);
    garden = new Garden(gardenCtx, gardenCanvas);

    /*$("#content").css("width", $loveHeart.width() + $("#note").width()+60);
    $("#content").css("height", Math.max($loveHeart.height(), $("#note").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));*/
    setInterval(function () {
        garden.render()
    }, Garden.options.growSpeed)
});
/*$(window).resize(function () {
    var b = $(window).width();
    var a = $(window).height();
    if (b != clientWidth && a != clientHeight) {
        location.replace(location)
    }
});*/
function getHeartPoint(c) {
    var t = c / Math.PI;
    x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    console.log(x);
    console.log(y);
    return [offsetX + x, offsetY + y]

}
function startHeartAnimation() {
    var c = 50;
    var d = 10;
    var b = [];
    var a = setInterval(function () {
        var h = getHeartPoint(d);
        var e = true;
        for (var f = 0; f < b.length; f++) {
            var g = b[f];
            var j = Math.sqrt(Math.pow(g[0] - h[0], 2) + Math.pow(g[1] - h[1], 2));
            if (j < Garden.options.bloomRadius.max * 1.3) {
                e = false;
                break
            }
        }
        if (e) {
            b.push(h);
            garden.createRandomBloom(h[0], h[1])
        }
        if (d >= 30) {
            clearInterval(a);
            showMessages()
        } else {
            d += 0.2
        }
    }, c)
}
(function (a) {
    a.fn.typewriter = function () {
        this.each(function () {
            var d = a(this), c = d.html(), b = 0;
            d.html("");
            var e = setInterval(function () {
                var f = c.substr(b, 1);
                if (f == "<") {
                    b = c.indexOf(">", b) + 1
                } else {
                    b++
                }
                d.html(c.substring(0, b) + (b & 1 ? "_" : ""));
                if (b >= c.length) {
                    clearInterval(e)
                }
            }, 75)
        });
        return this
    }
})(jQuery);
function timeElapse(c) {
    var e = Date();
    var f = (Date.parse(e) - Date.parse(c)) / 1000;
    var g = Math.floor(f / (3600 * 24));
    f = f % (3600 * 24);
    var b = Math.floor(f / 3600);
    if (b < 10) {
        b = "0" + b
    }
    f = f % 3600;
    var d = Math.floor(f / 60);
    if (d < 10) {
        d = "0" + d
    }
    f = f % 60;
    if (f < 10) {
        f = "0" + f
    }
    var a = '<span class="digit">' + g + '</span> days <span class="digit">' + b + '</span> hours <span class="digit">' + d + '</span> minutes <span class="digit">' + f + "</span> seconds";
    $("#elapseClock").html(a)
}
function showMessages() {
    $("#messages").fadeIn(5000, function () {
        showLoveU()
    })
}

/*function adjustCodePosition() {
    $("#note").css("margin-top", ($("#garden").height() - $("#note").height()) / 2)
}*/
function showLoveU() {
    $("#love-u").fadeIn(3000)
}