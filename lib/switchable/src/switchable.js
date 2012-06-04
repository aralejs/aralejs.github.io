define(function(require, exports, module) {

    // Switchable
    // -----------------
    // Thanks to:
    //  https://github.com/kissyteam/kissy/blob/master/src/switchable/src/base.js

    var $ = require('jquery');
    var _ = require('underscore');

    var Widget = require('widget');
    var Base = require('base');
    var utils = require('./extra/utils');

    //这三个插件模块， 看看能否有更好的方式进行注入。
    var Effects = require('./plugins/effects');
    var Autoplay = require('./plugins/autoplay');
    var Circular = require('./plugins/circular');

    var SILENT = { silent: true };

    var DELAY = 100;
    var DURATION = 500;

    //组件相关参数
    var DISPLAY = 'display',
        BLOCK = 'block',
        NONE = 'none',

        FORWARD = 'forward',
        BACKWARD = 'backward',

        DOT = '.',
        classPrefix = 'ui-switchable-',
        navClass = classPrefix + 'nav',
        contentClass = classPrefix + 'content',
        classTriggerInternal = classPrefix + 'trigger-internal',
        classPanelInternal = classPrefix + 'panel-internal';

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
            delay: DELAY, // 100ms
            activeTriggerClass: 'ui-active',
            // 初始切换到面板
            activeIndex: {
                value: -1,
                setter: function(val) {
                    val = parseInt(val) || 0;
                    var len = this.length;
                    if (val > len) {
                        val = len - 1;
                    } else if (val < 0) {
                        val = 0;
                    }
                    return  val;
                }
            },
            // 可见视图内有多少个 panels
            step: 1,
            // 'scrollx', 'scrolly', 'fade' 或者直接传入 custom effect fn
            effect: NONE,
            easing: 'easeNone', // easing method
            duration: DURATION, // 动画的时长
            // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
            viewSize: [],
            //插件集合。
            plugins: []
        },

        events: function() {
            var hash = {};
            // 给 triggers 添加事件
            hash['click .' + classTriggerInternal] = '_onTrigger';
            if (this.get('triggerType') === 'hover') {
                hash['mouseenter .' + classTriggerInternal] = '_onTrigger';
                hash['mouseleave .' + classTriggerInternal] = function(e) {
                    e.stopPropagation();
                    this._cancelSwitchTimer();
                };
            }
            return hash;
        },
        //需要反复用到的
        initProps: function() {
            this.delay = parseFloat(this.get('delay')) || DELAY;
            this.duration = parseFloat(this.get('duration')) || DURATION;
            this.step = this.get('step');
        },
        setup: function() {
            //初始化switchable相关数据结构。
            this._initPanels();
            this._initTriggers();
            this._bindAction();
            this._postCreate();
        },
        //处理额外的事件。也包括dom事件。
        _bindAction: function() {
            //发布事件,用户可以进行订阅。
            //TODO 重新发布事件.
            this.before('_switchTo');
            this.after('_switchTo');
        },
        //对widget提供的$行为进行覆盖，在Switchable的组件中，对dom元素的获取，都是通过class
        //来的，支持自动添加'.'。
        $: function(selector) {
            if (_.isString(selector)) {
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
            var nav, i, len;
            var triggers = this.triggers = this.$(this.get('triggers'));
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
            }
            //如果存在triggers给tigger添加class，使用委托
            if (triggers.length) {
                for (i = 0, len = triggers.length; i < len; i++) {
                    $(triggers[i]).addClass(classTriggerInternal);
                }
            }
        },
        _onTrigger: function(e) {
            e.stopPropagation();
            var trigger = e.currentTarget;
            var type = e.type;
            var index = _.indexOf(this.triggers, trigger);
            if (type === 'click') {
                this._onFocusTrigger(index);
            } else if (type === 'mouseenter') {
                this._onMouseEnterTrigger(index);
            }
        },
        //click or tab 键激活 trigger 时触发的事件
        _onFocusTrigger: function(index) {
            this._cancelSwitchTimer(); // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
            this.set('activeIndex', index);
        },

         //鼠标悬浮在 trigger 上时触发的事件
        _onMouseEnterTrigger: function(index) {
            var that = this;
            // 重复悬浮。比如：已显示内容时，将鼠标快速滑出再滑进来，不必再次触发。
            this.switchTimer = utils.later(function() {
                that.set('activeIndex', index);
            }, that.delay);
        },
        //重复触发时的有效判断
        _triggerIsValid: function(toIndex, fromIndex) {
            return toIndex !== fromIndex;
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
            return Math.ceil(panelCount / this.step);
        },
        _postCreate: function() {
            var willSwitch = parseInt(this.get('activeIndex'));
            if (willSwitch > this.panels.length || willSwitch < 0) {
                willSwitch = 0;
            }
            //根据当前选项，混入对应的插件。
            //在插件中根据当前对象的参数，选择是否混入对应的插件功能。
            this._install(Effects);
            this._install(Autoplay);
            this._install(Circular);
            this.switchTo(willSwitch);
            this._onChangeActiveIndex(willSwitch, -1);
        },
        //通过监听ctiveIndex来驱动切换。
        _onChangeActiveIndex: function(toIndex, fromIndex) {
            var direction = toIndex > fromIndex ? FORWARD : BACKWARD;
            this._switchTo(toIndex, fromIndex, direction);
        },
        //内部核心切换方法
        _switchTo: function(toIndex, fromIndex, direction) {
            // 再次避免重复触发
            if (!this._triggerIsValid(toIndex, fromIndex)) {
                return this;
            }
            this._switchTrigger(toIndex, fromIndex);
            this._switchView(toIndex, fromIndex, direction);
            return this; // chain
        },
        //切换操作，对外 api
        switchTo: function(toIndex) {
            this.set('activeIndex', toIndex);
        },
        //切换当前触点
        _switchTrigger: function(toIndex, fromIndex) {
            var triggers = this.triggers;
            if (triggers.length < 1) return;

            var toTrigger = triggers[toIndex];
            var fromTrigger = triggers[fromIndex];
            var activeTriggerClass = this.get('activeTriggerClass');

            if (fromTrigger) {
                $(fromTrigger).removeClass(activeTriggerClass);
            }
            $(toTrigger).addClass(activeTriggerClass);
        },
        _getFromToPanels: function(toIndex, fromIndex) {
            var fromPanels,
                toPanels,
                step = this.step,
                panels = this.panels,
                begin,
                end;

            if (fromIndex > -1) {
                begin = fromIndex * step;
                end = (fromIndex + 1) * step;
                fromPanels = panels.slice(begin, end);
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
        _switchView: function(toIndex, fromIndex, direction) {
            var that = this;
            var panelInfo = this._getFromToPanels(toIndex, fromIndex),
                fromPanels = panelInfo.fromPanels,
                toPanels = panelInfo.toPanels;
            // 最简单的切换效果：直接隐藏/显示
            if (fromPanels) {
                $(fromPanels).css(DISPLAY, NONE);
            }
            $(toPanels).css(DISPLAY, BLOCK);
        },

        //切换到上一视图
        //TODO 是否可以通过事件发布来解决。 不应该具体的依赖对应的方法。
        prev: function() {
            // 循环
            var fromIndex = this.get('activeIndex');
            var index = (fromIndex - 1 + this.length) % this.length;
            this.set('activeIndex', index, SILENT);
            this._switchTo(index, fromIndex, BACKWARD);
        },
        //切换到下一视图
        next: function() {
            // 循环
            var fromIndex = this.get('activeIndex');
            var index = (fromIndex + 1) % this.length;
            this.set('activeIndex', index, SILENT);
            this._switchTo(index, fromIndex, FORWARD);
        },
        //避免多处引用Switchable。
        _parent: function(methodName) {
            return Switchable.superclass[methodName];
        },
        //插件安装
        _install: function(plugin) {
            var _attrs = plugin.attrs;

            if (_attrs) {
                //TODO 测试点
                for (var key in _attrs) {
                    if (_attrs.hasOwnProperty(key)) {
                        if (!this.get(key)) {
                            this.set(key, _attrs[key], SILENT);
                        }
                    }
                }
            }
            if (plugin.methods) {
                _.extend(this, plugin.methods);
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


// _ 代表保护方法，可以被子类覆盖。
// __ 代表私有方法，子类不可以覆盖。
