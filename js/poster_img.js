/**
 * Created by Administrator on 2016/12/15.
 */
;(function($) {
    var Carousel = function (poster) {
        this.poster = poster;
        this.list   = this.poster.find(".list").eq(0);
        this.leftBtn = this.poster.find(".left_btn").eq(0);
        this.rightBtn = this.poster.find(".right_btn").eq(0);
        this.items = this.list.find("li");
        this.firstItem = this.items.eq(0);
        this.sliceItems = this.items.slice(1);

        this.setting = {
            "width":1000,/*广告盒子宽度*/
            "height":270,/*广告盒子宽度*/
            "imgWidth":640,/*广告图第一帧宽度*/
            "imgHeight":270,/*广告图第一帧高度*/
            "verticalAlign":"middle",/*垂直排列样式  top middle bottom*/
            "scale":0.9,/*图片层叠缩放比例*/
            "speed":500,/*切换速度*/
        };

        /*将人工定义的参数与默认参数合并*/
        $.extend(this.setting,this.getSetting());
        this.setAttr();
        this.setSliceItems();
    };
    Carousel.prototype = {
        /*通过参数设置页面中各个对象的属性*/
            setAttr:function () {

                /*广告最外层盒子的属性*/
                this.poster.css({
                    "width":this.setting.width,
                    "height":this.setting.height,
                });

                /*广告列表ul的属性*/
                this.list.css({
                    "width":this.setting.width,
                    "height":this.setting.height,
                });

                /*左右按钮的属性*/
                var w = parseInt((this.setting.width-this.setting.imgWidth)/2);
                var zindex=0;
                this.leftBtn.css({
                    "width":w,
                    "height":this.setting.height,
                    "top":0,
                    "left":0
                });
                this.rightBtn.css({
                    "width":w,
                    "height":this.setting.height,
                    "top":0,
                    "right":0
                });
                /*广告图片第一帧的属性*/
                this.firstItem.css({
                    "width":this.setting.imgWidth,
                    "height":this.setting.height,
                    "top":0,
                    "left":w,
                    "z-index":Math.ceil(this.items.size()/2)
                });
            },

        /*广告图片其余帧的属性*/
            setSliceItems:function() {
                var self        = this,
                    sliceSize   = this.sliceItems.size()/2,
                    rightSlice  = this.sliceItems.slice(0,sliceSize),
                    rw           = this.setting.imgWidth ,
                    rh           = this.setting.imgHeight,
                    firstLeft   = (this.setting.width-this.setting.imgWidth)/2,
                    // level = sliceSize 右边这一组有几张图片就分几层，因此层数与右侧图片数相等
                    gap          = firstLeft/sliceSize;

                    rightSlice.each(function(i,ele) {

                        rw= rw*self.setting.scale;
                        rh= rh*self.setting.scale;
                        var rleft = firstLeft + self.setting.imgWidth+(i+1)*gap - rw;
                        console.log(self.setting.height+"   "+rh);
                        var rtop  = (self.setting.height-rh)/2;
                        var rOpacity = 1/(i+1);
                        $(this).css({
                                "width":rw,
                                "height":rh,
                                "opacity":rOpacity,
                                "left":rleft,
                                "top":rtop,
                                "z-index":sliceSize - i
                            });
                    });
             },

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