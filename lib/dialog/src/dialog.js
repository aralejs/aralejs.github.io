define(function(require, exports, module) {

    var $ = require('$'),
        Overlay = require('../../overlay/src/overlay'),
        mask = require('mask'),
        Events = require('events');


    var Dialog = Overlay.extend({

        attrs: {
            // 对话框触发点
            trigger: null,
            // 对话框触发方式
            triggerType: 'click',
            // 确定或提交按钮
            confirmElement: null,
            // 取消按钮
            cancelElement: null,
            // 关闭按钮
            closeElement: null,
            // 指定标题元素
            titleElement: null,
            // 指定标题内容
            title: '',
            // 指定内容元素
            contentElement: null,
            // 指定内容的 html
            content: '',
            // 内嵌 iframe 的 url
            iframeUrl: '',
            // 内容是ajax取得时，指定其来源地址
            ajaxUrl: '',
            // 是否有背景遮罩层
            hasMask: false,
            // 点击确定时触发的功能，供覆盖
            onConfirm: function() {},
            // 点击取消或关闭时触发的功能，供覆盖
            onClose: function() {},
            // 显示的动画效果
            showEffect: {
                type: 'none'
                // duration: '200',
                // easing: 'easeOut'
            },
            // 隐藏时的动画效果，若为空则采用 showEffect
            hideEffect: {}
        },

        parseElement: function() {
            Dialog.superclass.parseElement.call(this);
            this.set('trigger', $(this.get('trigger')));
            this.set('confirmElement', this.$(this.get('confirmElement')));
            this.set('cancelElement', this.$(this.get('cancelElement')));
            this.set('closeElement', this.$(this.get('closeElement')));
        },

        events : {
            'click {{attrs.confirmElement}}' : '_confirmHandler',
            'click {{attrs.cancelElement}}' : '_closeHandler',
            'click {{attrs.closeElement}}' : '_closeHandler'
        },

        _confirmHandler : function() {
            this.trigger('confirm');
        },

        _closeHandler : function() {
            this.trigger('close');
            this.hide();
        },

        delegateEvents: function() {
            Dialog.superclass.delegateEvents.call(this);

            var that = this;
            
            // 绑定触发对话框出现的事件
            this.get('trigger').bind(this.get('triggerType'), function(e) {
                e.preventDefault();
                that.activeTrigger = this;
                that.render().show();
            });

            // 绑定确定和关闭事件到 dom 元素上，以供全局调用
            Events.mixTo(this.element[0]);
            this.element[0].on('confirm', this._confirmHandler, this);
            this.element[0].on('close cancel', this._closeHandler, this); 
        },

        show: function() {
            this.get('hasMask') && mask.show();
            Dialog.superclass.show.call(this);
        },

        hide: function() {
            this.get('hasMask') && mask.hide();
            Dialog.superclass.hide.call(this);            
        }

    });

    module.exports = Dialog;

});

