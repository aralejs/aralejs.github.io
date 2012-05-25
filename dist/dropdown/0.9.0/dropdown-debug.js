// May the Source be with you
// 愿源码与你同在

define("#dropdown/0.9.0/dropdown-debug", ["jquery","overlay"], function(require, exports, module) {
    var $ = require('jquery');
    var Overlay = require('overlay');

    var Dropdown = Overlay.extend({
        options: {
            trigger: null, // required
            triggerType: 'hover', // click|hover
            element: null, // 目标元素
            template: '',
            width: '',
            height: '',
            delay: 0.1, // 延迟触发时间, 单位:秒
            timeout: 0.1, // 鼠标移出浮层后自动隐藏的时间。
            offset: [0, 0], // [x,y]
            zIndex: 99
        },

        initOptions: function(options) {
            Dropdown.superclass.initOptions.call(this, options);
            var that = this;
            options = that.options;
            // 对参数做适配
            var mixin = {
                parentNode: $(options.element).parent()[0],
                baseObject: {
                    element: options.trigger,
                    x: options.offset[0],
                    y: options.offset[1]
                }
            };
            $.extend(options, mixin);
            // 兼容 mouseover/hover 事件
            options.triggerType = options.triggerType.replace(/mouseover|hover/i, 'mouseenter');

        },

        parseElement: function() {
            Dropdown.superclass.parseElement.call(this);
            var options = this.options;
            this.triggerNode = $(options.trigger);
        },

        bindEvent: function() {
            var that = this;
            var options = this.options;
            var enterTimeout;
            var leaveTimeout;
            var leaveHandler = function() {
                window.clearTimeout(enterTimeout);
                leaveTimeout = window.setTimeout(function() {
                    that.hide();
                }, options.timeout * 1000);
            };
            var enterHandler = function() {
                window.clearTimeout(leaveTimeout);
            };

            this.triggerNode.on(options.triggerType, function(e) {
                e.preventDefault();
                window.clearTimeout(leaveTimeout);
                enterTimeout = window.setTimeout(function() {
                    that.show();
                }, options.delay * 1000);
                if (options.triggerType === 'click') {
                    window.clearTimeout(enterTimeout);
                    if (!that.status || that.status === 'hidden') {
                        that.show();
                        that.status = 'shown';
                    } else {
                        that.hide();
                        that.status = 'hidden';
                    }
                }
            });

            this.triggerNode.add(this.element).hover(enterHandler, leaveHandler);
        },

        init: function() {
            Dropdown.superclass.init.call(this);
            this.bindEvent();
        }

    });

    module.exports = Dropdown;

});
