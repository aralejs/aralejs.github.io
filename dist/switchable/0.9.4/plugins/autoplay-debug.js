define("#switchable/0.9.4/plugins/autoplay-debug", ["jquery"], function(require, exports, module) {

    var $ = require('jquery');


    // 自动播放插件
    module.exports = {

        attrs: {
            autoplay: true,

            // 自动播放的间隔时间
            interval: 5000,

            // 滚出可视区域后，是否停止自动播放
            pauseOnScroll: true,

            // 鼠标悬停时，是否停止自动播放
            pauseOnHover: true
        },

        isNeeded: function() {
            return this.get('autoplay');
        },

        install: function() {
            var element = this.element;
            var EVENT_NS = '.' + this.cid;
            var timer;
            var interval = this.get('interval');
            var that = this;

            // start autoplay
            start();

            function start() {
                // 停止之前的
                stop();

                // 设置状态
                that.paused = false;

                // 开始现在的
                timer = setInterval(function() {
                    if (that.paused) return;
                    that.next();
                }, interval);
            }

            function stop() {
                if (timer) {
                    clearInterval(timer);
                    timer = null;
                }
                that.paused = true;
            }

            // public api
            this.stop = stop;
            this.start = start;

            // 滚出可视区域后，停止自动播放
            if (this.get('pauseOnScroll')) {
                this._scrollDetect = throttle(function() {
                    that[isInViewport(element) ? 'start' : 'stop']();
                });
                win.on('scroll' + EVENT_NS, this._scrollDetect);
            }

            // 鼠标悬停时，停止自动播放
            if (this.get('pauseOnHover')) {
                this.element.hover(stop, start);
            }
        },

        destroy: function() {
            this.stop();

            if (this._scrollDetect) {
                this._scrollDetect.stop();
                win.off('scroll' + EVENT_NS);
            }
        }
    };


    // Helpers
    // -------


    function throttle(fn, ms) {
        ms = ms || 200;
        var throttleTimer;

        function f() {
            f.stop();
            throttleTimer = setTimeout(fn, ms);
        }

        f.stop = function() {
            if (throttleTimer) {
                clearTimeout(throttleTimer);
                throttleTimer = 0;
            }
        };

        return f;
    }


    var win = $(window);

    function isInViewport(element) {
        var scrollTop = win.scrollTop();
        var scrollBottom = scrollTop + win.height();
        var elementTop = element.offset().top;
        var elementBottom = elementTop + element.height();

        // 只判断垂直位置是否在可视区域，不判断水平。只有要部分区域在可视区域，就返回 true
        return elementTop < scrollBottom && elementBottom > scrollTop;
    }

});
