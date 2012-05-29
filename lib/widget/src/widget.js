define(function(require, exports, module) {

    // Widget
    // ------------------------------------
    // UI 组件的基类，主要负责 View 层的管理


    var Base = require('base');
    var $ = require('$');
    var DAParser = require('./daparser');

    // config 中的这些键值会直接添加到实例上，转换成 properties
    var propertiesInConfig = ['element', 'model'];

    var EVENT_KEY_SPLITTER = /^(\S+)\s*(.*)$/;
    var DELEGATE_EVENT_NS = '.delegate-events-';


    var Widget = Base.extend({

        attrs: {
            // 默认模板
            template: '<div></div>',

            // 组件的默认父节点
            parentNode: document.body,

            // 默认开启 data-api 解析
            'data-api': true
        },

        // 事件代理，格式为：
        //   {
        //     'mousedown .title': 'edit',
        //     'click .button': 'save'
        //     'click .open': function(e) { ... }
        //   }
        events: null,

        // 初始化方法，确定组件创建的基本流程
        initialize: function(config) {
            this.cid = uniqueCid();

            // 由 Base 提供
            Widget.superclass.initialize.call(this, config);

            // 由 Widget 提供
            this.parseElement();
            this.parseDataAttrs();

            this.initProps();
            this.delegateEvents();

            // 由子类提供
            this.setup();
        },

        // 根据传入的 config 参数，和继承过来的父类的 attrs，构建 this.attrs
        initAttrs: function(config) {
            var proto = this.constructor.prototype;
            proto.attrs || (proto.attrs = {});

            // 将 proto 上的特殊 properties 放到 proto.attrs 上，以便合并
            setPropConfig(proto.attrs, this);

            // 调用 Base 的方法来合并 attrs
            Widget.superclass.initAttrs.call(this, config);

            // 将 attrs 上的 properties 放回 this 上
            setPropConfig(this, this.attrs, true);
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
                throw 'element is invalid';
            }
        },

        // 从模板中构建 this.element
        parseElementFromTemplate: function() {
            this.element = $(this.get('template'));
        },

        // 解析 this.element 中的 data-* 配置，获得 this.dataset
        // 并自动将 data-action 配置转换成事件代理
        parseDataAttrs: function() {
            if (this.get('data-api')) {
                this.dataset = DAParser.parse(this.element[0]);
                var actions = this.dataset.action;

                if (actions) {
                    var events = getEvents(this) || (this.events = {});
                    parseDataActions(actions, events);
                }
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
                var args = parseEventKey(key, this);
                handler = bind(events[key], this);

                this.element.on(args.type, args.selector, handler);
            }

            return this;
        },

        // 卸载事件代理
        undelegateEvents: function(eventKey, handler) {
            var cid = this.cid;
            var args = {};

            // 卸载所有
            if (arguments.length === 0) {
                args.type = DELEGATE_EVENT_NS + cid;
            }
            // 卸载特定事件：widget.undelegateEvents('click li', handler);
            else {
                args = parseEventKey(eventKey, this);
            }

            // 从 cache 里找到对应的 handler 封装函数
            if (handler) {
                var handleKey = getHandlerKey(handler, cid);
                handler = handlerCache[handleKey];
            }

            this.element.off(args.type, args.selector, handler);
            return this;
        },

        // 提供给子类覆盖的初始化方法
        // 该方法执行后，子类的状态一般与默认配置一致
        setup: function() {
        },

        // 将 widget 渲染到页面上
        // 渲染不仅仅包括插入到 DOM 树中，还包括样式渲染等
        // 约定：子类覆盖时，需保持 `return this`
        render: function() {
            // 让用户传入的 config 生效
            this.change();

            // 插入到文档流中
            var parentNode = this.get('parentNode');
            if (parentNode && !isInDocument(this.element[0])) {
                this.element.appendTo(parentNode);
            }

            return this;
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

    module.exports = Widget;


    // Helpers
    // ------

    var toString = Object.prototype.toString;

    function isString(val) {
        return toString.call(val) === '[object String]';
    }

    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }

    function trim(s) {
        return s.replace(/^\s*/, '').replace(/\s*$/, '');
    }


    var handlerCache = {};

    function bind(handler, widget) {
        var handlerKey = getHandlerKey(handler, widget.cid);
        var wrap;

        if (wrap = handlerCache[handlerKey]) {
            return wrap;
        }

        wrap = function(ev) {
            if (isFunction(handler)) {
                handler.call(widget, ev);
            } else {
                widget[handler](ev);
            }
        };

        handlerCache[handlerKey] = wrap;
        return wrap;
    }

    function getHandlerKey(handler, cid) {
        var key;

        if (isString(handler)) {
            key = handler;
        }
        // 理论上会冲突，但实际上冲突的概率几乎为零
        else if (isFunction(handler) && isFunction(handler.toString)) {
            key = handler.toString().substring(0, 50);
        }

        if (key) {
            // 加上 cid, 确保实例间不会冲突
            return cid + '-' + key;
        }
        else {
            throw '"handler" must be a string or a function';
        }
    }


    var cidCounter = 0;

    function uniqueCid() {
        return 'widget-' + cidCounter++;
    }


    function setPropConfig(receiver, supplier, isAttr) {
        for (var i = 0, len = propertiesInConfig.length; i < len; i++) {
            var key = propertiesInConfig[i];

            if (key in supplier) {
                var val = supplier[key];
                receiver[key] = isAttr ? val.value : val;
            }
        }
    }

    // 解析 data-action，添加到 events 中
    function parseDataActions(actions, events) {
        for (var action in actions) {

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


    function getEvents(widget) {
        if (isFunction(widget.events)) {
            widget.events = widget.events();
        }
        return widget.events;
    }


    function parseEventKey(eventKey, widget) {
        var match = eventKey.match(EVENT_KEY_SPLITTER);

        var eventType = match[1] + DELEGATE_EVENT_NS + widget.cid;
        var selector = match[2] || '';

        if (selector.indexOf('{{') > -1) {
            selector = parseObjectExpression(selector, widget);
        }

        return {
            type: eventType,
            selector: selector
        };
    }


    var OBJECT_FLAG = /\{\{([^\}]+)\}\}/g;

    // 将 {{xx}},{{yy}} 转换成 .daparser-n, .daparser-m
    function parseObjectExpression(selector, widget) {

        return selector.replace(OBJECT_FLAG, function(m, name) {
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
            if (isString(point) && point.indexOf('.') === 0) {
                return point;
            }

            return stamp(point);
        });
    }


    // 给 element 添加具有唯一性的 class，并返回由该 class 构成的 selector
    function stamp(element) {
        var node = $(element)[0];

        if (!node || node.nodeType !== 1) {
            throw 'This element is not a valid DOM element: ' + element;
        }
        return '.' + DAParser.stamp(node);
    }


    function isInDocument(element) {
        return $.contains(document.documentElement, element);
    }

});
