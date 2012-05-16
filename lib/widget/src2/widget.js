define(function(require, exports, module) {

    // Widget
    // -----------
    // UI 组件的基类，主要负责 View 层的管理

    var Base = require('base');
    var $ = require('$');

    // options 中的这些属性会直接添加到实例上
    var attrOptions = ['element', 'template', 'model'];

    // 事件代理属性中，'event selector' 的分隔符
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;


    var Widget = Base.extend({

        // 如果未传入 element 选项，默认会用 $('<div>') 构建
        element: '<div>',

        // 初始化方法，完成基本操作。子类覆盖时，记得调用父类的
        initialize: function(options) {
            this.cid = uniqueId();
            this._initOptions(options);
            this._initElement();
            this.delegateEvents();
        },

        // 渲染方法，提供给子类覆盖，这是子类中最核心的一个方法
        render: function() {
            // 比如：
            // this.$element.html(this.template(this.model));
        },

        // 移除掉对应的 DOM 元素，卸载掉注册的事件等销毁工作
        destroy: function() {
            Widget.superclass.destroy.call(this);
            this.undelegateEvents();
        },

        // 在当前 view 的 element 内寻找匹配节点
        $: function(selector) {
            return this.$element.find(selector);
        },

        // 重设 view 的 element, 并将事件代理转移过去
        setElement: function(element, delegate) {
            this.undelegateEvents();
            this._initElement(element);

            if (delegate !== false) {
                this.delegateEvents();
            }
        },

        _initOptions: function(options) {
            this.setOptions(options);
            options = this.options;

            for (var i = 0, len = attrOptions.length; i < len; i++) {
                var attr = attrOptions[i];
                if (options[attr]) {
                    this[attr] = options[attr];
                }
            }
        },

        // 根据传入的选项，构建 this.$element 等属性
        _initElement: function(element) {
            element = element || this.element;
            var $element = element instanceof $ ? element : $(element);

            // 只取匹配的第一个
            $element = $element.eq(0);
            element = $element[0];

            // 无效 element
            if (!element || !element.nodeType) {
                throw 'Invalid element';
            }

            this.element = element;
            this.$element = $element;
        },

        // 自动绑定代理事件
        //     {
        //       'mousedown .title':  'edit',
        //       'click .button':     'save'
        //       'click .open':       function(e) { ... }
        //     }
        //
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
                this.$element.on(eventName, selector, bind(method, this));
            }
        },

        // 卸载掉自动绑定的代理事件
        undelegateEvents: function() {
            this.$element.off('.delegateEvents' + this.cid);
        }
    });

    module.exports = Widget;


    // Helpers

    var idCounter = 0;

    function uniqueId() {
        return 'widget' + idCounter++;
    }


    function getValue(obj, prop) {
        if (!obj || !obj[prop]) return null;

        var v = obj[prop];
        return isFunction(v) ? v() : v;
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

});
