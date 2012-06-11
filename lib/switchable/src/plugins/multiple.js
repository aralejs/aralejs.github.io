define(function(require, exports, module) {

    var CONST = require('../const');


    // 手风琴组件
    module.exports = {

        isNeeded: function() {
            return this.get('multiple');
        },

        methods: {
            _switchTrigger: function(toIndex) {
                this.triggers.eq(toIndex).toggleClass(CONST.ACTIVE_CLASS);
            },

            _triggerIsValid: function() {
                // multiple 模式下，再次触发意味着切换展开/收缩状态
                return true;
            },

            _switchPanel: function(panelInfo) {
                panelInfo.toPanels.toggle();
            }
        }
    };

});
