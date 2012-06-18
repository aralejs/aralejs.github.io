define(function(require, exports, module) {

    var $ = require('$'),
        AnimDialog = require('../src/animDialog');

    // ConfirmBox
    // -------
    // ConfirmBox 是一个有基础模板和样式的对话框组件。

    var ConfirmBox = AnimDialog.extend({

        template: '<div class="ui-confirmBox">\
                    <div class="ui-confirmBox-action"><a title="关闭" class="ui-confirmBox-close J-confirmBox-close" href="#">×</a></div>\
                    <div class="ui-confirmBox-box">\
                        <div class="ui-confirmBox-title J-confirmBox-title sl-linear-light"><h2></h2></div>\
                        <div class="ui-confirmBox-container">\
                            <div class="ui-confirmBox-content J-confirmBox-content"></div>\
                            <div class="ui-confirmBox-operation">\
                                <div class="ui-button ui-button-sorange J-confirmBox-confirm">\
                                    <a href="javascript:;" class="ui-button-text">确定</a>\
                                </div>\
                                <div class="ui-button ui-button-swhite J-confirmBox-cancel">\
                                    <a href="javascript:;" class="ui-button-text">取消</a>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
               </div>',

        attrs: {
            // 确定或提交按钮
            confirmElement: '.J-confirmBox-confirm',
            // 取消按钮
            cancelElement: '.J-confirmBox-cancel',
            // 关闭按钮
            closeElement: '.J-confirmBox-close',
            // 指定标题元素
            titleElement: '.J-confirmBox-title h2',
            // 指定标题内容
            title: '默认标题',
            // 指定内容元素
            contentElement: '.J-confirmBox-content',
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
            hasOperation: true,
            hasCloseX: true
        },

        setup: function() {
            AnimDialog.superclass.setup.call(this);

            if (!this.get('hasTitle')) {
                this.$('ui-confirmBox-title').remove();
            }
            if (!this.get('hasOperation')) {
                this.$('ui-confirmBox-operation').remove();
            }
            if (!this.get('hasCloseX')) {
                this.$('ui-confirmBox-title').remove();
            }
        }
    });

    module.exports = ConfirmBox;

});

