define("#switchable/0.9.5/switchable-debug", ["#jquery/1.7.2/jquery-debug", "#widget/0.9.16/widget-debug", "#base/0.9.16/base-debug", "#class/0.9.2/class-debug", "#events/0.9.1/events-debug", "#base/0.9.16/aspect-debug", "#base/0.9.16/attribute-debug", "#widget/0.9.16/daparser-debug", "#widget/0.9.16/auto-render-debug", "#switchable/0.9.5/const-debug", "#switchable/0.9.5/plugins/effects-debug", "#switchable/0.9.5/plugins/autoplay-debug", "#switchable/0.9.5/plugins/circular-debug", "#switchable/0.9.5/plugins/multiple-debug"], function(require, exports, module) {

    // Switchable
    // -----------
    // 可切换组件，核心特征是：有一组可切换的面板（Panel），可通过触点（Trigger）来触发。
    // 感谢：
    //  - https://github.com/kissyteam/kissy/blob/master/src/switchable/


    var $ = require("#jquery/1.7.2/jquery-debug");
    var Widget = require("#widget/0.9.16/widget-debug");

    var CONST = require("#switchable/0.9.5/const-debug");
    var Effects = require("#switchable/0.9.5/plugins/effects-debug");
    var Autoplay = require("#switchable/0.9.5/plugins/autoplay-debug");
    var Circular = require("#switchable/0.9.5/plugins/circular-debug");
    var Multiple = require("#switchable/0.9.5/plugins/multiple-debug");


    var Switchable = Widget.extend({

        attrs: {

            // 用户传入的 triggers 和 panels
            // 可以是 Selector、jQuery 对象、或 DOM 元素集
            triggers: {
                value: [],
                getter: function(val) {
                    return $(val);
                }
            },
            panels: {
                value: [],
                getter: function(val) {
                    return $(val);
                }
            },

            // 是否包含 triggers，用于没有传入 triggers 时，是否自动生成的判断标准
            hasTriggers: true,
            // 触发类型
            triggerType: 'hover', // or 'click'
            // 触发延迟
            delay: 100,

            // 切换效果，可取 scrollx | scrolly | fade 或直接传入 effect function
            effect: 'none',
            easing: 'linear',
            duration: 500,

            // 初始切换到哪个面板
            activeIndex: 0,

            // 一屏内有多少个 panels
            step: 1,
            // 有多少屏
            length: {
                readOnly: true,
                getter: function() {
                    return this.panels.length / this.get('step');
                }
            },

            // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
            viewSize: []
        },

        setup: function() {
            this._parseRole();
            this._initElement();
            this._initPanels();
            this._initTriggers();
            this._initPlugins();
            this.render();
        },


        _parseRole: function() {
            var role = this.dataset.role;
            if (!role) return;

            var element = this.element;
            var triggers = this.get('triggers');
            var panels = this.get('panels');

            // attr 里没找到时，才根据 data-role 来解析
            if (triggers.length === 0 && (role.trigger || role.nav)) {
                triggers = element.find(role.trigger || role.nav + ' > *');
            }

            if (panels.length === 0 && (role.panel || role.content)) {
                panels = element.find(role.panel || role.content + ' > *');
            }

            this.set('triggers', triggers);
            this.set('panels', panels);
        },

        _initElement: function() {
            this.element.addClass(CONST.UI_SWITCHABLE);
        },

        _initPanels: function() {
            var panels = this.panels = this.get('panels');
            if (panels.length === 0) {
                throw new Error('panels.length is ZERO');
            }

            this.content = panels.parent().addClass(CONST.CONTENT_CLASS);
            panels.addClass(CONST.PANEL_CLASS);
        },

        _initTriggers: function() {
            var triggers = this.triggers = this.get('triggers');

            // 用户没有传入 triggers，也没有通过 data-role 指定时，如果
            // hasTriggers 为 true，则自动生成 triggers
            if (triggers.length === 0 && this.get('hasTriggers')) {
                this.nav = generateTriggersMarkup(
                        this.get('length'),
                        this.get('activeIndex')
                ).appendTo(this.element);

                // update triggers
                this.triggers = this.nav.children();
            }
            else {
                this.nav = triggers.parent();
            }

            this.triggers.addClass(CONST.TRIGGER_CLASS);
            this.nav.addClass(CONST.NAV_CLASS);

            this.triggers.each(function(i, trigger) {
                $(trigger).data('value', i);
            });
            this._bindTriggers();
        },

        _initPlugins: function() {
            this._plugins = [];

            this._plug(Effects);
            this._plug(Autoplay);
            this._plug(Circular);
            this._plug(Multiple);
        },


        _bindTriggers: function() {
            var that = this;

            if (this.get('triggerType') === 'click') {
                this.triggers.click(focus);
            }
            // hover
            else {
                this.triggers.hover(focus, leave);
            }

            function focus(ev) {
                that._onFocusTrigger(ev.type, $(this).data('value'));
            }

            function leave() {
                clearTimeout(that._switchTimer);
            }
        },

        _onFocusTrigger: function(type, index) {
            var that = this;

            // click or tab 键激活时
            if (type === 'click') {
                this.switchTo(index);
            }

            // hover
            else {
                this._switchTimer = setTimeout(function() {
                    that.switchTo(index);
                }, this.get('delay'));
            }
        },


        // 切换到指定 index
        switchTo: function(toIndex) {
            this.set('activeIndex', toIndex);
            return this;
        },

        _onRenderActiveIndex: function(toIndex, fromIndex) {
            if (this._triggerIsValid(toIndex, fromIndex)) {
                this._switchTo(toIndex, fromIndex);
            }
        },

        _switchTo: function(toIndex, fromIndex) {
            this.trigger('switch', toIndex, fromIndex);
            this._switchTrigger(toIndex, fromIndex);
            this._switchPanel(this._getPanelInfo(toIndex, fromIndex));
            this.trigger('switched', toIndex, fromIndex);
        },

        // 触发是否有效
        _triggerIsValid: function(toIndex, fromIndex) {
            return toIndex !== fromIndex;
        },

        _switchTrigger: function(toIndex, fromIndex) {
            var triggers = this.triggers;
            if (triggers.length < 1) return;

            triggers.eq(fromIndex).removeClass(CONST.ACTIVE_CLASS);
            triggers.eq(toIndex).addClass(CONST.ACTIVE_CLASS);
        },

        _switchPanel: function(panelInfo) {
            // 默认是最简单的切换效果：直接隐藏/显示
            panelInfo.fromPanels.hide();
            panelInfo.toPanels.show();
        },

        _getPanelInfo: function(toIndex, fromIndex) {
            var panels = this.panels.get();
            var step = this.get('step');

            var fromPanels, toPanels;

            if (fromIndex > -1) {
                var begin = fromIndex * step;
                var end = (fromIndex + 1) * step;
                fromPanels = panels.slice(begin, end);
            }

            toPanels = panels.slice(toIndex * step, (toIndex + 1) * step);

            return {
                toIndex: toIndex,
                fromIndex: fromIndex,
                toPanels: $(toPanels),
                fromPanels: $(fromPanels)
            };
        },

        // 切换到上一视图
        prev: function() {
            var fromIndex = this.get('activeIndex');
            // 考虑循环切换的情况
            var index = (fromIndex - 1 + this.get('length')) % this.length;
            this.switchTo(index);
        },

        // 切换到下一视图
        next: function() {
            var fromIndex = this.get('activeIndex');
            var index = (fromIndex + 1) % this.get('length');
            this.switchTo(index);
        },


        _plug: function(plugin) {
            if (!plugin.isNeeded.call(this)) return;

            var pluginAttrs = plugin.attrs;
            var methods = plugin.methods;

            if (pluginAttrs) {
                for (var key in pluginAttrs) {
                    if (pluginAttrs.hasOwnProperty(key) &&
                            // 不覆盖用户传入的配置
                            !(key in this.attrs)) {
                        this.set(key, pluginAttrs[key]);
                    }
                }
            }

            if (methods) {
                for (var method in methods) {
                    if (methods.hasOwnProperty(method)) {
                        // 覆盖实例方法。
                        this[method] = methods[method];
                    }
                }
            }

            if (plugin.install) {
                plugin.install.call(this);
            }

            this._plugins.push(plugin);
        },


        destroy: function() {
            $.each(this._plugins, function(i, plugin) {
                if (plugin.destroy) {
                    plugin.destroy.call(this);
                }
            });

            Switchable.superclass.destroy.call(this);
        }
    });

    module.exports = Switchable;


    // Helpers
    // -------

    function generateTriggersMarkup(length, activeIndex) {
        var nav = $('<ul>');

        for (var i = 0; i < length; i++) {
            var className = i === activeIndex ? CONST.ACTIVE_CLASS : '';

            $('<li>', {
                'class': className,
                'html': i + 1
            }).appendTo(nav);
        }

        return nav;
    }

});


define("#switchable/0.9.5/plugins/autoplay-debug", ["#jquery/1.7.2/jquery-debug"], function(require, exports, module) {

    var $ = require("#jquery/1.7.2/jquery-debug");


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
            var EVENT_NS = '.' + this.cid;
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


define("#switchable/0.9.5/plugins/effects-debug", ["#jquery/1.7.2/jquery-debug"], function(require, exports, module) {

    var $ = require("#jquery/1.7.2/jquery-debug");

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


define("#switchable/0.9.5/plugins/circular-debug", ["#jquery/1.7.2/jquery-debug", "#switchable/0.9.5/plugins/effects-debug"], function(require, exports, module) {

    var $ = require("#jquery/1.7.2/jquery-debug");

    var SCROLLX = 'scrollx';
    var SCROLLY = 'scrolly';
    var Effects = require("#switchable/0.9.5/plugins/effects-debug").Effects;


    // 无缝循环滚动插件
    module.exports = {

        // 仅在开启滚动效果时需要
        isNeeded: function() {
            var effect = this.get('effect');
            var circular = this.get('circular');
            return circular && (effect === SCROLLX || effect === SCROLLY);
        },

        install: function() {
            this.set('scrollType', this.get('effect'));
            this.set('effect', 'scrollCircular');
        }
    };

    Effects.scrollCircular = function(panelInfo) {
        var toIndex = panelInfo.toIndex;
        var fromIndex = panelInfo.fromIndex;
        var len = this.get('length');

        var isBackwardCritical = (fromIndex === 0 && toIndex === len - 1);
        var isForwardCritical = (fromIndex === len - 1 && toIndex === 0);

        var isBackward = isBackwardCritical ||
                (!isForwardCritical && toIndex < fromIndex);
        var isCritical = isBackwardCritical || isForwardCritical;

        var isX = this.get('scrollType') === SCROLLX;
        var prop = isX ? 'left' : 'top';
        var viewDiff = this.get('viewSize')[isX ? 0 : 1];
        var diff = -viewDiff * toIndex;

        // 开始动画前，先停止掉上一动画
        if (this.anim) {
            this.anim.stop(false, true);
        }

        // 在临界点时，先调整 panels 位置
        if (isCritical) {
            diff = adjustPosition.call(this, isBackward, prop, viewDiff);
        }

        var props = {};
        props[prop] = diff + 'px';

        // 开始动画
        if (fromIndex > -1) {
            var duration = this.get('duration');
            var easing = this.get('easing');
            var that = this;

            this.anim = this.content.animate(props, duration, easing,
                    function() {
                        that.anim = null; // free

                        // 复原位置
                        if (isCritical) {
                            resetPosition.call(that, isBackward,
                                    prop, viewDiff);
                        }
                    });
        }
        // 初始化
        else {
            this.content.css(props);
        }

    };

    // 调整位置
    function adjustPosition(isBackward, prop, viewDiff) {
        var step = this.get('step');
        var len = this.get('length');
        var start = isBackward ? len - 1 : 0;
        var from = start * step;
        var to = (start + 1) * step;
        var diff = isBackward ? viewDiff : -viewDiff * len;

        // 调整 panels 到下一个视图中
        var toPanels = $(this.panels.get().slice(from, to));
        toPanels.css('position', 'relative');
        toPanels.css(prop, -diff + 'px');

        // 返回偏移量
        return diff;
    }

    // 复原位置
    function resetPosition(isBackward, prop, viewDiff) {
        var step = this.get('step');
        var len = this.get('length');
        var start = isBackward ? len - 1 : 0;
        var from = start * step;
        var to = (start + 1) * step;

        // 滚动完成后，复位到正常状态
        var toPanels = $(this.panels.get().slice(from, to));
        toPanels.css('position', '');
        toPanels.css(prop, '');

        // 瞬移到正常位置
        this.content.css(prop, isBackward ? -viewDiff * (len - 1) : '');
    }

});


define("#switchable/0.9.5/plugins/multiple-debug", ["#switchable/0.9.5/const-debug"], function(require, exports, module) {

    var CONST = require("#switchable/0.9.5/const-debug");


    // 手风琴组件
    module.exports = {

        isNeeded: function() {
            return this.get('multiple');
        },

        methods: {
            _switchTrigger: function(toIndex) {
                this.triggers.eq(toIndex).toggleClass(CONST.ACTIVE_CLASS);
            },

            _triggerIsValid: function() {
                // multiple 模式下，再次触发意味着切换展开/收缩状态
                return true;
            },

            _switchPanel: function(panelInfo) {
                panelInfo.toPanels.toggle();
            }
        }
    };

});


define("#switchable/0.9.5/const-debug", [], function(require, exports) {

    var UI_SWITCHABLE = 'ui-switchable';

    // 内部默认的 className
    exports.UI_SWITCHABLE = UI_SWITCHABLE;
    exports.NAV_CLASS = UI_SWITCHABLE + '-nav';
    exports.CONTENT_CLASS = UI_SWITCHABLE + '-content';
    exports.TRIGGER_CLASS = UI_SWITCHABLE + '-trigger';
    exports.PANEL_CLASS = UI_SWITCHABLE + '-panel';
    exports.ACTIVE_CLASS = UI_SWITCHABLE + '-active';
    exports.PREV_BTN_CLASS = UI_SWITCHABLE + '-prev-btn';
    exports.NEXT_BTN_CLASS = UI_SWITCHABLE + '-next-btn';
    exports.DISABLED_BTN_CLASS = UI_SWITCHABLE + '-disabled-btn';

});
