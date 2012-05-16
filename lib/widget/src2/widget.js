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

        // 模板，可以直接是模板字符串，也可以是 Selector
        template: '<div></div>',

        // 模板转换函数，子类可覆盖，可调用 Handlebars 等更强大的模板引擎来完成
        templateFn: function() {
            var tpl = this.template;
            var data = this.model;
            var out = tpl;

            if (data && /\{/.test(tpl)) {
                out = out.replace(/\{\{(.+?)\}\}/g, function(m, k) {
                    return data[k] ? data[k] : m;
                });
            }

            return out;
        },

        // 初始化方法，完成基本操作。子类覆盖时，记得调用父类的
        initialize: function(options) {
            this.cid = uniqueId();
            this._initOptions(options);
            this._initElement();
            this._delegateEvents();
        },

        // 在当前 view 的 element 内寻找匹配节点
        $: function(selector) {
            return this.$element.find(selector);
        },

        // 渲染方法，提供给子类覆盖
        render: function() {
        },

        // 移除掉对应的 DOM 元素，卸载掉注册的事件等销毁工作
        destroy: function() {
            Widget.superclass.destroy.call(this);
            this.undelegateEvents();
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

        // 根据传入的参数，构建好 this.$element 等属性
        _initElement: function() {
            var template = this.template;
            var element = this.element;
            var $element;

            // 初始化模板
            if (template) {
                // selector
                if (!/[<\{]/.test(template)) {
                    this.template = $(template).html();
                }
            }

            // 未传入 element 时，从 template 构建
            if (!element) {
                $element = $(this.templateFn());
            }
            // 根据传入的选项构建
            else {
                // 可以是 DOM Element, Selector, $ Object
                if (typeof element === 'string' || element.nodeType) {
                    $element = $(element);
                }
            }

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
