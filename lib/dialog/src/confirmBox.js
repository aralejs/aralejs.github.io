define(function(require, exports, module) {

    var $ = require('$'),
        AnimDialog = require('animDialog');

    // ConfirmBox
    // -------
    // ConfirmBox 是一个有基础模板和样式的对话框组件。

    var ConfirmBox = AnimDialog.extend({

        template: '<div class="ui-confirmBox">\
                    <div class="ui-confirmBox-action">\
                        <a title="关闭" class="ui-confirmBox-close" href="javascript:;">×</a>\
                    </div>\
                    <div class="ui-confirmBox-box">\
                        <div class="ui-confirmBox-title sl-linear-light"><h2></h2></div>\
                        <div class="ui-confirmBox-container">\
                            <div class="ui-confirmBox-content"></div>\
                            <div class="ui-confirmBox-operation">\
                                <div class="ui-button ui-button-sorange ui-confirmBox-confirm">\
                                    <a href="javascript:;" class="ui-button-text">确定</a>\
                                </div>\
                                <div class="ui-button ui-button-swhite ui-confirmBox-cancel">\
                                    <a href="javascript:;" class="ui-button-text">取消</a>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
               </div>',

        attrs: {
            // 确定或提交按钮
            confirmElement: '.ui-confirmBox-confirm',
            // 取消按钮
            cancelElement: '.ui-confirmBox-cancel',
            // 关闭按钮
            closeElement: '.ui-confirmBox-close',
            // 指定标题元素
            titleElement: '.ui-confirmBox-title h2',
            // 指定标题内容
            title: '默认标题',
            // 指定内容元素
            contentElement: '.ui-confirmBox-content',
            // 指定内容的 html
            content: '默认内容',

            width: 500,
            hasMask: true,
            effect: null,

            align: {
                selfXY: ['50%', '50%'],
                baseXY: ['50%', '38%']
            },

            hasTitle: true,
            hasOk: true,
            hasCancel: true,            
            hasCloseX: true
        },

        setup: function() {
            AnimDialog.superclass.setup.call(this);

            if (!this.get('hasTitle')) {
                this.$('.ui-confirmBox-title').remove();
            }
            if (!this.get('hasOk') && this.get('confirmElement')) {
                this.get('confirmElement').remove();
            }
            if (!this.get('hasCancel') && this.get('cancelElement')) {
                this.get('cancelElement').remove();
            }
            if (!this.get('hasCloseX') && this.get('closeElement')) {
                this.get('closeElement').remove();
            }
            if (!this.get('hasOk') && !this.get('hasCancel')) {
                this.$('.ui-confirmBox-operation').remove();
            }
        }
    });

    ConfirmBox.message = function(content, time) {
        var cb = new ConfirmBox({
            content: content,
            className: 'ui-confirmBox-message',
            hasTitle: false,
            hasOk: false,
            hasCancel: false,
            hasCloseX: false,
            hasMask: false,
            effect: {
                type: 'slide'
            },
            width: 'auto',
            align: {
                selfXY: ['50%', '0%'],
                baseXY: ['50%', '0%']
            }
        }).show();

        // 模拟 fixed 效果
        $(window).resize(function() {
            cb.set('align', cb.get('align'));
        }).scroll(function() {
            cb.set('align', cb.get('align'));
        });
        
        // 四秒后自动隐藏
        setTimeout(function() {
            cb.hide();
        }, time || 4000);
    };

    ConfirmBox.alert = function(content, callback) {
        new ConfirmBox({
            content: content,
            hasTitle: false,
            hasCancel: false,
            hasCloseX: false,
            onConfirm: function() {
                callback && callback();
                this.hide();
            }
        }).show();
    };

    ConfirmBox.confirm = function(content, title, confirmCb, cancelCb) {
        new ConfirmBox({
            content: content,
            title: title || '确认框',
            hasCloseX: false,
            onConfirm: function() {
                confirmCb && confirmCb();
                this.hide();
            },
            onClose: function() {
                cancelCb && cancelCb();            
            }
        }).show();
    };

    module.exports = ConfirmBox;

});

