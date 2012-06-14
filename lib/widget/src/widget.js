define(function(require, exports, module) {

    // Widget
    // ---------
    // Widget 是与 DOM 元素相关联的非工具类组件，主要负责 View 层的管理。
    // Widget 组件具有四个要素：描述状态的 attributes 和 properties，描述行为的 events
    // 和 methods。Widget 基类约定了这四要素创建时的基本流程和最佳实践。


    var Base = require('base');
    var $ = require('$');
    var DAParser = require('./daparser');
    var AutoRender = require('./auto-render');

    var DELEGATE_EVENT_NS = '.delegate-events-';
    var ON_RENDER = '_onRender';


    var Widget = Base.extend({

        // config 中的这些键值会直接添加到实例上，转换成 properties
        propsInAttrs: ['element', 'template', 'model', 'events'],

        // 与 widget 关联的 DOM 元素
        element: null,

        // 默认模板
        template: '<div></div>',

        // 默认数据模型
        model: null,

        // 事件代理，格式为：
        //   {
        //     'mousedown .title': 'edit',
        //     'click {{attrs.saveButton}}': 'save'
        //     'click .open': function(ev) { ... }
        //   }
        events: null,

        // 属性列表
        attrs: {
            // 基本属性
            id: '',
            className: '',
            style: {},

            // 组件的默认父节点
            parentNode: document.body
        },

        // 初始化方法，确定组件创建时的基本流程：
        // 初始化 attrs --》 初始化 props --》 初始化 events --》 子类的初始化
        initialize: function(config) {
            this.cid = uniqueCid();

            // 初始化 attrs
            var dataAttrsConfig = this._parseDataAttrsConfig(config);
            this.initAttrs(config, dataAttrsConfig);

            // 初始化 props
            this.parseElement();
            this._parseDataset();
            this.initProps();

            // 初始化 events
            this.delegateEvents();

            // 子类自定义的初始化
            this.setup();
        },

        // 解析通过 data-attr 设置的 api
        _parseDataAttrsConfig: function(config) {
            var dataAttrsConfig;
            if (config) {
                var element = $(config.element);
            }

            // 解析 data-api 时，只考虑用户传入的 element，不考虑来自继承或从模板构建的
            if (element && element[0] &&
                    !AutoRender.isDataApiOff(element)) {
                dataAttrsConfig = DAParser.parseElement(element);
                normalizeConfigValues(dataAttrsConfig);
            }

            return dataAttrsConfig;
        },

        // 构建 this.element
        parseElement: function() {
            var element = this.element;

            if (element) {
                this.element = $(element);
            }
            // 未传入 element 时，从 template 构建
            else if (this.get('template')) {
                this.parseElementFromTemplate();
            }

            // 如果对应的 DOM 元素不存在，则报错
            if (!this.element || !this.element[0]) {
                throw new Error('element is invalid');
            }
        },

        // 从模板中构建 this.element
        parseElementFromTemplate: function() {
            this.element = $(this.get('template'));
        },

        // 解析 this.element 中的 data-* 配置，获得 this.dataset
        // 并自动将 data-action 配置转换成事件代理
        _parseDataset: function() {
            if (AutoRender.isDataApiOff(this.element)) return;

            this.dataset = DAParser.parseBlock(this.element);

            var actions = this.dataset.action;
            if (actions) {
                var events = getEvents(this) || (this.events = {});
                parseDataActions(actions, events);
            }
        },

        // 负责 properties 的初始化，提供给子类覆盖
        initProps: function() {
        },

        // 注册事件代理
        delegateEvents: function(events, handler) {
            events || (events = getEvents(this));
            if (!events) return;

            // 允许使用：widget.delegateEvents('click p', function(ev) { ... })
            if (isString(events) && isFunction(handler)) {
                var o = {};
                o[events] = handler;
                events = o;
            }

            // key 为 'event selector'
            for (var key in events) {
                if (!events.hasOwnProperty(key)) continue;

                var args = parseEventKey(key, this);
                var eventType = args.type;
                var selector = args.selector;

                (function(handler, widget) {

                    var callback = function(ev) {
                        if (isFunction(handler)) {
                            handler.call(widget, ev);
                        } else {
                            widget[handler](ev);
                        }
                    };

                    // delegate
                    if (selector) {
                        widget.element.on(eventType, selector, callback);
                    }
                    // normal bind
                    // 分开写是为了兼容 zepto，zepto 的判断不如 jquery 强劲有力
                    else {
                        widget.element.on(eventType, callback);
                    }

                })(events[key], this);
            }

            return this;
        },

        // 卸载事件代理
        undelegateEvents: function(eventKey) {
            var args = {};

            // 卸载所有
            if (arguments.length === 0) {
                args.type = DELEGATE_EVENT_NS + this.cid;
            }
            // 卸载特定类型：widget.undelegateEvents('click li');
            else {
                args = parseEventKey(eventKey, this);
            }

            this.element.off(args.type, args.selector);
            return this;
        },

        // 提供给子类覆盖的初始化方法
        setup: function() {
        },

        // 将 widget 渲染到页面上
        // 渲染不仅仅包括插入到 DOM 树中，还包括样式渲染等
        // 约定：子类覆盖时，需保持 `return this`
        render: function() {

            // 让渲染相关属性的初始值生效，并绑定到 change 事件
            if (!this.rendered) {
                this._renderAndBindAttrs();
                this.rendered = true;
            }

            // 插入到文档流中
            var parentNode = this.get('parentNode');
            if (parentNode && !isInDocument(this.element[0])) {
                this.element.appendTo(parentNode);
            }

            return this;
        },

        // 让属性的初始值生效，并绑定到 change:attr 事件上
        _renderAndBindAttrs: function() {
            var widget = this;
            var attrs = widget.attrs;

            for (var attr in attrs) {
                if (!attrs.hasOwnProperty(attr)) continue;
                var m = ON_RENDER + ucfirst(attr);

                if (this[m]) {
                    var val = this.get(attr);

                    // 让属性的初始值生效。注：默认空值不触发
                    if (!isEmptyAttrValue(val)) {
                        this[m](this.get(attr), undefined, attr);
                    }

                    // 将 _onRenderXx 自动绑定到 change:xx 事件上
                    (function(m) {
                        widget.on('change:' + attr, function(val, prev, key) {
                            widget[m](val, prev, key);
                        });
                    })(m);
                }
            }
        },

        _onRenderId: function(val) {
            this.element.attr('id', val);
        },

        _onRenderClassName: function(val) {
            this.element.addClass(val);
        },

        _onRenderStyle: function(val) {
            this.element.css(val);
        },

        // 在 this.element 内寻找匹配节点
        $: function(selector) {
            return this.element.find(selector);
        },

        destroy: function() {
            this.undelegateEvents();
            Widget.superclass.destroy.call(this);
        }
    });

    Widget.autoRender = AutoRender.autoRender;
    Widget.autoRenderAll = AutoRender.autoRenderAll;
    Widget.StaticsWhiteList = ['autoRender'];

    module.exports = Widget;


    // Helpers
    // ------

    var toString = Object.prototype.toString;
    var cidCounter = 0;

    function uniqueCid() {
        return 'widget-' + cidCounter++;
    }

    function isString(val) {
        return toString.call(val) === '[object String]';
    }

    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }

    function isEmptyObject(o) {
        for (var p in o) {
            if (o.hasOwnProperty(p)) return false;
        }
        return true;
    }

    function trim(s) {
        return s.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    // Zepto 上没有 contains 方法
    var contains = $.contains || function(a, b) {
        return !!(a.compareDocumentPosition(b) & 16);
    };

    function isInDocument(element) {
        return contains(document.documentElement, element);
    }

    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    }


    var JSON_LITERAL_PATTERN = /^\s*[\[{].*[\]}]\s*$/;
    var parseJSON = this.JSON ? JSON.parse : $.parseJSON;

    // 解析并归一化配置中的值
    function normalizeConfigValues(config) {
        for (var p in config) {
            if (config.hasOwnProperty(p)) {

                var val = config[p];
                if (!isString(val)) continue;

                if (JSON_LITERAL_PATTERN.test(val)) {
                    val = val.replace(/'/g, '"');
                    config[p] = normalizeConfigValues(parseJSON(val));
                }
                else {
                    config[p] = normalizeConfigValue(val);
                }
            }
        }

        return config;
    }

    // 将 'false' 转换为 false
    // 'true' 转换为 true
    // '3253.34' 转换为 3253.34
    function normalizeConfigValue(val) {
        if (val.toLowerCase() === 'false') {
            val = false;
        }
        else if (val.toLowerCase() === 'true') {
            val = true;
        }
        else if (/\d/.test(val) && /[^a-z]/i.test(val)) {
            var number = parseFloat(val);
            if (number + '' === val) {
                val = number;
            }
        }

        return val;
    }


    // 解析 data-action，添加到 events 中
    function parseDataActions(actions, events) {
        for (var action in actions) {
            if (!actions.hasOwnProperty(action)) continue;

            // data-action 可以含有多个事件，比如：click x, mouseenter y
            var parts = trim(action).split(/\s*,\s*/);
            var selector = actions[action];

            while (action = parts.shift()) {
                var m = action.split(/\s+/);
                var event = m[0];
                var method = m[1];

                // 默认是 click 事件
                if (!method) {
                    method = event;
                    event = 'click';
                }

                events[event + ' ' + selector] = method;
            }
        }
    }

    // 对于 attrs 的 value 来说，以下值都认为是空值： null, undefined, '', [], {}
    function isEmptyAttrValue(o) {
        return o == null || // null, undefined
                (isString(o) || $.isArray(o)) && o.length === 0 || // '', []
                $.isPlainObject(o) && isEmptyObject(o); // {}
    }


    var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;
    var EXPRESSION_FLAG = /{{([^}]+)}}/g;
    var INVALID_SELECTOR = 'INVALID_SELECTOR';

    function getEvents(widget) {
        if (isFunction(widget.events)) {
            widget.events = widget.events();
        }
        return widget.events;
    }

    function parseEventKey(eventKey, widget) {
        var match = eventKey.match(EVENT_KEY_SPLITTER);
        var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid;

        // 当没有 selector 时，需要设置为 undefined，以使得 zepto 能正确转换为 bind
        var selector = match[2] || undefined;

        if (selector && selector.indexOf('{{') > -1) {
            selector = parseEventExpression(selector, widget);
        }

        return {
            type: eventType,
            selector: selector
        };
    }

    // 将 {{xx}}, {{yy}} 转换成 .daparser-n, .daparser-m
    function parseEventExpression(selector, widget) {

        return selector.replace(EXPRESSION_FLAG, function(m, name) {
            var parts = name.split('.');
            var point = widget, part;

            while (part = parts.shift()) {
                if (point === widget.attrs) {
                    point = widget.get(part);
                } else {
                    point = point[part];
                }
            }

            // 已经是 className，比如来自 dataset 的
            if (isString(point)) {
                return point;
            }

            // 看是否是 element
            var element = $(point)[0];
            if (element && element.nodeType === 1) {
                return '.' + DAParser.stamp(element);
            }

            // 不能识别的，返回无效标识
            return INVALID_SELECTOR;
        });
    }

});
