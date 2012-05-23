define(function(require, exports, module) {

    var $ = require('$'),
        Position = require('position'),
        Overlay = require('overlay'),
        mask = require('mask'),
        Events = require('events');


    var Dialog = Overlay.extend({

        options: {
            trigger: null,
            triggerType: 'click',
            confirmElement: null,
            cancelElement: null,
            closeElement: null,
            hasMask: false,
            // 点击确定时触发的功能，供覆盖
            onConfirm: function() {},
            // 点击取消或关闭时触发的功能，供覆盖
            onClose: function() {}
        },

        parseElement: function() {
            Dialog.superclass.parseElement.call(this);
            var options = this.options;
            options.trigger = $(options.trigger);
            options.confirmElement = this.$(options.confirmElement);
            options.cancelElement = this.$(options.cancelElement);
            options.closeElement = this.$(options.closeElement);
        },

        delegateEvents: function() {
            var options = this.options,
                that = this;
            
            // 绑定触发对话框出现的事件
            options.trigger.bind(options.triggerType, function(e) {
                e.preventDefault();
                that.activeTrigger = this;
                that.render().show();
            });

            // 点击确定元素
            var confirmHandler = function(e) {
                e.preventDefault();
                that.trigger('confirm');
            };
            options.confirmElement.bind('click', confirmHandler);

            // 点击取消或关闭元素
            var closeHandler = function(e) {
                e.preventDefault();
                that.trigger('close');
                that.hide();
            };
            options.cancelElement.bind('click', closeHandler);
            options.closeElement.bind('click', closeHandler);

            // 绑定确定和关闭事件到 dom 元素上，以供全局调用
            Events.mixTo(this.element[0]);
            this.element[0].on('confirm', confirmHandler);
            this.element[0].on('close cancel', closeHandler);
        },

        show: function() {
            this.options.hasMask && mask.show();
            Dialog.superclass.show.call(this);
        },

        hide: function() {
            this.options.hasMask && mask.hide();
            Dialog.superclass.hide.call(this);            
        }

    });

    module.exports = Dialog;

});

