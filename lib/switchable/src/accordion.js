define(function(require, exports, module) {
    var Switchable = require('./switchable');
    var $ = require('jquery');
    var Accordion = module.exports = Switchable.extend({
        attrs: {
            markupType: 1,
            triggerType: 'click',
            multiple: false
        },
        _switchTrigger: function(fromTrigger, toTrigger) {
            if (this.get('multiple')) {
                $.toggleClass(toTrigger, this.get('activeTriggerCls'));
            } else {
                Accordion.superclass._switchTrigger.apply(this, arguments);
            }
        },
        //重复触发时的有效判断
        _triggerIsValid: function(index) {
            // multiple 模式下，再次触发意味着切换展开/收缩状态
            return this.get('multiple') ||
                Accordion.superclass._triggerIsValid.call(this, index);
        },
        //切换视图
        _switchView: function(direction, ev, callback) {
            var panel = this._getFromToPanels().toPanels;

            if (this.get('multiple')) {
                $.toggle(panel);
                this._fireOnSwitch(ev);
                callback && callback.call(this);
            } else {
                Accordion.superclass._switchView.apply(this, arguments);
            }
        }
    });
});
