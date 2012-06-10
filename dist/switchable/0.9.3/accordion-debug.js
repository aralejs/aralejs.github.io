define("#switchable/0.9.3/accordion-debug", ["./switchable","jquery"], function(require, exports, module) {

    var Switchable = require('./switchable');
    var $ = require('jquery');


    // 手风琴组件
    var Accordion = Switchable.extend({

        attrs: {
            triggerType: 'click',

            // 是否运行展开多个
            multiple: false
        },

        _onFocusTrigger: function(index) {
            if (this.get('multiple')) {

                // 比如：先悬浮，再立刻点击，这时悬浮触发的切换可以取消掉。
                this._cancelSwitchTimer();
                var fromIndex = this.get('activeIndex');
                this._switchTo(index, fromIndex);
                this.set('activeIndex', index, SILENT);
            } else {
                Accordion.superclass._onFocusTrigger.apply(this, arguments);
            }
        },

        _switchTrigger: function(toIndex, fromIndex) {
            if (this.get('multiple')) {
                var toTrigger = this.triggers[toIndex];
                $(toTrigger).toggleClass(this.get('activeTriggerClass'));
            } else {
                Accordion.superclass._switchTrigger.apply(this, arguments);
            }
        },

        // 重复触发时的有效判断
        _triggerIsValid: function(toIndex, fromIndex) {
            // multiple 模式下，再次触发意味着切换展开/收缩状态
            return this.get('multiple') ||
                Accordion.superclass._triggerIsValid.apply(this, arguments);
        },

        // 切换视图
        _switchPanel: function(panelInfo) {
            var panel = panelInfo.toPanels;
            if (this.get('multiple')) {
                $(panel).toggle();
            } else {
                Accordion.superclass._switchView.apply(this, arguments);
            }
        }
    });

    module.exports = Accordion;

});
