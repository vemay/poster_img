/**
 * Created by Administrator on 2016/12/15.
 */
;(function($) {
    var Carousel = function (poster) {
        this.setting = {
            "width":1000,/*广告盒子宽度*/
            "height":270,/*广告盒子宽度*/
            "imgWidht":640,/*广告图宽度*/
            "imgHeight":270,/*广告图高度*/
            "verticalAlign":"middle",/*垂直排列样式  top middle bottom*/
            "scale":0.9,/*图片层叠缩放比例*/
            "speed":500,/*切换速度*/
        };
        this.poster = poster;
        /*将人工定义的参数与默认参数合并*/
        $.extend(this.setting,this.getSetting());
        console.log(this.setting);
    };
    Carousel.prototype = {
        /*获取人工定义的属性参数*/
            getSetting:function () {
                var setting = this.poster.attr("data-setting");
                if (setting && setting!=""){
                    return $.parseJSON(setting);
                }
            }
    };
    Carousel.init = function (posters) {
        posters.each(function () {
            new Carousel($(this));
        });
    }
    window["Carousel"] = Carousel;
})(jQuery);