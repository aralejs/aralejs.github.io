define("#widget/0.6.1/widget-debug", ["base","$"], function(require, exports, module) {

    // Widget
    // ------------------------------------
    // UI 组件的基类，主要负责 View 层的管理

    var Base = require('base');
    var $ = require('$');

    // options 中的这些属性会直接添加到实例上
    var attrOptions = ['element', 'template', 'model'];

    // 事件代理参数中，'event selector' 的分隔符
    var delegateEventSplitter = /^(\S+)\s*(.*)$/;


    var Widget = Base.extend({

        // 如果 options 中未传入 element，则用 $(this.template) 来构建
        template: '<div></div>',

        // 初始化方法。子类覆盖时，需要调用父类的
        initialize: function(options) {
            this.cid = uniqueId();
            initOptions(this, options);
        },

        // 渲染方法，子类一般无需覆盖
        render: function() {
            this.prepareElement();
            this.delegateEvents();
            this.renderUI();
            return this;
        },

        // 根据 options、events 等属性，构建好 this.element
        // 子类可覆盖，以支持从 Handlebars 等模板构建
        prepareElement: function() {
            var element = this.element;
            var template = this.template;

            if (element) {
                this.element = element instanceof $ ? element : $(element);
            }
            // 未传入时，从 template 构建
            else if (template) {
                this.element = $(template);
            }
        },

        // 将 widget 渲染到页面上，提供给子类覆盖
        renderUI: function() {
            // Such as: this.element.appendTo(document.body);
        },

        // 绑定代理事件。events 参数为：
        //     {
        //       'mousedown .title': 'edit',
        //       'click .button': 'save'
        //       'click .open': function(e) { ... }
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
                this.element.on(eventName, selector, bind(method, this));
            }
        },

        undelegateEvents: function() {
            this.element.off('.delegateEvents' + this.cid);
        },

        // 在当前 widget 内寻找匹配节点
        $: function(selector) {
            return this.element.find(selector);
        },

        destroy: function() {
            Widget.superclass.destroy.call(this);
            this.undelegateEvents();
        }
    });

    module.exports = Widget;


    // Helpers
    // ----------------------------

    var idCounter = 0;

    function uniqueId() {
        return 'widget' + idCounter++;
    }


    function getValue(obj, prop) {
        if (!obj || !obj[prop]) return null;

        var v = obj[prop];
        return isFunction(v) ? v() : v;
    }


    function initOptions(that, options) {
        var proto = that.constructor.prototype;
        proto.options || (proto.options = {});

        // 将 proto 上的特殊 attributes 放到 proto.options 上，以便合并
        setAttrOptions(proto.options, that);

        // 合并 options
        options = that.setOptions(options).options;

        // 将 options 上的特殊 attributes 放回 this 上
        setAttrOptions(that, options);
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

});
