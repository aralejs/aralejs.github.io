define(function(require, exports, module) {

    // Switchable
    // -----------------
    // Thanks to:
    //  https://github.com/kissyteam/kissy/blob/master/src/switchable/src/base.js

    var $ = require('jquery');
    var _ = require('underscore');

    var Widget = require('widget');

    // 这三个插件模块， 看看能否有更好的方式进行注入。
    var Effects = require('./plugins/effects');
    var Autoplay = require('./plugins/autoplay');
    var Circular = require('./plugins/circular');

    var SILENT = { silent: true };

    var DELAY = 100;
    var DURATION = 500;

    // 组件相关参数
    var FORWARD = 'forward',
        BACKWARD = 'backward',
        DOT = '.';

    function getSelector(cls) {
        if (/^\w/.test(cls)) {
            return DOT + cls;
        } else {
            return cls;
        }
    }


    var Switchable = module.exports = Widget.extend({

        attrs: {

            // 是否包含triggers
            hasTriggers: true,
            
            // 下面有点冗余
            classTriggerInternal: {
                value: '-trigger-internal',
                getter: function(val) {
                    return this.get('classPrefix') + val; 
                }
            },
            classPanelInternal: {
                value: '-panel-internal',
                getter: function(val) {
                    return this.get('classPrefix') + val;
                }
            },
            navClass: {
                value: '-nav',
                getter: function(val) {
                    return this.get('classPrefix') + val;
                }
            },
            contentClass: {
                value: '-content',
                getter: function(val) {
                    return this.get('classPrefix') + val;
                }
            },
            
            classPrefix: 'ui-switchable',

            // 用户传入triggers和panels.支持selector和jquery对象。
            // 还是需要默认的结构吧，要不很多情况下很麻烦。
            // TODO 用不去用检查传入的select是否符合规范？比如'.'的检查
            triggers: [],
            panels: [],

            // 触发类型
            triggerType: 'hover', // or 'click'

            // 触发延迟
            delay: DELAY, // 100ms

            activeTriggerClass: 'ui-switchable-active',

            // 初始切换到面板
            activeIndex: -1,

            // 'scrollx', 'scrolly', 'fade' 或者直接传入 custom effect fn
            effect: 'none',

            // easing method.
            easing: 'easeNone',

            // 动画的时长。
            duration: DURATION,

            // 可见视图区域的大小。一般不需要设定此值，仅当获取值不正确时，用于手工指定大小
            viewSize: [],

            // 可见视图内有多少个 panels
            step: 1,

            //插件集合。
            plugins: []
        },

        events: function() {
            var hash = {};
            var classTriggerInternal = this.get('classTriggerInternal');
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

        setup: function() {
            //初始化switchable相关数据结构。
            this._parseRole();
            this._initPanels();
            this._initTriggers();
            this._bindAction();
            this._installPlugins();
            this._postCreate();
            this.render();
        },

        _parseRole: function() {
            var dataset = this.dataset;
            var role = dataset.role;
            var $element = $(this.element);
            var triggers = this.get('triggers');
            var panels = this.get('panels');
            if (role) {
                // 属性优先, role其次
                // 如果用户没有配置triggers 或者 panels。
                if (!(triggers && triggers.length) && (role.trigger || role.nav)) {
                    triggers = parseRole(role.trigger, role.nav, $element);
                }
                if (!(panels && panels.length) && (role.panel || role.content)) {
                    panels = parseRole(role.panel, role.content, $element);
                }

                this.set('triggers', triggers, SILENT);
                this.set('panels', panels, SILENT);
            }
        },

        // 初始化视图。
        _initPanels: function() {
            var content;
            var panels = this.panels = this.$(this.get('panels'));
            if (panels.length == 0) {
                // check contentClass.
                content = this.$(this.get('content'));
                if (!content.length) {
                    content =  this.$(DOT + this.get('contentClass')); 
                }
                content.length && (panels = this.panels = content.children());
            }
            if (panels.length > 0) {
                this.content = $(panels[0].parentNode);
                for (var i = 0, len = panels.length; i < len; i++) {
                    $(panels[i]).addClass(this.get('classPanelInternal'));
                }
                this._resetLength();
            } else {
                throw 'Switchable init panels error!';
            }
        },

        // 初始化triggers. 
        _initTriggers: function() {
            var nav, i, len;
            var triggers = this.triggers = this.$(this.get('triggers'));
            if (triggers.length == 0) {
                // 如果用户配置navClass
                nav = this.$(DOT + this.get('navClass'));
                if (!nav.length && this.get('hasTriggers')) {
                    len = this.length;
                    // 如果无法获取triggers尝试检查navClass,如果传入navClass则整个导航都是自动生成的。
                    nav = generateTriggersMarkup.call(this, nav, len);
                    this.element.append(nav);
                } 
                this.nav = nav;
                triggers = this.triggers = nav.children();
            } else if (triggers.length > 0) {
                this.nav = $(triggers[0].parentNode);
            }
            // 如果存在triggers给tigger添加class，使用委托
            if (triggers.length) {
                for (i = 0, len = triggers.length; i < len; i++) {
                    $(triggers[i]).addClass(this.get('classTriggerInternal'));
                }
            }
        },

        // 处理额外的事件。也包括dom事件。
        _bindAction: function() {
            //发布事件,用户可以进行订阅。
            //TODO 重新发布事件.
            this.before('_switchTo', function() {
                var args = ['beforeSwitch'].concat([].slice.call(arguments, 0));
                this.trigger.apply(this, args);
            });
            this.after('_switchTo', function(that) {
                this.trigger('switch', that);
            });
        },

        _installPlugins: function() {
            // 根据当前选项，混入对应的插件。
            // 在插件中根据当前对象的参数，选择是否混入对应的插件功能。
            this._install(Effects);
            this._install(Autoplay);
            this._install(Circular);
        },

        _postCreate: function() {
            var willSwitch = parseInt(this.get('activeIndex'));
            if (willSwitch > this.panels.length || willSwitch < 0) {
                willSwitch = 0;
            }
            this.set('activeIndex', willSwitch, SILENT);
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

        // click or tab 键激活 trigger 时触发的事件
        _onFocusTrigger: function(index) {
            this._cancelSwitchTimer(); // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
            this.set('activeIndex', index);
        },

         // 鼠标悬浮在 trigger 上时触发的事件
        _onMouseEnterTrigger: function(index) {
            var that = this;

            // 重复悬浮。比如：已显示内容时，将鼠标快速滑出再滑进来，不必再次触发。
            this.switchTimer = setTimeout(function() {
                that.set('activeIndex', index);
            }, this.get('delay'));
        },

        // 重复触发时的有效判断
        _triggerIsValid: function(toIndex, fromIndex) {
            return toIndex !== fromIndex;
        },

        // 取消切换定时器
        _cancelSwitchTimer: function() {
            if (this.switchTimer) {
                clearTimeout(this.switchTimer);
                this.switchTimer = undefined;
            }
        },

        // 重置 length: 代表有几个trigger
        _resetLength: function() {
            return this.length = this._getLength();
        },

        // 获取 Trigger的数量
        _getLength: function(panelCount) {
            if (panelCount === undefined) {
                panelCount = this.panels.length;
            }
            // fix self.length 不为整数的情况, 会导致之后的判断 非0, by qiaohua 20111101
            return Math.ceil(panelCount / this.get('step'));
        },

        // 通过监听ctiveIndex来驱动切换。
        _onRenderActiveIndex: function(toIndex, fromIndex) {
            this._switchTo(toIndex, fromIndex);
        },

        // 内部核心切换方法
        _switchTo: function(toIndex, fromIndex) {
            // 再次避免重复触发
            if (!this._triggerIsValid(toIndex, fromIndex)) {
                return this;
            }
            this._switchTrigger(toIndex, fromIndex);
            var panelInfo = this._getFromToPanels(toIndex, fromIndex);
            this._switchView(panelInfo);
            return this; // chain
        },

        // 切换操作，对外 api
        switchTo: function(toIndex) {
            this.set('activeIndex', toIndex);
        },

        // 切换当前触点
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
                step = this.get('step'),
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
                toIndex: toIndex,
                fromIndex: fromIndex,
                fromPanels: fromPanels,
                toPanels: toPanels
            };
        },

        // 切换视图
        _switchView: function(panelInfo) {
            var fromPanels = panelInfo.fromPanels,
                toPanels = panelInfo.toPanels;
            // 最简单的切换效果：直接隐藏/显示
            if (fromPanels) {
                $(fromPanels).hide();
            }
            $(toPanels).show();
        },

        // 切换到上一视图
        // TODO 是否可以通过事件发布来解决。 不应该具体的依赖对应的方法。
        prev: function() {
            // 循环
            var fromIndex = this.get('activeIndex');
            var index = (fromIndex - 1 + this.length) % this.length;
            this.set('activeIndex', index);
        },

        // 切换到下一视图
        next: function() {
            // 循环
            var fromIndex = this.get('activeIndex');
            var index = (fromIndex + 1) % this.length;
            this.set('activeIndex', index);
        },

        // 避免多处引用Switchable。
        _parent: function(methodName) {
            return Switchable.superclass[methodName];
        },

        // 插件安装
        _install: function(plugin) {
            var isRequire = plugin.isRequire.call(this);
            if (!isRequire) {
                return;
            }
            var _attrs = plugin.attrs;
            if (_attrs) {
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
            // 插件销毁。
            var plugins = this.get('plugins');
            var plugin;
            for (var i = 0, len = plugins.length; i < len; i++) {
                plugin = plugins[i];
                plugin.destroy && plugin.destroy.call(this);
            }
            this.nav = null;
            this.content = null;
            // 释放保存元素的集合
            this.triggers = [];
            this.panels = [];
            // 释放事件
            this.off();
            Switchable.superclass.destroy.call(this);
        }
    });

    module.exports = Switchable;


    // Helpers
    // -------

    // 如果navClass传入，但是triggers为空，那么我们自动生成 triggers 的 dom结构。
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

    function parseRole(childClass, parentClass, root) {
        var elems = [];

        // 优先获取subItem。
        if (childClass) {
            var childArr = childClass.split(',');
            $.each(childArr, function(index, cls) {
                elems.push(root.find(cls)[0]);
            });
        } else {
            elems = root.find(parentClass).children();
        }
        return elems;
    }

});

