define(function(require, exports, module) {

    var $ = require('$'),
        Position = require('position'),
        Overlay = require('../../overlay/src/overlay'),
        mask = require('../../overlay/src/mask');


    var Dialog = Overlay.extend({

        options: {
            trigger: null,
            triggerType: 'click',
            comfirmElement: null,
            cancelElement: null,
            closeElement: null,
            hasMask: false
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
                that.options.hasMask && mask.show();
                that.render().show();
            });
            // 点击确定元素
            options.comfirmElement.bind('click', function() {
                that.onComfirm();
                that.hide();
            });
            // 点击取消或关闭元素
            var closeHandler = function() {
                that.onClose();
                that.options.hasMask && mask.hide();
                that.hide();
            };
            options.cancelElement.bind('click', closeHandler);
            options.closeElement.bind('click', closeHandler);
        },

        // 点击确定时触发的功能，供覆盖
        onComfirm: function() {},

        // 点击取消或关闭时触发的功能，供覆盖
        onClose: function() {}

    });

    module.exports = Dialog;

});

