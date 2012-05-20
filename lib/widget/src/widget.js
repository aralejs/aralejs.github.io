define(function(require, exports, module) {

    // Widget
    // ------------------------------------
    // UI 组件的基类，主要负责 View 层的管理


    var Base = require('base');
    var $ = require('$');
    var DAParser = require('./daparser');

    // options 中的这些属性会直接添加到实例上
    var attrOptions = ['element', 'model'];

    // 'event selector' 的分隔符
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;


    var Widget = Base.extend({

        options: {
            // 事件代理，格式为：
            //   {
            //     'mousedown .title': 'edit',
            //     'click .button': 'save'
            //     'click .open': function(e) { ... }
            //   }
            events: null,

            // 默认模板
            template: '<div></div>',

            // 默认开启 data-api 解析
            'data-api': true
        },

        // 初始化方法，确定组件创建的基本流程
        initialize: function(options) {
            this.cid = uniqueId();
            this.initOptions(options);
            this.parseElement();
            this.parseDataAttrs();
            this.delegateEvents();
            this.init();
        },

        // 根据传入的 options 参数，和继承过来的父类的 options，构建 this.options
        initOptions: function(options) {
            var proto = this.constructor.prototype;
            proto.options || (proto.options = {});

            // 将 proto 上的特殊 attributes 放到 proto.options 上，以便合并
            setAttrOptions(proto.options, this);

            // 合并 options
            options = this.setOptions(options).options;

            // 将 options 上的特殊 attributes 放回 this 上
            setAttrOptions(this, options);
        },

        // 根据 options，构建 this.element
        parseElement: function() {
            var element = this.element;

            if (element) {
                this.element = element instanceof $ ? element : $(element);
            }
            // 未传入 element 时，从 template 构建
            else if (this.options.template) {
                this.parseElementFromTemplate();
            }

            // 如果对应的 DOM 元素不存在，则报错
            if (!this.element[0]) {
                throw 'element is invalid';
            }
        },

        // 从模板中构建 this.element
        parseElementFromTemplate: function() {
            this.element = $(this.options.template);
        },

        // 解析 this.element 中的 data-* 配置，获得 this.dataset
        // 并自动将 data-action 配置转换成事件代理
        parseDataAttrs: function() {
            if (this.options['data-api']) {
                this.dataset = DAParser.parse(this.element[0]);
                var actions = this.dataset.action;

                if (actions) {
                    var events = this.events || (this.events = {});
                    parseDataActions(actions, events);
                }
            }
        },

        // 注册事件代理
        delegateEvents: function(events) {
            events || (events = getValue(this, 'events'));
            if (!events) return;
            this.undelegateEvents();

            for (var key in events) {
                var method = events[key];

                if (!isFunction(method)) {
                    method = this[method];
                }
                if (!method) {
                    throw 'Method "' + events[key] + '" does not exist';
                }

                var match = key.match(delegateEventSplitter);
                var eventName = match[1];
                var selector = match[2] || null;

                eventName += '.delegateEvents' + this.cid;
                this.element.on(eventName, selector, bind(method, this));
            }
        },

        // 卸载事件代理
        undelegateEvents: function() {
            this.element.off('.delegateEvents' + this.cid);
        },

        // 提供给子类覆盖的初始化方法
        init: function() {
        },

        // 将 widget 渲染到页面上
        // 约定：子类覆盖时，需加上 `return this`
        render: function() {
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
    // ----------------------------

    var idCounter = 0;

    function uniqueId() {
        return 'widget-' + idCounter++;
    }


    function getValue(obj, prop) {
        if (!obj || !obj[prop]) return null;
        return isFunction(obj[prop]) ? obj[prop]() : obj[prop];
    }


    function setAttrOptions(receiver, supplier) {
        var i = 0;
        var len = attrOptions.length;
        var attr;

        for (; i < len; i++) {
            attr = attrOptions[i];
            if (supplier[attr]) {
                receiver[attr] = supplier[attr];
            }
        }
    }


    var toString = Object.prototype.toString;

    function isFunction(val) {
        return toString.call(val) === '[object Function]';
    }


    function bind(fn, thisObj) {
        return function(event) {
            fn.call(thisObj, event);
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


    function trim(s) {
        return s.replace(/^\s*/, '').replace(/\s*$/, '');
    }

});
