define(function(require, exports, module) {

    // Switchable
    // -----------------
    // Thanks to:
    //  https://github.com/kissyteam/kissy/blob/master/src/switchable/src/base.js

    var $ = require('jquery');

    var Widget = require('widget');
    var utils = require('./utils');

    //这两个插件模块， 看看能否有更好的方式进行注入。
    var Effects = require('./effects');
    var Autoplay = require('./autoplay');

    var Markup = require('./help/markup');

    //组件相关参数
    var DISPLAY = 'display',
        BLOCK = 'block',
        NONE = 'none',
        EventTarget = Event.Target,
        FORWARD = 'forward',
        BACKWARD = 'backward',
        EVENT_INIT = 'init',
        EVENT_BEFORE_SWITCH = 'beforeSwitch',
        EVENT_SWITCH = 'switch',

        EVENT_BEFORE_REMOVE = 'beforeRemove',
        EVENT_ADDED = 'added',
        EVENT_REMOVED = 'removed',
        CLS_PREFIX = 'ar-switchable-',
        CLS_TRIGGER_INTERNAL = CLS_PREFIX + 'trigger-internal',
        CLS_PANEL_INTERNAL = CLS_PREFIX + 'panel-internal';



    function getDomEvent(e) {
        var originalEvent = {};
        originalEvent.type = e.type;
        originalEvent.target = e.target;
        return {originalEvent: originalEvent};
    }

    var Switchable = module.exports = Widget.extend({
        options: {
            // markup 的类型，取值如下
            // 0 - 默认结构：通过 nav 和 content 来获取 triggers 和 panels
            markupType: Markup.DEFAULT,
            navCls: CLS_PREFIX + 'nav',
            contentCls: CLS_PREFIX + 'content',

            // 1 - 适度灵活：通过 cls 来获取 triggers 和 panels
            triggerCls: CLS_PREFIX + 'trigger',
            panelCls: CLS_PREFIX + 'panel',
            // 2 - 完全自由：直接传入 triggers 和 panels
            triggers: [],
            panels: [],
            // 是否有触点
            hasTriggers: true,
            // 触发类型
            triggerType: 'mouse', // or 'click'
            // 触发延迟
            delay: .1, // 100ms
            /**
             * 如果 activeIndex 和 switchTo 都不设置，相当于设置了 activeIndex 为 0
             */
            // 如果设置了 activeIndex ，则需要为对应的 panel html 添加 activeTriggerCls class
            activeIndex: -1,
            activeTriggerCls: 'ar-active',
            // 初始切换到面板，设置了 switchTo 就不需要设置 activeIndex
            // 以及为对应 html 添加 activeTriggerCls class
            switchTo: undefined,
            // 可见视图内有多少个 panels
            steps: 1,

            // 'scrollx', 'scrolly', 'fade' 或者直接传入 custom effect fn
            effect: NONE,
            duration: 500, // 动画的时长
            easing: 'easeNone', // easing method

            // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
            viewSize: []
        },
        initOptions: function(options) {
             // 调整配置信息
            if (!('markupType' in options)) {
                if (options.panelCls) {
                    options.markupType = Markup.NORMAL;
                } else if (options.panels) {
                    options.markupType = Markup.FLEXIBLE;
                }
            }
        },
        beforeCreate: function() {
            // parse markup
            var markup = Markup.parse(this.getElement(), this.options);

            this.nav = markup.nav;
            this.triggers = markup.triggers;
            this.panels = markup.panels;
            this.content = markup.content;

            this._resetLength();
            //this._initPlugins();
            this.trigger(EVENT_INIT);
        },

        bindAction: function() {
            if (this.options.hasTriggers) {
                this._bindTriggers();
            }
            //bind panels
            this._bindPanels();
        },
        postCreate: function() {

            var options = this.options;
            var willSwitch;
            //当前正在动画/切换的位置
            var activeIndex = this.activeIndex = options.activeIndex;
            if (options.effect !== NONE) {
                utils.mix(this, Effects, true);
                this.initEffects();
            }

            if (options.autoplay) {
                utils.mix(this, Autoplay, true);
                this.initAutoplay();
            }


            // 设置了 activeIndex
            // 要配合设置 markup
            if (activeIndex > -1) {
            }
            //设置了 switchTo , activeIndex == -1
            else if (typeof options.switchTo == 'number') {
                willSwitch = options.switchTo;
            }
            // 否则，默认都为 0
            // 要配合设置位置 0 的 markup
            else {
                activeIndex = this.activeIndex = 0;
            }

            if (willSwitch !== undefined) {
                this.switchTo(options.switchTo);
            }
        },

        //给 triggers 添加事件
        _bindTriggers: function() {
            //alert('bindTrigger---->');
            var that = this;
            var options = this.options;

            //navEl = KISSY.one(self.nav),
            var navEl = $(this.nav);
            var triggers = this.triggers;
            //给tigger添加class，使用委托
            $.each(triggers, function(index, trigger) {
                that._initTrigger(trigger);
            });
            navEl.on('click', '.' + CLS_TRIGGER_INTERNAL, function(e) {
                var trigger = e.currentTarget;
                var index = that._getTriggerIndex(trigger);
                that._onFocusTrigger(index, e);
            });

            if (options.triggerType === 'mouse') {
                navEl.on('mouseenter', '.' + CLS_TRIGGER_INTERNAL,
                    function(e) {
                        var trigger = e.currentTarget;
                        var index = that._getTriggerIndex(trigger);
                        that._onMouseEnterTrigger(index, e);
                    }).on('mouseleave', '.' + CLS_TRIGGER_INTERNAL, function() {
                        that._onMouseLeaveTrigger();
                    });
            }
        },
         //初始化Tirgger ，添加样式
        _initTrigger: function(trigger) {
            //DOM.addClass(trigger, CLS_TRIGGER_INTERNAL);
            $(trigger).addClass(CLS_TRIGGER_INTERNAL);
        },

        _bindPanels: function() {
            var that = this;
            var panels = this.panels;

            $.each(panels, function(index, panel) {
                that._initPanel(panel);
            });
        },

        //初始化panel,添加class
        _initPanel: function(panel) {
            //DOM.addClass(panel, CLS_PANEL_INTERNAL);
            $(panel).addClass(CLS_PANEL_INTERNAL);
        },

        //click or tab 键激活 trigger 时触发的事件
        _onFocusTrigger: function(index, e) {
            // 重复点击
            if (!this._triggerIsValid(index)) {
                return;
            }
            this._cancelSwitchTimer(); // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
            this.switchTo(index, undefined, getDomEvent(e));
        },

         //鼠标悬浮在 trigger 上时触发的事件
        _onMouseEnterTrigger: function(index, e) {
            var that = this;
            if (!this._triggerIsValid(index)) {
                return;
            }
            var ev = getDomEvent(e);
            // 重复悬浮。比如：已显示内容时，将鼠标快速滑出再滑进来，不必再次触发。
            this.switchTimer = utils.later(function() {
                that.switchTo(index, undefined, ev);
            }, that.options.delay * 1000);
        },

        //鼠标移出 trigger 时触发的事件
        _onMouseLeaveTrigger: function() {
            this._cancelSwitchTimer();
        },

        //重复触发时的有效判断
        _triggerIsValid: function(index) {
            return this.activeIndex !== index;
        },

        //取消切换定时器
        _cancelSwitchTimer: function() {
            if (this.switchTimer) {
                this.switchTimer.cancel();
                this.switchTimer = undefined;
            }
        },

        //获取trigger的索引
        _getTriggerIndex: function(trigger) {
            return utils.indexOf(trigger, this.triggers);
        },

        //重置 length: 代表有几个trigger
        _resetLength: function() {
            this.length = this._getLength();
        },

        //获取 Trigger的数量
        _getLength: function(panelCount) {
            var options = this.options;
            if (panelCount === undefined) {
                panelCount = this.panels.length;
            }
            // fix self.length 不为整数的情况, 会导致之后的判断 非0, by qiaohua 20111101
            return Math.ceil(panelCount / options.steps);
        },
        /**
         * 切换操作，对外 api
         * @param {Number} index 要切换的项.
         * @param {String} direction 方向，用于 autoplay/circular.
         * @param {Object} ev 引起该操作的事件.
         * @param {Function} callback 运行完回调，和绑定 switch 事件作用一样.
         */
        switchTo: function(index, direction, ev, callback) {
            var options = this.options,
                fromIndex = this.activeIndex,
                triggers = this.triggers;


            // 再次避免重复触发
            if (!this._triggerIsValid(index)) {
                return this;
            }
            //TODO 事件处理
            if (this.trigger(EVENT_BEFORE_SWITCH, {
                fromIndex: fromIndex,
                toIndex: index
            }) === false) {
                return this;
            }
            this.fromIndex = fromIndex;

            // switch active trigger
            if (options.hasTriggers) {
                this._switchTrigger(fromIndex > -1 ?
                    triggers[fromIndex] : null,
                    triggers[index]);
            }

            // switch active panels
            if (direction === undefined) {
                direction = index > fromIndex ? FORWARD : BACKWARD;
            }

            // 当前正在处理转移到 index
            this.activeIndex = index;

            // switch view
            this._switchView(direction, ev, function() {
                callback && callback.call(this);
            });

            return this; // chain
        },

        //切换当前触点
        _switchTrigger: function(fromTrigger, toTrigger) {
            var activeTriggerCls = this.options.activeTriggerCls;

            if (fromTrigger) {
                //DOM.removeClass(fromTrigger, activeTriggerCls);
                $(fromTrigger).removeClass(activeTriggerCls);
            }

            //DOM.addClass(toTrigger, activeTriggerCls);
            $(toTrigger).addClass(activeTriggerCls);
        },

        _getFromToPanels: function() {
            var fIndex = this.fromIndex,
                fromPanels,
                toPanels,
                steps = this.options.steps,
                panels = this.panels,
                toIndex = this.activeIndex;

            if (fIndex > -1) {
                fromPanels = panels.slice(fIndex * steps, (fIndex + 1) * steps);
            } else {
                fromPanels = null;
            }

            toPanels = panels.slice(toIndex * steps, (toIndex + 1) * steps);

            return {
                fromPanels: fromPanels,
                toPanels: toPanels
            };
        },

        //切换视图
        _switchView: function(direction, ev, callback) {
            var that = this;
            var panelInfo = this._getFromToPanels(),
                fromPanels = panelInfo.fromPanels,
                toPanels = panelInfo.toPanels;

            // 最简单的切换效果：直接隐藏/显示
            if (fromPanels) {
                //DOM.css(fromPanels, DISPLAY, NONE);
                $(fromPanels).css(DISPLAY, NONE);
            }

            //DOM.css(toPanels, DISPLAY, BLOCK);
            $(toPanels).css(DISPLAY, BLOCK);
            // fire onSwitch events
            // 同动画时保持一致，强制异步
            setTimeout(function() {
                that._fireOnSwitch(ev);
            }, 0);

            callback && callback.call(this);
        },

        /**
         * 触发 switch 相关事件
         */
        _fireOnSwitch: function(ev) {
            //TODO event $.merge需要进一步验证。
            this.trigger(EVENT_SWITCH, utils.mix(ev || {}, {
                fromIndex: this.fromIndex,
                currentIndex: this.activeIndex
            }));
        },

        //切换到上一视图
        prev: function(ev) {
            // 循环
            this.switchTo((this.activeIndex - 1 + this.length) % this.length,
                BACKWARD, ev);
        },

        //切换到下一视图
        next: function(ev) {
            // 循环
            this.switchTo((this.activeIndex + 1) % this.length,
                FORWARD, ev);
        },

        destroy: function() {
            //DOM.remove(self.container);
            this.container.remove();
            this.nav = null;
            this.container = null;
            this.content = null;
            //释放保存元素的集合
            this.triggers = [];
            this.panels = [];
            //释放事件
            this.off();
            this.detach();
            //slide中扩展的自动滚动模块中的事件。
            if (this.__scrollDetect) {
                $(win).off('scroll');
            }

        }
    });
});
