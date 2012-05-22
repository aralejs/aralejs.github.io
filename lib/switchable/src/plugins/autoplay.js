 //Switchable autoplay Plugin
define(function(require, exports, module) {
    var utils = require('../utils');

    var DURATION = 200,
        //win = S.Env.host,
        win = window,
//TODO 看是否能通过postion模块进行改造
        checkElemInViewport = function(elem) {
            return true;
            // 只计算上下位置是否在可视区域, 不计算左右
            var scrollTop = DOM.scrollTop(),
                vh = DOM.viewportHeight(),
                elemOffset = DOM.offset(elem),
                elemHeight = DOM.height(elem);
            return elemOffset.top > scrollTop &&
                elemOffset.top + elemHeight < scrollTop + vh;
        };

    var defaults = {
        // 当 Switchable 对象不在可视区域中时停止动画切换
        pauseOnScroll: false,
        autoplay: false,
        interval: 3, // 自动播放间隔时间
        pauseOnHover: true  // triggerType 为 mouse 时，鼠标悬停在 slide 上是否暂停自动播放
    };
    var Autoplay = module.exports = {
        initAutoplay: function() {
            var that = this;
            var options = this.options;
            var container = this.container;
            //插件中的默认配置混入到模块中，默认不覆盖。因为初始化的参数已经提前混入了。
            utils.mix(this.options, defaults, false);

            var interval = options.interval * 1000;

            if (options.pauseOnScroll) {
                this.__scrollDetect = utils.buffer(function() {
                    // 依次检查页面上所有 switchable 对象是否在可视区域内
                    that[checkElemInViewport(container) ? 'start' : 'stop']();
                }, DURATION);
                $(win).on('scroll', this.__scrollDetect);
            }

            function startAutoplay() {
                // 设置自动播放
                timer = utils.later(function() {
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

            // 添加 stop 方法，使得外部可以停止自动播放
            this.stop = function() {

                if (timer) {
                    timer.cancel();
                    timer = undefined;
                }
                // paused 可以让外部知道 autoplay 的当前状态
                that.paused = true;
            };

            this.start = function() {

                if (timer) {
                    timer.cancel();
                    timer = undefined;
                }
                that.paused = false;
                startAutoplay();
            };

            // 鼠标悬停，停止自动播放
            if (options.pauseOnHover) {

                var events = {};
                events['mouseenter'] = 'stop';
                events['mouseleave'] = 'start';
                this.delegateEvents(events);
            }
        }
    };
});
