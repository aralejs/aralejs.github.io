define("#switchable/0.9.4/plugins/effects-debug", ["jquery"], function(require, exports, module) {

    var $ = require('jquery');

    var SCROLLX = 'scrollx';
    var SCROLLY = 'scrolly';
    var FADE = 'fade';


    // 切换效果插件
    module.exports = {

        isNeeded: function() {
            return this.get('effect') !== 'none';
        },

        install: function() {
            var panels = this.panels;

            // 注：
            // 1. 所有 panel 的尺寸应该相同
            //    最好指定第一个 panel 的 width 和 height
            //    因为 Safari 下，图片未加载时，读取的 offsetHeight 等值会不对
            // 2. 初始化 panels 样式
            //    这些特效需要将 panels 都显示出来
            // 3. 在 CSS 里，需要给 container 设定高宽和 overflow: hidden
            panels.show();

            var effect = this.get('effect');
            var step = this.get('step');

            // 初始化滚动效果
            if (effect.indexOf('scroll') === 0) {
                var content = this.content;
                var firstPanel = panels.eq(0);

                // 设置定位信息，为滚动效果做铺垫
                content.css('position', 'absolute');

                // 注：content 的父级不一定是 container
                if (content.parent().css('position') === 'static') {
                    content.parent().css('position', 'relative');
                }

                // 水平排列
                if (effect === SCROLLX) {
                    panels.css('float', 'left');
                    // 设置最大宽度，以保证有空间让 panels 水平排布
                    content.width('9999px');
                }

                // 只有 scrollX, scrollY 需要设置 viewSize
                // 其他情况下不需要
                var viewSize = this.get('viewSize');
                if (!viewSize[0]) {
                    viewSize[0] = firstPanel.outerWidth() * step;
                    viewSize[1] = firstPanel.outerHeight() * step;
                    this.set('viewSize', viewSize);
                }

                if (!viewSize[0]) {
                    throw new Error('Please specify viewSize manually');
                }
            }
            // 初始化淡隐淡出效果
            else if (effect === FADE) {
                var activeIndex = this.get('activeIndex');
                var min = activeIndex * step;
                var max = min + step - 1;

                panels.each(function(i, panel) {
                    var isActivePanel = i >= min && i <= max;
                    $(panel).css({
                        opacity: isActivePanel ? 1 : 0,
                        position: 'absolute',
                        zIndex: isActivePanel ? 9 : 1
                    });
                });
            }

            // 覆盖 switchPanel 方法
            this._switchPanel = function(panelInfo) {
                var effect = this.get('effect');
                var fn = $.isFunction(effect) ? effect : Effects[effect];
                fn.call(this, panelInfo);
            };
        }
    };


    // 切换效果方法集
    var Effects = {

        // 淡隐淡现效果
        fade: function(panelInfo) {
            // 简单起见，目前不支持 step > 1 的情景。若需要此效果时，可修改结构来达成。
            if (this.get('step') > 1) {
                throw new Error('Effect "fade" only supports step === 1');
            }

            var fromPanel = panelInfo.fromPanels.eq(0);
            var toPanel = panelInfo.toPanels.eq(0);
            var anim = this.anim;

            if (anim) {
                // 立刻停止，以开始新的
                anim.stop(false, true);
            }

            // 首先显示下一张
            toPanel.css('opacity', 1);

            if (fromPanel[0]) {
                var duration = this.get('duration');
                var easing = this.get('easing');
                var that = this;

                // 动画切换
                this.anim = fromPanel.animate({ opacity: 0 }, duration, easing,
                        function() {
                            that.anim = null; // free

                            // 切换 z-index
                            toPanel.css('zIndex', 9);
                            fromPanel.css('zIndex', 1);
                        });
            }
            // 初始情况下没有必要动画切换
            else {
                toPanel.css('zIndex', 9);
            }
        },

        // 水平/垂直滚动效果
        scroll: function(panelInfo) {
            var isX = this.get('effect') === SCROLLX;
            var diff = this.get('viewSize')[isX ? 0 : 1] * panelInfo.toIndex;

            var props = {};
            props[isX ? 'left' : 'top'] = -diff + 'px';

            if (this.anim) {
                this.anim.stop();
            }

            if (panelInfo.fromIndex > -1) {
                var that = this;
                var duration = this.get('duration');
                var easing = this.get('easing');

                this.anim = this.content.animate(props, duration, easing,
                        function() {
                            that.anim = null; // free
                        });
            }
            else {
                this.content.css(props);
            }
        }
    };

    Effects[SCROLLY] = Effects.scroll;
    Effects[SCROLLX] = Effects.scroll;
    module.exports.Effects = Effects;

});
