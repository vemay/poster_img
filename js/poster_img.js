/**
 * Created by Administrator on 2016/12/15.
 */
;(function($) {
    var Carousel = function (poster) {
        alert(poster);
    };
    Carousel.prototype = {

    };
    Carousel.init = function (posters) {
        posters.each(function () {
            new Carousel(this);
        });
    }
    window["Carousel"] = Carousel;
})(jQuery);