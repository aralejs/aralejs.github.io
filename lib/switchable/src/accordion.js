define(function(require, exports, module) {
    var Switchable = require('./switchable');
    var $ = require('jquery');

    var SILENT = { silent: true };

    var Accordion = module.exports = Switchable.extend({
        attrs: {
            triggerType: 'click',
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
        _switchView: function(panelInfo, direction) {
            var panel = panelInfo.toPanels;
            if (this.get('multiple')) {
                $(panel).toggle();
            } else {
                Accordion.superclass._switchView.apply(this, arguments);
            }
        }
    });
});
// TODO 在多选状态下在初始化的时候，如果在页面中设置panel显示，那么在初始化的过程中
// 会再次触发，从而折叠起来。需要对初始化状态进行判断？
