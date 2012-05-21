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
            comfirmElement: null,
            cancelElement: null,
            closeElement: null,
            hasMask: false,
            // 点击确定时触发的功能，供覆盖
            onComfirm: function() {},
            // 点击取消或关闭时触发的功能，供覆盖
            onClose: function() {}
        },

        parseElement: function() {
            Dialog.superclass.parseElement.call(this);
            var options = this.options;
            options.trigger = $(options.trigger);
            options.comfirmElement = this.$(options.comfirmElement);
            options.cancelElement = this.$(options.cancelElement);
            options.closeElement = this.$(options.closeElement);
        },

        delegateEvents: function() {
            var options = this.options,
                that = this;
            
            // 绑定触发对话框出现的事件
            options.trigger.bind(options.triggerType, function() {
                options.hasMask && mask.show();
                that.render().show();
            });

            // 点击确定元素
            var comfirmHandler = function() {
                that.trigger('comfirm');
                options.hasMask && mask.hide();
                that.hide();
            };
            options.comfirmElement.bind('click', comfirmHandler);

            // 点击取消或关闭元素
            var closeHandler = function() {
                that.trigger('close');
                options.hasMask && mask.hide();
                that.hide();
            };
            options.cancelElement.bind('click', closeHandler);
            options.closeElement.bind('click', closeHandler);

            // 绑定确定和关闭事件到 dom 元素上，以供全局调用
            Events.mixTo(this.element[0]);
            this.element[0].on('comfirm', comfirmHandler);
            this.element[0].on('close cancel', closeHandler);
        }

    });

    module.exports = Dialog;

});

