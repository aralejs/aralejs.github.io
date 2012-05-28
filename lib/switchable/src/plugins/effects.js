//Switchable Effect module.

define(function(require, exports, module) {

    var $ = require('jquery');
    var _easing = require('../extra/easing');

    var PI = Math.PI,
        pow = Math.pow,
        sin = Math.sin,
        BACK_CONST = 1.70158;
    //扩展easing
       var easing = $.easing;
    for (var key in _easing) {
        easing[key] = _easing[key];
    }

    var DISPLAY = 'display',
        BLOCK = 'block',
        NONE = 'none',
        OPACITY = 'opacity',
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
//        EVENT_ADDED = 'added',
//        EVENT_REMOVED = 'removed';

    /**
     * 定义效果集
     */
    var Effects = module.exports = {
          initEffects: function(host) {
            var options = this.options,
                effect = options.effect,
                panels = this.panels,
                content = this.content,
                step = options.step,
                panels0 = panels[0],
                activeIndex = this.activeIndex;

            // 注：所有 panel 的尺寸应该相同
            // 最好指定第一个 panel 的 width 和 height;
            // 因为 Safari 下，图片未加载时，读取的 offsetHeight 等值会不对

            // 2. 初始化 panels 样式
            if (effect !== NONE) { // effect = scrollx, scrolly, fade

                // 这些特效需要将 panels 都显示出来
                panels.css(DISPLAY, BLOCK);

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
                        this.viewSize = [
                            options.viewSize[0] || panels0 && panels0.offsetWidth * step,
                            options.viewSize[1] || panels0 && panels0.offsetHeight * step
                        ];

                        if (!this.viewSize[0]) {
                            alert('switchable must specify viewSize if there is no panels', 'error');
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
            // 3. 在 CSS 里，需要给 container 设定高宽和 overflow: hidden
        },

        // 最朴素的显示/隐藏效果
        none: function(callback) {
            var fromIndex = this.fromIndex,
                panelInfo = this._getFromToPanels(),
                fromPanels = panelInfo.fromPanels,
                toPanels = panelInfo.toPanels;

            if (fromPanels) {
                $(fromPanels).css(DISPLAY, NONE);
            }
            $(toPanels).css(DISPLAY, BLOCK);
            callback && callback();
        },

        // 淡隐淡现效果
        fade: function(callback) {
            var that = this;
            var fromIndex = this.fromIndex,
                panelInfo = this._getFromToPanels(),
                fromPanels = panelInfo.fromPanels,
                toPanels = panelInfo.toPanels;

            if (fromPanels && fromPanels.length !== 1) {
                alert('fade effect only supports step == 1.');
            }

            var options = this.options;
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
                }, options.duration, options.easing, function() {
                    that.anim = undefined; // free
                    // 切换 z-index
                    toEl.css(Z_INDEX, 9);
                    fromEl.css(Z_INDEX, 1);
                    callback && callback();
                });
                this.anim.toEl = toEl;
                this.anim.fromEl = fromEl;
            } else {
                //初始情况下没有必要动画切换
                toEl.css(Z_INDEX, 9);
                callback && callback();
            }
        },

        // 水平/垂直滚动效果
        scroll: function(callback, forceAnimation) {
            var that = this;
            var fromIndex = this.fromIndex,
                options = this.options;
                isX = options.effect === SCROLLX,
                diff = this.viewSize[isX ? 0 : 1] * this.activeIndex,
                props = { };
            props[isX ? LEFT : TOP] = -diff + PX;
            if (this.anim) {
                this.anim.stop();
            }
            // 强制动画或者不是初始化
            if (forceAnimation || fromIndex > -1) {
                this.anim = this.content.animate(props, options.duration, options.easing, function() {
                    that.anim = undefined; // free
                    callback && callback();
                });
             } else {
                this.content.css(props);
                callback && callback();
            }
        },
        _switchView: function(direction, ev, callback) {
            var that = this,
                options = this.options,
                effect = options.effect,
                fn = $.isFunction(effect) ? effect : Effects[effect];

            fn.call(this, function() {
                that._fireOnSwitch(ev);
                callback && callback.call(that);
            }, direction);
        }

    };
    Effects[SCROLLX] = Effects[SCROLLY] = Effects.scroll;
});

