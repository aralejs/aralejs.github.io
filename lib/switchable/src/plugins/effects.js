//Switchable Effect module.

define(function(require, exports, module) {

    var $ = require('jquery');
    var Easing = require('easing');

    var PI = Math.PI,
        pow = Math.pow,
        sin = Math.sin,
        BACK_CONST = 1.70158;

    var OPACITY = 'opacity',
        Z_INDEX = 'z-index',
        POSITION = 'position',
        RELATIVE = 'relative',
        ABSOLUTE = 'absolute',
        SCROLLX = 'scrollx',
        SCROLLY = 'scrolly',
        FADE = 'fade',
        LEFT = 'left',
        TOP = 'top',
        FLOAT = 'float',
        PX = 'px',
        Effects;

    // 定义效果集
    var Effects = module.exports = {
        isRequire: function() {
            var effect = this.get('effect');
            if (effect === 'none') {
                return false;
            }
            return true;
        },

        install: function(host) {
            // effect = scrollx, scrolly, fade
            var effect = this.get('effect'),
                panels = this.panels,
                content = this.content,
                step = this.get('step'),
                panels0 = panels[0],
                activeIndex = this.get('activeIndex');

            // 注：所有 panel 的尺寸应该相同
            // 最好指定第一个 panel 的 width 和 height;
            // 因为 Safari 下，图片未加载时，读取的 offsetHeight 等值会不对
            // 2. 初始化 panels 样式
            // 这些特效需要将 panels 都显示出来
            // 3. 在 CSS 里，需要给 container 设定高宽和 overflow: hidden

            panels.show();
            switch (effect) {
                // 如果是滚动效果
                case SCROLLX:
                case SCROLLY:

                    // 设置定位信息，为滚动效果做铺垫
                    content.css(POSITION, ABSOLUTE);

                    // 注：content 的父级不一定是 container
                    if (content.parent().css(POSITION) == 'static') {
                        content.parent().css(POSITION, RELATIVE);
                    }

                    // 水平排列
                    if (effect === SCROLLX) {
                        panels.css(FLOAT, LEFT);
                        // 设置最大宽度，以保证有空间让 panels 水平排布
                        content.width('9999px');
                    }

                    // 只有 scrollX, scrollY 需要设置 viewSize
                    // 其他情况下不需要
                    // 1. 获取高宽
                    var _viewSize = this.get('viewSize');
                    var _vW = panels0 && panels0.offsetWidth * step;
                    var _vH = panels0 && panels0.offsetHeight * step;

                    this.viewSize = [
                        _viewSize[0] || _vW,
                        _viewSize[1] || _vH
                    ];

                    if (!this.viewSize[0]) {
                        throw 'switchable must specify viewSize' +
                                'if there is no panels';
                    }
                    break;

                // 如果是透明效果，则初始化透明
                case FADE:
                    var min = activeIndex * step,
                        max = min + step - 1,
                        isActivePanel;

                    $.each(panels, function(i, panel) {
                        isActivePanel = i >= min && i <= max;
                        $(panel).css({
                            opacity: isActivePanel ? 1 : 0,
                            position: ABSOLUTE,
                            zIndex: isActivePanel ? 9 : 1
                        });
                    });
                    break;
            }
        }
    };

    Effects.methods = {
        // 最朴素的显示/隐藏效果
        none: function(panelInfo) {
            var fromPanels = panelInfo.fromPanels,
                toPanels = panelInfo.toPanels;

            if (fromPanels) {
                $(fromPanels).hide();
            }
            $(toPanels).show();
        },

        // 淡隐淡现效果
        fade: function(panelInfo) {
            var that = this,
                fromPanels = panelInfo.fromPanels,
                toPanels = panelInfo.toPanels;

            if (fromPanels && fromPanels.length !== 1) {
                throw 'fade effect only supports step == 1.';
            }

            var fromEl = fromPanels ? $(fromPanels[0]) : null;
            var toEl = $(toPanels[0]);

            if (this.anim) {
                // 不执行回调
                this.anim.stop();
                // 防止上个未完，放在最下层
                this.anim.fromEl.css({
                    zIndex: 1,
                    opacity: 0
                });
                // 把上个的 toEl 放在最上面，防止 self.anim.toEl == fromEL
                // 压不住后面了
                this.anim.toEl.css('zIndex', 9);
            }

            // 首先显示下一张
            toEl.css(OPACITY, 1);
            if (fromEl && fromEl.length > 0) {
                // 动画切换
                this.anim = $(fromEl).animate({
                    opacity: 0
                }, this.get('duration'), this.get('easing'), function() {
                    that.anim = undefined; // free
                    // 切换 z-index
                    toEl.css(Z_INDEX, 9);
                    fromEl.css(Z_INDEX, 1);
                });
                this.anim.toEl = toEl;
                this.anim.fromEl = fromEl;
            } else {
                //初始情况下没有必要动画切换
                toEl.css(Z_INDEX, 9);
            }
        },

        // 水平/垂直滚动效果
        scroll: function(panelInfo) {
            var that = this,
                toIndex = panelInfo.toIndex,
                fromIndex = panelInfo.fromIndex,
                isX = this.get('effect') === SCROLLX,
                diff = this.viewSize[isX ? 0 : 1] * toIndex,
                duration = this.get('duration'),
                props = { };

            props[isX ? LEFT : TOP] = -diff + PX;

            if (this.anim) {
                this.anim.stop();
            }

            // 强制动画或者不是初始化
            if (fromIndex > -1) {
                this.anim = this.content.animate(
                    props, duration, this.get('easing'), function() {
                    that.anim = undefined; // free
                });
             } else {
                this.content.css(props);
            }
        },

        _switchView: function(panelInfo) {
            var that = this,
                effect = this.get('effect'),
                fn = $.isFunction(effect) ? effect : this[effect];
            fn.apply(this, arguments);
        }
    };
    Effects.methods[SCROLLY] = Effects.methods.scroll;
    Effects.methods[SCROLLX] = Effects.methods.scroll;
});

