define(function(require, exports, module) {

    // Switchable
    // -----------------
    // Thanks to:
    //  https://github.com/kissyteam/kissy/blob/master/src/switchable/src/base.js

    var $ = require('jquery');
    var _ = require('underscore');

    var isString = _.isString;
    var indexOf = _.indexOf;
    var extend = _.extend;

    var Widget = require('widget');

    var Base = require('base');
    var utils = require('./extra/utils');

    //这三个插件模块， 看看能否有更好的方式进行注入。
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

        DOT = '.',
        classPrefix = 'ui-switchable-',
        navClass = classPrefix + 'nav',
        contentClass = classPrefix + 'content',
        classTriggerInternal = classPrefix + 'trigger-internal',
        classPanelInternal = classPrefix + 'panel-internal';

    function getDomEvent(e) {
        var originalEvent = {};
        originalEvent.type = e.type;
        originalEvent.target = e.target;
        return {originalEvent: originalEvent};
    }

    function getSelector(cls) {
        if (/^\w/.test(cls)) {
            return DOT + cls;
        } else {
            return cls;
        }
    };


    var Switchable = module.exports = Widget.extend({
        attrs: {
            //支持navClass和contentClass.
            //navClass如果传入的话，如果没有发现此元素，则会自动进行创建。
            navClass: null,
            contentClass: contentClass,

            //用户传入triggers和panels.支持selector和jquery对象。
            //还是需要默认的结构吧，要不很多情况下很麻烦。
            //TODO 用不去用检查传入的select是否符合规范？比如'.'的检查
            triggers: [],
            panels: [],
            // 触发类型
            triggerType: 'hover', // or 'click'
            // 触发延迟
            delay: .1, // 100ms
            activeTriggerClass: 'ui-active',
            // 初始切换到面板
            activeIndex: 0,
            // 可见视图内有多少个 panels
            step: 1,

            // 'scrollx', 'scrolly', 'fade' 或者直接传入 custom effect fn
            effect: NONE,
            easing: 'easeNone', // easing method
            duration: .5, // 动画的时长
            // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
            viewSize: [],
            //插件集合。
            plugins: []
        },
        _parent: function(methodName) {
            return Switchable.superclass[methodName];
        },
        setup: function() {
            //初始化switchable相关数据结构。
            this._initPanels();
            this._initTriggers();
            this.trigger(EVENT_INIT);
            this._postCreate();
        },
        //对widget提供的$行为进行覆盖，在Switchable的组件中，对dom元素的获取，都是通过class
        //来的，支持自动添加'.'。
        $: function(selector) {
            if (isString(selector)) {
                selector = getSelector(selector);
            }
            return this._parent('$').call(this, selector);
        },

        //初始化视图。
        _initPanels: function() {
            var content;
            var panels = this.panels = this.$(this.get('panels'));
            if (panels.length == 0) {
                //check contentClass.
                content = this.$(this.get('contentClass'));
                content.length && (panels = this.panels = content.children());
            }
            if (panels.length > 0) {
                this.content = $(panels[0].parentNode);
                for (var i = 0, len = panels.length; i < len; i++) {
                    $(panels[i]).addClass(classPanelInternal);
                }
                this._resetLength();
            } else {
                throw new Error('Switchable init panels error!');
            }
        },
        //初始化triggers.
        _initTriggers: function() {
            var nav;
            var triggers = this.triggers = this.$(this.get('triggers'));
            var len;
            if (triggers.length == 0) {
                //如果用户配置navClass
                if (this.get('navClass')) {
                    nav = this.$(this.get('navClass'));
                    triggers = nav.children();
                    if (!triggers.length) {
                        len = this.length;
                        //如果无法获取triggers尝试检查navClass,如果传入navClass则整个导航都是自动生成的。
                        nav = generateTriggersMarkup.call(this, nav, len);
                        this.element.append(nav);
                    }
                } else {
                    nav = this.$(navClass);
                }
                this.nav = nav;
                triggers = this.triggers = nav.children();
            } else if (triggers.length > 0) {
                this.nav = $(triggers[0].parentNode);
                //如果存在triggers给tigger添加class，使用委托
            }
            if (triggers.length) {
                for (var i = 0, len = triggers.length; i < len; i++) {
                    $(triggers[i]).addClass(classTriggerInternal);
                }
                this._bindTriggers();
            }
        },
        _postCreate: function() {
            var willSwitch = parseInt(this.get('activeIndex'));
            if (willSwitch > this.panels.length) {
                willSwitch = 0;
            }
            //根据当前选项，混入对应的插件。
            //在插件中根据当前对象的参数，选择是否混入。
            this._install(Effects);
            this._install(Autoplay);
            this._install(Circular);
            this.switchTo(willSwitch);
        },
        //给 triggers 添加事件
        //是否可以给getTrigggerIndexByEvt增加回调?
        _bindTriggers: function() {
            var events = {};
            events['click .' + classTriggerInternal] = function(e) {
                e.stopPropagation();
                var index = getTriggerIndexByEvt(e, this.triggers);
                this._onFocusTrigger(index, e);
            };
            if (this.get('triggerType') === 'hover') {
                events['mouseenter .' + classTriggerInternal] = function(e) {
                    e.stopPropagation();
                    var index = getTriggerIndexByEvt(e, this.triggers);
                    this._onMouseEnterTrigger(index, e);
                };
                events['mouseleave .' + classTriggerInternal] = function(e) {
                    e.stopPropagation();
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
            }, that.get('delay') * 1000);
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
            if (panelCount === undefined) {
                panelCount = this.panels.length;
            }
            // fix self.length 不为整数的情况, 会导致之后的判断 非0, by qiaohua 20111101
            return Math.ceil(panelCount / this.get('step'));
        },
        /**
         * 切换操作，对外 api
         * @param {Number} index 要切换的项.
         * @param {String} direction 方向，用于 autoplay/circular.
         * @param {Object} ev 引起该操作的事件.
         * @param {Function} callback 运行完回调，和绑定 switch 事件作用一样.
         */
        switchTo: function(index, direction, ev, callback) {
            var fromIndex = this.activeIndex,
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
            this._switchTrigger(fromIndex > -1 ?
                triggers[fromIndex] : null,
                triggers[index]);

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
            if (this.triggers.length < 1) return;
            var activeTriggerClass = this.get('activeTriggerClass');
            if (fromTrigger) {
                $(fromTrigger).removeClass(activeTriggerClass);
            }
            $(toTrigger).addClass(activeTriggerClass);
        },
        _getFromToPanels: function() {
            var fIndex = this.fromIndex,
                fromPanels,
                toPanels,
                step = this.get('step'),
                panels = this.panels,
                toIndex = this.activeIndex;

            if (fIndex > -1) {
                fromPanels = panels.slice(fIndex * step, (fIndex + 1) * step);
            } else {
                fromPanels = null;
            }

            toPanels = panels.slice(toIndex * step, (toIndex + 1) * step);

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
                $(fromPanels).css(DISPLAY, NONE);
            }
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
            this.trigger(EVENT_SWITCH, extend(ev || {}, {
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
        //插件安装
        _install: function(plugin) {
            var _attrs = plugin.attrs;

            if (_attrs) {
                //TODO 测试点
                var options = { silent: true };
                for (var key in _attrs) {
                    if (_attrs.hasOwnProperty(key)) {
                        if (!this.get(key)) {
                            this.set(key, _attrs[key], options);
                        }
                    }
                }
            }

            if (plugin.methods) {
                extend(this, plugin.methods);
            }

            if (plugin.install) {
                plugin.install.call(this);
            }
            this.get('plugins').push(plugin);
        },
        destroy: function() {
            //插件销毁。
            var plugins = this.get('plugins');
            var plugin;
            for (var i = 0, len = plugins.length; i < len; i++) {
                plugin = plugins[i];
                plugin.destroy && plugin.destroy.call(this);
            }
            this.nav = null;
            this.content = null;
            //释放保存元素的集合
            this.triggers = [];
            this.panels = [];
            //释放事件
            this.off();
            Switchable.superclass.destroy.call(this);
        }
    });

    var getTriggerIndexByEvt = function(e, triggers) {
        var trigger = e.currentTarget;
        var index = indexOf(triggers, trigger);
        return index;
    };
   //如果navClass传入，但是triggers为空，那么我们自动生成 triggers 的 dom结构。
    var generateTriggersMarkup = function(nav, len) {
        var activeIndex = this.activeIndex;
        if (!nav.length) {
            nav = $('<ul>');
            nav.addClass(this.get('navClass'));
            this.element.append(nav);
        }
        var li, i;
        for (i = 0; i < len; i++) {
            li = $('<li>');
            if (i === activeIndex) {
                li.addClass(this.get('activeTriggerClass'));
            }
            li.html(i + 1);
            nav.append(li);
        }
        return nav;
    };
});
