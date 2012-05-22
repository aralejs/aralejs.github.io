define(function(require, exports, module) {

    // Switchable
    // -----------------
    // Thanks to:
    //  https://github.com/kissyteam/kissy/blob/master/src/switchable/src/base.js

    var $ = require('jquery');
    var makeArray = $.makeArray;


    var Widget = require('widget');
    var Base = require('base');
    var utils = require('./utils');

    //这两个插件模块， 看看能否有更好的方式进行注入。
    var Effects = require('./plugins/effects');
    var Autoplay = require('./plugins/autoplay');
    var Circular = require('./plugins/circular');

    //组件相关参数
    var DISPLAY = 'display',
        BLOCK = 'block',
        NONE = 'none',
        FORWARD = 'forward',
        BACKWARD = 'backward',
        EVENT_INIT = 'init',
        EVENT_BEFORE_SWITCH = 'beforeSwitch',
        EVENT_SWITCH = 'switch',

        SCROLLX = 'scrollx',
        SCROLLY = 'scrolly';


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
            // 1 - 适度灵活。直接提供具体的 trigger 和 panel 的 Class 来获取对应的元素
            // 2 - 完全灵活。直接提供 triggers 和panels 。
            markupType: 0,
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

            activeTriggerCls: 'ar-active',

            // 初始切换到面板
            switchTo: 0,

            // 可见视图内有多少个 panels
            steps: 1,

            // 'scrollx', 'scrolly', 'fade' 或者直接传入 custom effect fn
            effect: NONE,
            duration: 500, // 动画的时长
            easing: 'easeNone', // easing method

            // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
            viewSize: [],
            events: {
            }
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
            Switchable.superclass.initOptions.call(this, options);
        },
        init: function() {
            this.initMarkup();
            this.bindTriggers();
            this.trigger(EVENT_INIT);
            this.postCreate();
        },
        //初始化switchable相关数据结构。
        initMarkup: function() {
            // parse markup
            // markup主要是为了获取nav, triggers, panels.这部分是否可以通过data-api解析出来。
            var options = this.options;
            var DOT = '.';

            var nav, content, triggers = [], panels = [], n, length;
            //目前这种方式需要用户传入2个参数markupType来确定对应的数据结构，那能否通过具体传入的实际内容来确定？
            switch (options.markupType) {
                //默认结构, 提供Nav和Contentclass。 parse出对应的triggers。这种情况要求结构相对固定。
                case 0:
                    nav = this.$(DOT + options.navCls);
                    nav && (triggers = nav.children());
                    content = this.$(DOT + options.contentCls);
                    content.length && (panels = content.children());
                    break;
                //适度灵活。直接提供具体的trigger和panel的Class来获取对应的元素。
                case 1:
                    triggers = this.$(DOT + options.triggerCls) || [];
                    panels = this.$(DOT + options.panelCls) || [];
                    break;
                //完全自由。直接提供具体的triggers和panels
                case 2:
                    triggers = options.triggers || [];
                    panels = options.panels || [];
                    break;
            }

            this.panels = makeArray(panels);
            this._initPanels();
            this.content = $(content || panels[0].parentNode);

            //处理nav
            length = this._resetLength();
            nav = nav || options.hasTriggers && triggers[0] && triggers[0].parentNode;

            // 自动生成 triggers and nav.  or 指定了 navCls ，但是可能没有手动填充 trigger
            if (options.hasTriggers && (!nav || triggers.length == 0)) {
                nav = this._generateTriggersMarkup(nav, length);
                this.element.append(nav);
                triggers = nav.children();
            }

            // 将 triggers 和 panels 转换为普通数组
            this.triggers = makeArray(triggers);
            this._initTriggers();
        },
          //自动生成 triggers 的 markup
        _generateTriggersMarkup: function(nav, len) {
            var options = this.options;
            var ul = (nav && nav.length > 0) || $('<ul>');
            var li, i;

            ul.addClass(options.navCls);

            for (i = 0; i < len; i++) {
                li = $('<li>');
                if (i === this.activeIndex) {
                    li.addClass(options.activeTriggerCls);
                }
                li.html(i + 1);
                ul.append(li);
            }
            return ul;
        },

        _initTriggers: function() {
            var triggers = this.triggers;
            //如果存在triggers给tigger添加class，使用委托
            for (var i = 0, len = triggers.length; i < len; i++) {
                $(triggers[i]).addClass(CLS_TRIGGER_INTERNAL);
            }
        },
        _initPanels: function() {
            var panels = this.panels;
            for (var i = 0, len = panels.length; i < len; i++) {
                $(panels[i]).addClass(CLS_PANEL_INTERNAL);
            }
        },
        postCreate: function() {
            var options = this.options;
            var willSwitch = parseInt(options.switchTo);
            if (willSwitch > this.panels.length) {
                willSwitch = 0;
            }
            if (options.effect !== NONE) {
                utils.mix(this, Effects, true);
                this.initEffects();
            }
            if (options.autoplay) {
                utils.mix(this, Autoplay, true);
                this.initAutoplay();
            }

            if (options.circular && (options.effect === SCROLLX || options.effect === SCROLLY)) {
                utils.mix(this, Circular, true);
                this.initCircular();
            }
            this.switchTo(willSwitch);
        },
        //给 triggers 添加事件
        bindTriggers: function() {
            if (!this.options.hasTriggers) {
                return;
            }
            var events = {};
            events['click .' + CLS_TRIGGER_INTERNAL] = function(e) {
                var index = getTriggerIndexByEvt(e, this.triggers);
                this._onFocusTrigger(index, e);
            };
            if (this.options.triggerType === 'mouse') {
                events['mouseenter .' + CLS_TRIGGER_INTERNAL] = function(e) {
                    var index = getTriggerIndexByEvt(e, this.triggers);
                    this._onMouseEnterTrigger(index, e);
                };
                events['mouseleave .' + CLS_TRIGGER_INTERNAL] = function() {
                    this._onMouseLeaveTrigger();
                };
            }
            this.delegateEvents(events);
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

        //重置 length: 代表有几个trigger
        _resetLength: function() {
            return this.length = this._getLength();
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
            this.trigger(EVENT_BEFORE_SWITCH, {
                fromIndex: fromIndex,
                toIndex: index
            });

            this.fromIndex = fromIndex;

            // switch active trigger
            // 是否可以通过事件监听来处理？
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
        //TODO 是否可以通过事件发布来解决。 不应该具体的依赖对应的方法。
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
            Switchable.superclass.destroy.call(this, options);
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

    var getTriggerIndexByEvt = function(e, triggers) {
        var trigger = e.currentTarget;
        return utils.indexOf(trigger, triggers);
    };
});
