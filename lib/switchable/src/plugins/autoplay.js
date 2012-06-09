 //Switchable autoplay Plugin
define(function(require, exports, module) {

    var SCROLL = 'scroll';
    var $ = require('jquery');

    //这个是不是需要优化？
    var win = window,
        checkElemInViewport = function(elem) {
            // 只计算上下位置是否在可视区域, 不计算左右
            var w = $(win);
            elem = $(elem);
            var scrollTop = w.scrollTop(),
                vh = w.height(),
                elemOffset = elem.offset(),
                elemHeight = elem.height();
            return elemOffset.top > scrollTop &&
                elemOffset.top + elemHeight < scrollTop + vh;
        };


    module.exports = {

        attrs: {
            autoplay: false,

            // 自动播放的间隔时间
            interval: 5000
        },

        isNeeded: function() {
            return this.get('autoplay');
        },

        install: function() {
            var element = this.element;
            var interval = this.get('interval');
            var timer;
            var that = this;

            if (this.get('pauseOnScroll')) {
                this.__scrollDetect = buffer(function() {
                    // 依次检查页面上所有 switchable 对象是否在可视区域内
                    that[checkElemInViewport(element) ? 'start' : 'stop']();
                }, 200);
                $(win).on(SCROLL + '.' + this.cid, this.__scrollDetect);
            }

            function startAutoplay() {
                // 设置自动播放
                timer = setInterval(function() {
                    if (that.paused) {
                        return;
                    }
                    // 自动播放默认 forward（不提供配置），这样可以保证 circular 在临界点正确切换
                    // 用户 mouseenter 不提供 forward ，全景滚动
                    that.next();
                }, interval, true);
            }

            // go
            startAutoplay();

            function cancel() {
                if (timer) {
                    clearInterval(timer);
                    timer = undefined;
                }
            }

            // 添加 stop 方法，使得外部可以停止自动播放
            this.stop = function() {
                cancel();
                // paused 可以让外部知道 autoplay 的当前状态
                that.paused = true;
            };

            this.start = function() {
                cancel();
                that.paused = false;
                startAutoplay();
            };

            // 鼠标悬停，停止自动播放
            if (this.get('pauseOnHover')) {
                var events = {};
                events['mouseenter'] = 'stop';
                events['mouseleave'] = 'start';
                this.delegateEvents(events);
            }
        },

        destroy: function() {
            // slide中扩展的自动滚动模块中的事件。
            this.stop();
            if (this.__scrollDetect) {
                $(win).off(SCROLL + '.' + this.cid);
            }
        }
    };

    var buffer = function(fn, ms) {
        var bufferTimer = null;
        ms = ms || 150;

        function f() {
            f.stop();
            bufferTimer = setTimeout(fn, ms);
        }

        f.stop = function() {
            if (bufferTimer) {
                clearTimeout(bufferTimer);
                bufferTimer = 0;
            }
        };

        return f;
    };

});
