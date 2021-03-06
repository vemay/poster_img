/**
 * Created by Administrator on 2016/12/15.
 */
;(function($) {
    var Carousel = function (poster) {
        var self = this;

        this.poster = poster;
        this.list   = this.poster.find(".list").eq(0);
        this.prevBtn = this.poster.find(".left_btn").eq(0);
        this.nextBtn = this.poster.find(".right_btn").eq(0);
        this.items = this.list.find("li");

        /*偶数帧*/
        if (this.items.size()%2 == 0) {
            this.list.append(this.items.eq(0).clone(true));
            this.items = this.list.find("li");
        }

        this.firstItem = this.items.eq(0);
        this.lastItem   = this.items.last();
        this.sliceItems = this.items.slice(1);
        this.animateFlag =true;

        this.setting = {
            "width":1000,/*广告盒子宽度*/
            "height":270,/*广告盒子宽度*/
            "imgWidth":640,/*广告图第一帧宽度*/
            "imgHeight":270,/*广告图第一帧高度*/
            "verticalAlign":"middle",/*垂直排列样式  top middle bottom*/
            "scale":0.9,/*图片层叠缩放比例*/
            "speed":500,/*切换速度*/
            "autoplay":false,/*是否自动播放*/
            "delay":3000/*自动播放间隔时间*/
        };
        /*将人工定义的参数与默认参数合并*/
        $.extend(this.setting,this.getSetting());
        console.log(this.setting);
        this.setAttr();
        this.setSliceItems();

        /*旋转运动*/
        /*向左*/
        this.nextBtn.click(function() {
            if (self.animateFlag){
                self.moveTo("left");
                self.animateFlag = false;
            }

        });
        this.prevBtn.click(function () {
            if (self.animateFlag){
                self.moveTo("right");
                self.animateFlag = false;
            }
        });

        /*是否自动播放*/
        if (this.setting.autoplay) {
            this.autoPlay();
            this.poster.hover(function(){
                clearInterval(self.timer);
            },function() {
                self.autoPlay();
            });
        }

    };
    Carousel.prototype = {
        /*通过参数设置页面中各个对象的属性*/
        setAttr:function () {

            /*广告最外层盒子的属性*/
            this.poster.css({
                "width":this.setting.width,
                "height":this.setting.height
            });

            /*广告列表ul的属性*/
            this.list.css({
                "width":this.setting.width,
                "height":this.setting.height
            });

            /*左右按钮的属性*/
            var w = parseInt((this.setting.width-this.setting.imgWidth)/2);
            this.prevBtn.css({
                "width":w,
                "height":this.setting.height,
                "top":0,
                "left":0
            });
            this.nextBtn.css({
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
                "zIndex":Math.ceil(this.items.size()/2)
            });
        },

        /*广告图片其余帧的属性*/
        setSliceItems:function() {
            var self        = this,
                sliceSize   = this.sliceItems.size()/2,
                /*右侧剩余帧*/
                rightSlice  = this.sliceItems.slice(0,sliceSize),
                rw           = this.setting.imgWidth ,
                rh           = this.setting.imgHeight,
                firstLeft   = (this.setting.width-this.setting.imgWidth)/2,
                // level = sliceSize 右边这一组有几张图片就分几层，因此层数与右侧图片数相等
                gap          = firstLeft/sliceSize;

            rightSlice.each(function(i) {
                    rw  *= self.setting.scale;
                    rh  *= self.setting.scale;
                    var rLeft = firstLeft + self.setting.imgWidth+(i+1)*gap - rw,
                        rOpacity = 1/(i+2);
                    $(this).css({
                            "width":rw,
                            "height":rh,
                            "opacity":rOpacity,
                            "left":rLeft,
                            "top":self.verticalStyle(rh),
                            "z-index":sliceSize - i-1
                    });
                });

            /*左侧剩余帧*/
           var leftSlice   = this.sliceItems.slice(sliceSize),
               /*左侧第一帧的属性等于右侧最后一帧*/
               lw           = rightSlice.last().width(),
               lh           = rightSlice.last().height();

           leftSlice.each(function (i) {
               var lOpacity = 1/(sliceSize-i+1);
               $(this).css({
                   "width":lw,
                   "height":lh,
                   "left":i*gap,
                   "opacity":lOpacity,
                   "top":self.verticalStyle(lh),
                   "z-index":i
               });
               lw   /= self.setting.scale;
               lh   /= self.setting.scale;
           });

         },

        /*获取人工定义的属性参数*/
        getSetting:function () {
            var setting = this.poster.attr("data-setting");
            if (setting && setting!=""){
                return $.parseJSON(setting);
            }
        },
        /*设置垂直对齐显示方式*/
        verticalStyle:function (offsetH){
            switch (this.setting.verticalAlign) {
                case "middle":
                    return (this.setting.height-offsetH)/2;
                    break;
                case "top":
                    return 0;
                    break;
                case "bottom":
                    return this.setting.height-offsetH;
                    break;
                default:
                    return (this.setting.height-offsetH)/2;
                    break;
            }
        },
        moveTo:  function (dir) {
             if (dir == "left") {
                 var _this_ = this;
                 var zIndexArr = [];
                 this.items.each(function () {
                     var self = $(this);
                     var prev = self.prev().get(0) ? self.prev() : _this_.lastItem,
                         width = prev.width(),
                         height = prev.height(),
                         left = prev.css("left"),
                         top = prev.css("top"),
                         opacity = prev.css("opacity"),
                         zIndex = prev.css("zIndex");
                     zIndexArr.push(zIndex);
                     self.animate({
                         "width": width,
                         "height": height,
                         "left": left,
                         "top": top,
                         "opacity": opacity
                         // "zIndex": zIndex
                     },_this_.setting.speed,function () {
                         _this_.animateFlag = true;
                     });

                 });
                 this.items.each(function (i) {
                     $(this).css("zIndex",zIndexArr[i]);
                 });
             } else if (dir == "right") {
                 var _this_ = this;
                 var zIndexArr = [];
                 this.items.each(function () {
                     var self = $(this);
                     var next = self.next().get(0) ? self.next() : _this_.firstItem,
                         width = next.width(),
                         height = next.height(),
                         left = next.css("left"),
                         top = next.css("top"),
                         opacity = next.css("opacity"),
                         zIndex = next.css("zIndex");
                     zIndexArr.push(zIndex);
                     self.animate({
                         "width": width,
                         "height": height,
                         "left": left,
                         "top": top,
                         "opacity": opacity
                         // "zIndex": zIndex
                     },_this_.setting.speed,function () {
                         _this_.animateFlag = true;
                     });
                 });
                 this.items.each(function (i) {
                     $(this).css("zIndex",zIndexArr[i]);
                 });
             }
         },
        autoPlay: function () {
            var self = this;
            // clearInterval(this.timer);
            this.timer = setInterval(function(){self.nextBtn.click();},self.setting.delay);

        }
    };
    Carousel.init = function (posters) {
        posters.each(function () {
            new Carousel($(this));
        });
    };
    window["Carousel"] = Carousel;
})(jQuery);